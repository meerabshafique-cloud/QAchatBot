// Client-side script for the Task Manager app
const form = document.getElementById('add-form');
const titleInput = document.getElementById('title-input');
const descriptionInput = document.getElementById('description-input');
const statusInput = document.getElementById('status-input');
const list = document.getElementById('task-list');

async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  list.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const info = document.createElement('div');
    info.className = 'task-info';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;
    info.appendChild(titleSpan);

    if (task.description) {
      const descSpan = document.createElement('span');
      descSpan.className = 'task-description';
      descSpan.textContent = task.description;
      info.appendChild(descSpan);
    }

    const statusSelect = document.createElement('select');
    statusSelect.className = `status-select status-${task.status}`;
    ['todo', 'in-progress', 'done'].forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = statusLabel(status);
      option.selected = status === task.status;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener('change', () => updateTaskStatus(task.id, statusSelect.value));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(info);
    li.appendChild(statusSelect);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function statusLabel(status) {
  if (status === 'in-progress') return 'In Progress';
  if (status === 'done') return 'Done';
  return 'Todo';
}

async function addTask(title, description, status) {
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, status }),
  });
  await loadTasks();
}

async function updateTaskStatus(id, status) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  await loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  await loadTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  const description = descriptionInput.value.trim();
  const status = statusInput.value;
  addTask(title, description, status);
  titleInput.value = '';
  descriptionInput.value = '';
  statusInput.value = 'todo';
});

loadTasks();
