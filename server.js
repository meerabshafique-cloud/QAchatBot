const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readTodos() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

app.get('/api/todos', (req, res) => {
  res.json(readTodos());
});

app.post('/api/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  const gender = Array.isArray(req.body.gender)
    ? req.body.gender.filter((g) => typeof g === 'string')
    : [];
  const answer = req.body.answer === 'Yes' ? 'Yes' : 'No';
  const todos = readTodos();
  const todo = {
    id: crypto.randomUUID(),
    text,
    gender,
    answer,
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
