const projectForm = document.getElementById('project-form');
const projectInput = document.getElementById('project-input');
const projectList = document.getElementById('project-list');
const currentProjectHeading = document.getElementById('current-project-heading');

const form = document.getElementById('add-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let currentProjectId = null;

function setTodoFormEnabled(enabled) {
  input.disabled = !enabled;
  form.querySelector('button').disabled = !enabled;
}

async function loadProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();
  renderProjects(projects);
}

function renderProjects(projects) {
  projectList.innerHTML = '';
  projects.forEach((project) => {
    const li = document.createElement('li');
    li.className = 'project-item' + (project.id === currentProjectId ? ' active' : '');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = project.name;
    nameSpan.className = 'project-name';
    nameSpan.addEventListener('click', () => selectProject(project.id, project.name));

    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', () => renameProject(project.id, project.name));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteProject(project.id));

    li.appendChild(nameSpan);
    li.appendChild(renameBtn);
    li.appendChild(deleteBtn);
    projectList.appendChild(li);
  });
}

async function addProject(name) {
  await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  await loadProjects();
}

async function renameProject(id, currentName) {
  const name = prompt('Rename project:', currentName);
  if (name === null) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: trimmed }),
  });
  if (id === currentProjectId) {
    currentProjectHeading.textContent = trimmed;
  }
  await loadProjects();
}

async function deleteProject(id) {
  await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  if (id === currentProjectId) {
    currentProjectId = null;
    currentProjectHeading.textContent = 'Select a project';
    setTodoFormEnabled(false);
    list.innerHTML = '';
  }
  await loadProjects();
}

function selectProject(id, name) {
  currentProjectId = id;
  currentProjectHeading.textContent = name;
  setTodoFormEnabled(true);
  loadTodos();
  loadProjects();
}

async function loadTodos() {
  if (!currentProjectId) return;
  const res = await fetch(`/api/todos?projectId=${encodeURIComponent(currentProjectId)}`);
  const todos = await res.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleDone(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addTodo(text) {
  if (!currentProjectId) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, projectId: currentProjectId }),
  });
  await loadTodos();
}

async function toggleDone(id, done) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  await loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  await loadTodos();
}

projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = projectInput.value.trim();
  if (!name) return;
  addProject(name);
  projectInput.value = '';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = '';
});

loadProjects();
