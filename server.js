const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readTasks() {
  const raw = await fs.readFile(TASKS_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const tasks = await readTasks();
  const task = { id: crypto.randomUUID(), text: text.trim(), done: false };
  tasks.push(task);
  await writeTasks(tasks);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  const { text, done } = req.body;
  if (typeof text === 'string' && text.trim()) task.text = text.trim();
  if (typeof done === 'boolean') task.done = done;
  await writeTasks(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'task not found' });
  }
  tasks.splice(index, 1);
  await writeTasks(tasks);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Task manager running at http://localhost:${PORT}`);
});
