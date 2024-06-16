const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todo");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (date) => {
  const listTodos = date ? date : todos;
  todosBody.innerHTML = "";
  if (!listTodos.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>هیچ عنوانی یافت نشد!</td></tr>";
  }

  listTodos.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
    <td>${todo.task}</td>
    <td>${e2p(todo.date) || "بدون تاریخ"}</td>
    <td>${todo.completed ? "انجام شده" : "در حال انجام"}</td>
    <td>
    <button onclick = "editHandler('${todo.id}')">ویرایش</button>
    <button onclick ="toggleHandler('${todo.id}')">${
      todo.completed ? "قبل" : "بعد"
    }</button>
    <button onclick="deleteHandler('${todo.id}')">حذف</button>

    </td>

    </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task,
    date,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("تودو با موفقیت اضافه شد", "success");
  } else {
    showAlert("لطفا یک تودو وارد کنید!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("همه تودوها حذف شدند", "success");
  } else {
    showAlert("تودویی برای حذف وجود ندارد", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("تودو حذف شد", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("وضعیت تودو تغییر کرد", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  taskInput.value = "";
  dateInput.value = "";
  saveToLocalStorage();
  displayTodos();
  showAlert("تودو ویرایش شد", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  } if(!todos.length){

    showAlert("عنوانی یافت نشد!" , "error")
  }
  displayTodos(filteredTodos)
};

window.addEventListener("load", ()=>displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
