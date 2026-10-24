const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const taskCount = document.querySelector("#task-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const emptyState = document.querySelector("#empty-state");

let tasks = [];
let nextTaskId = 1;  

function renderTasks() {
  todoList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Your list is clear. Add a task to get started!";
    todoList.append(empty);
  } else {
    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `todo-item${task.completed ? " is-complete" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark "${task.text}" complete`);
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        renderTasks();
      });

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = task.text;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-task";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
      deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
        renderTasks();
      });

      item.append(checkbox, text, deleteButton);
      todoList.append(item);
    });
  }

  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} remaining · ${tasks.length} total`;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  tasks.push({ id: nextTaskId++, text, completed: false });
  todoInput.value = "";
  renderTasks();
  todoInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
});

// Contact form validation
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const fields = ["name", "email", "subject", "message"];

function setFieldError(fieldName, message) {
  const field = document.getElementById(fieldName);
  const error = document.getElementById(`${fieldName}-error`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message;
}

function validateContactForm() {
  let valid = true;
  const values = Object.fromEntries(fields.map((name) => [
    name,
    document.getElementById(name).value.trim()
  ]));

  fields.forEach((name) => setFieldError(name, ""));

  if (!values.name) {
    setFieldError("name", "Please enter your name.");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!values.email) {
    setFieldError("email", "Please enter your email address.");
    valid = false;
  } else if (!emailPattern.test(values.email)) {
    setFieldError("email", "Enter a valid email, such as name@example.com.");
    valid = false;
  }

  if (!values.subject) {
    setFieldError("subject", "Please enter a subject.");
    valid = false;
  }

  if (!values.message) {
    setFieldError("message", "Please enter a message.");
    valid = false;
  } else if (values.message.length < 10) {
    setFieldError("message", "Please write at least 10 characters.");
    valid = false;
  }

  return valid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!validateContactForm()) {
    formStatus.textContent = "Please correct the highlighted fields and try again.";
    formStatus.classList.add("error");
    const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Demo behaviour only: no server is connected, so no data is transmitted.
  formStatus.textContent = "Thank you! The form passed validation. This demo does not send messages to a server.";
  formStatus.classList.add("success");
  contactForm.reset();
  fields.forEach((name) => setFieldError(name, ""));
});

fields.forEach((name) => {
  const field = document.getElementById(name);
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      setFieldError(name, "");
    }
  });
});

renderTasks();
