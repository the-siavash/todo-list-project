// let todos = [];
let todos = getAllTodos(); // get all todos from local storage

const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-form .todo-input");
const todoList = document.querySelector(".todo-items");

const todoFilter = document.querySelector("#filter");
const filterSelectedIndex = todoFilter.options.selectedIndex;
let filterValue = todoFilter.item(filterSelectedIndex).value;

const modal = document.querySelector(".modal-wrapper");
const modalCloseBtn = document.querySelector(".modal .btn--close");
const editTodoForm = document.querySelector(".edit-todo-form");
const editTodoInput = document.querySelector(".edit-todo-form .todo-input");

const todoCompletedCount = document.querySelector("#todo-completed-count");
const todoAllCount = document.querySelector("#todo-all-count");
let completedTodosCount;

// events

todoForm.addEventListener("submit", createTodoItem);

todoFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  todos = getAllTodos();
  createTodoItemDOM(todos);

  // show the numbers of todo completed/uncompleted items
  todoAllCount.innerHTML = todos.length;
  updateTodoCompleteCount(todos);
});

modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

editTodoForm.addEventListener("submit", editTodoItem);

function createTodoItem(event) {
  event.preventDefault();

  if (!todoInput.value) return null;

  const newTodoItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    editedAt: null,
    title: todoInput.value,
    isCompleted: false,
  };

  todos.push(newTodoItem);
  setAllTodos(todos);

  // add todo-items to the DOM
  filterTodos();

  todoAllCount.innerHTML = todos.length;
}

function createTodoItemDOM(todos) {
  let result = "";

  todos.forEach((todoItem) => {
    result += `<li class="todo-item icon">
    <button class="btn check-box" data-todo-id=${todoItem.id}>
      ${
        todoItem.isCompleted === false
          ? '<i class="fa-regular fa-square btn--unchecked"></i>'
          : '<i class="fa-regular fa-square-check btn--checked"></i>'
      }
    </button>
    <p class="todo-item__text ${
      todoItem.isCompleted === false ? "" : "checked"
    }">${todoItem.title}</p>
    <span class="todo-item__date badge">
      <i class="fa-solid fa-calendar-days"></i>
      <span>
        ${new Date(todoItem.createdAt).toLocaleDateString()}
      </span>
    </span>
    <button class="btn btn--edit" data-todo-id=${todoItem.id}>
      <i class="fa-regular fa-pen-to-square"></i>
    </button>
    <button class="btn btn--remove" data-todo-id=${todoItem.id}>
      <i class="fa-regular fa-square-minus"></i>
    </button>
  </li>`;
  });

  todoList.innerHTML = "";
  todoList.innerHTML = result;
  todoInput.value = "";

  // DOM events: remove
  const removeTodos = [...document.querySelectorAll(".btn--remove")];
  removeTodos.forEach((todo) => todo.addEventListener("click", removeTodoItem));

  // DOM events: Completed/Uncompleted
  const todoCheckBox = [
    ...document.querySelectorAll(".todo-item button.check-box"),
  ];
  todoCheckBox.forEach((todo) => todo.addEventListener("click", checkTodoItem));

  // DOM events: edit
  const editTodoItems = [...document.querySelectorAll(".btn--edit")];
  editTodoItems.forEach((todoItem) =>
    todoItem.addEventListener("click", showTodoItem)
  );
}

function filterTodos() {
  // const filterValue = event.target.value;
  switch (filterValue) {
    case "all": {
      createTodoItemDOM(todos);
      break;
    }
    case "completed": {
      const filterdTodos = todos.filter(
        (todoItem) => todoItem.isCompleted === true
      );
      createTodoItemDOM(filterdTodos);
      break;
    }
    case "uncompleted": {
      const filterdTodos = todos.filter(
        (todoItem) => todoItem.isCompleted === false
      );
      createTodoItemDOM(filterdTodos);
      break;
    }
  }
}

function removeTodoItem(event) {
  const todoItemId = Number(event.target.dataset.todoId); // with "data attribute" (data-x)
  todos = todos.filter((todoItem) => todoItem.id !== todoItemId);
  setAllTodos(todos);
  // createTodoItemDOM(todos);
  filterTodos();

  todoAllCount.innerHTML = todos.length;
  updateTodoCompleteCount(todos);
}

function checkTodoItem(event) {
  const todoItemId = Number(event.target.dataset.todoId);
  const todo = todos.find((todoItem) => todoItem.id === todoItemId);
  todo.isCompleted = !todo.isCompleted;
  setAllTodos(todos);
  // createTodoItemDOM(todos);
  filterTodos();
  updateTodoCompleteCount(todos);
}

function editTodoItem(event) {
  event.preventDefault();
  const todoItemId = Number(event.target.elements[0].dataset.todoId);
  const todo = todos.find((todoItem) => todoItem.id === todoItemId);

  if (editTodoInput.value) {
    todo.title = editTodoInput.value;
    todo.editedAt = new Date().toISOString();
  }

  console.log(todo);
  setAllTodos(todos);
  filterTodos();

  modal.style.display = "none";
}

function showTodoItem(event) {
  modal.style.display = "grid";

  const todoItemId = Number(event.target.dataset.todoId);
  const todo = todos.find((todoItem) => todoItem.id === todoItemId);

  editTodoInput.value = todo.title;
  editTodoInput.dataset.todoId = todoItemId;
}

function updateTodoCompleteCount(todos) {
  todoCompletedCount.innerHTML = todos.filter(
    (todoItem) => todoItem.isCompleted === true
  ).length;
}

// == Local Storage (Web API) ==

function getAllTodos() {
  // get all todos from local storage and show them
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function setAllTodos(todos) {
  // save all todos to local storage
  localStorage.setItem("todos", JSON.stringify(todos));
}
