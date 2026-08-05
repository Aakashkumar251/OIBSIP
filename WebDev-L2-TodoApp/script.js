
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const pendingEmpty = document.getElementById('pendingEmpty');
const completedEmpty = document.getElementById('completedEmpty');

let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  pendingCount.textContent = `${pending.length} pending`;
  completedCount.textContent = `${completed.length} completed`;

  pendingEmpty.style.display = pending.length === 0 ? 'block' : 'none';
  completedEmpty.style.display = completed.length === 0 ? 'block' : 'none';

  pending.forEach(task => pendingList.appendChild(createTaskEl(task)));
  completed.forEach(task => completedList.appendChild(createTaskEl(task)));
}

function createTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');

  const textDiv = document.createElement('div');
  textDiv.className = 'task-text';
  textDiv.textContent = task.text;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'task-time';
  timeDiv.textContent = task.completed
    ? `Added ${formatTime(task.createdAt)} · Completed ${formatTime(task.completedAt)}`
    : `Added ${formatTime(task.createdAt)}`;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = task.completed ? 'btn-undo' : 'btn-complete';
  toggleBtn.textContent = task.completed ? 'Undo' : 'Complete';
  toggleBtn.addEventListener('click', () => toggleComplete(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(toggleBtn);

  if (!task.completed) {
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id, li));
    actions.appendChild(editBtn);
  }

  actions.appendChild(deleteBtn);

  li.appendChild(textDiv);
  li.appendChild(timeDiv);
  li.appendChild(actions);
  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
    completedAt: null
  });
  taskInput.value = '';
  saveTasks();
  render();
}

function toggleComplete(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      const nowCompleted = !t.completed;
      return { ...t, completed: nowCompleted, completedAt: nowCompleted ? Date.now() : null };
    }
    return t;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function editTask(id, li) {
  const task = tasks.find(t => t.id === id);
  li.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn-complete';
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => {
    const newText = input.value.trim();
    if (newText !== '') {
      task.text = newText;
      saveTasks();
    }
    render();
  });

  li.appendChild(input);
  li.appendChild(saveBtn);
  input.focus();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

render();