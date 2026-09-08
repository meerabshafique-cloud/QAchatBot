const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');
const STATUSES = ['todo', 'in-progress', 'done'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readTasks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
  let status = 'todo';
  if (typeof req.body.status === 'string' && req.body.status) {
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }
    status = req.body.status;
  }
  const tasks = readTasks();
  const task = {
    id: crypto.randomUUID(),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  if (typeof req.body.title === 'string') {
    task.title = req.body.title.trim();
  }
  if (typeof req.body.description === 'string') {
    task.description = req.body.description.trim();
  }
  if (typeof req.body.status === 'string') {
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }
    task.status = req.body.status;
  }
  writeTasks(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'task not found' });
  }
  const [removed] = tasks.splice(index, 1);
  writeTasks(tasks);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`QAchatBot Task Manager listening on http://localhost:${PORT}`);
});
