const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.setAttribute("draggable", "true");
    li.dataset.index = index;

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button class="complete" onclick="toggleComplete(${index})">✔</button>
        <button class="delete" onclick="deleteTask(${index})">✖</button>
      </div>
    `;

    // Drag events
    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      updateOrder();
    });

    taskList.appendChild(li);
  });

  enableDragAndDrop();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearAll() {
  tasks = [];
  saveTasks();
  renderTasks();
}

taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

function enableDragAndDrop() {
  const draggables = document.querySelectorAll("li");
  const container = taskList;

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(dragging);
    } else {
      container.insertBefore(dragging, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function updateOrder() {
  const newOrder = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const index = li.dataset.index;
    newOrder.push(tasks[index]);
  });
  tasks = newOrder;
  saveTasks();
  renderTasks();
}

renderTasks();
