// Client-side script for the TO-DO list app
const form = document.getElementById('add-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

async function loadTodos() {
  const res = await fetch('/api/todos');
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

    if (Array.isArray(todo.gender) && todo.gender.length) {
      const genderSpan = document.createElement('span');
      genderSpan.className = 'todo-gender';
      genderSpan.textContent = `(${todo.gender.join(', ')})`;
      span.appendChild(document.createTextNode(' '));
      span.appendChild(genderSpan);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addTodo(text, gender) {
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, gender }),
  });
  await const showFlowerBtn = document.getElementById('show-flower-btn');
const flowerDisplay = document.getElementById('flower-display');

showFlowerBtn.addEventListener('click', () => {
  flowerDisplay.classList.toggle('hidden');
});

loadTodos();
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const gender = Array.from(form.querySelectorAll('input[name="gender"]:checked')).map(
    (el) => el.value
  );
  addTodo(text, gender);
  input.value = '';
  form.querySelectorAll('input[name="gender"]').forEach((el) => (el.checked = false));
});

loadTodos();
