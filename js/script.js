// Seleção de elementos
const todoForm = document.querySelector("#to-do-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = async (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Se a tarefa estiver marcada como concluída, adicionar a classe 'done'
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    await saveTodoLocalStorage({ text, done });  // Usando await
  }

  todoList.appendChild(todo);
  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = async (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    await saveTodo(inputValue); // Usando await
  }
});

document.addEventListener("click", async (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    await updateTodoStatusLocalStorage(todoTitle); // Usando await
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    await removeTodoLocalStorage(todoTitle); // Usando await
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    await updateTodo(editInputValue); // Usando await
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value.toLowerCase();
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = async () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const loadTodos = async () => {
  const todos = await getTodosLocalStorage();

  todos.forEach(async (todo) => {
    await saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = async (todo) => {
  const todos = await getTodosLocalStorage();

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = async (todoText) => {
  const todos = await getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = async (todoText) => {
  const todos = await getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text === todoText) {
      todo.done = !todo.done; // Atualiza o status de 'done'
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = async (todoOldText, todoNewText) => {
  const todos = await getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text === todoOldText) {
      todo.text = todoNewText;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Carregar todos ao iniciar a página
document.addEventListener("DOMContentLoaded", async () => {
  await loadTodos();
});


