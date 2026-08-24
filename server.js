const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const TODOS_FILE = path.join(__dirname, 'data', 'todos.json');
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readTodos() {
  return readJson(TODOS_FILE);
}

function writeTodos(todos) {
  writeJson(TODOS_FILE, todos);
}

function readProjects() {
  return readJson(PROJECTS_FILE);
}

function writeProjects(projects) {
  writeJson(PROJECTS_FILE, projects);
}

// Projects

app.get('/api/projects', (req, res) => {
  res.json(readProjects());
});

app.post('/api/projects', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const projects = readProjects();
  const project = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
  projects.push(project);
  writeProjects(projects);
  res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  if (typeof req.body.name === 'string') {
    const name = req.body.name.trim();
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    project.name = name;
  }
  writeProjects(projects);
  res.json(project);
});

app.delete('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'project not found' });
  }
  const [removed] = projects.splice(index, 1);
  writeProjects(projects);

  const todos = readTodos();
  const remaining = todos.filter((t) => t.projectId !== req.params.id);
  writeTodos(remaining);

  res.json(removed);
});

// Todos

app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  if (req.query.projectId) {
    return res.json(todos.filter((t) => t.projectId === req.query.projectId));
  }
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  const projectId = req.body.projectId;
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!projectId) {
    return res.status(400).json({ error: 'projectId is required' });
  }
  const projects = readProjects();
  if (!projects.some((p) => p.id === projectId)) {
    return res.status(400).json({ error: 'project not found' });
  }
  const todos = readTodos();
  const todo = {
    id: crypto.randomUUID(),
    projectId,
    text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  writeTodos(todos);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' });
  }
  if (typeof req.body.text === 'string') {
    todo.text = req.body.text.trim();
  }
  if (typeof req.body.done === 'boolean') {
    todo.done = req.body.done;
  }
  writeTodos(todos);
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'todo not found' });
  }
  const [removed] = todos.splice(index, 1);
  writeTodos(todos);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`QAchatBot TO-DO app listening on http://localhost:${PORT}`);
});
