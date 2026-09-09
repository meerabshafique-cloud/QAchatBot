// Client-side script for the TO-DO list app
const form = document.getElementById('add-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const answerToggle = document.getElementById('answer-toggle');
const pronounToggle = document.getElementById('pronoun-toggle');

answerToggle.addEventListener('click', () => {
  const next = answerToggle.dataset.value === 'Yes' ? 'No' : 'Yes';
  answerToggle.dataset.value = next;
  answerToggle.textContent = next;
});

pronounToggle.addEventListener('click', () => {
  const next = pronounToggle.dataset.value === 'She' ? 'He' : 'She';
  pronounToggle.dataset.value = next;
  pronounToggle.textContent = next;
});

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

    const answerSpan = document.createElement('span');
    answerSpan.className = 'todo-answer';
    answerSpan.textContent = `[${todo.answer === 'Yes' ? 'Yes' : 'No'}]`;
    span.appendChild(document.createTextNode(' '));
    span.appendChild(answerSpan);

    const pronounSpan = document.createElement('span');
    pronounSpan.className = 'todo-pronoun';
    pronounSpan.textContent = `(${todo.pronoun === 'He' ? 'He' : 'She'})`;
    span.appendChild(document.createTextNode(' '));
    span.appendChild(pronounSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addTodo(text, gender, answer, pronoun) {
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, gender, answer, pronoun }),
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const gender = Array.from(form.querySelectorAll('input[name="gender"]:checked')).map(
    (el) => el.value
  );
  const answer = answerToggle.dataset.value;
  const pronoun = pronounToggle.dataset.value;
  addTodo(text, gender, answer, pronoun);
  input.value = '';
  form.querySelectorAll('input[name="gender"]').forEach((el) => (el.checked = false));
  answerToggle.dataset.value = 'No';
  answerToggle.textContent = 'No';
  pronounToggle.dataset.value = 'She';
  pronounToggle.textContent = 'She';
});

loadTodos();
