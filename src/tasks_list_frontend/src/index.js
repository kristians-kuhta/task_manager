import { tasks_list_backend } from "../../declarations/tasks_list_backend";

const disableDocumentButtons = () => {
  document.querySelectorAll('button').forEach((button) => {
    button.setAttribute("disabled", true);
  });
};

const enableDocumentButtons = () => {
  document.querySelectorAll('button').forEach((button) => {
    button.removeAttribute("disabled");
  });
};

const handleTaskEdit = async (evt, taskId) => {
  disableDocumentButtons();
  const titleInput = evt.target.closest('[data-title]').querySelector('[data-title-input]');
  const title = titleInput.value;
  const result = await tasks_list_backend.editTask(taskId, title);
  enableDocumentButtons();

  renderTasks();
};

const handleTaskRemove = async (taskId) => {
  await tasks_list_backend.removeTask(taskId);
  renderTasks();
};

const renderTasks = async () => {
  // Find tasks lists
  const tasksList = document.querySelector('#tasks_list');
  tasksList.innerHTML = '';

  // Fetch tasks
  const tasks = await tasks_list_backend.getTasks();
  const orderedTasks = [];
  tasks.forEach(([taskId, task]) => orderedTasks[taskId] = task);


  // Copy template
  const taskTemplate = document.querySelector('#task_list_item_template');

  // For each task:
  // NOTE: task Id is the same as its index upon retrieval
  orderedTasks.forEach((task, taskId) => {
    const taskElement = taskTemplate.cloneNode(true);
    taskElement.classList.remove("hidden");

    const titleElement = taskElement.querySelector('[data-title-input]');
    const createdAtElement = taskElement.querySelector('[data-created-at]');
    const editedAtElement = taskElement.querySelector('[data-edited-at]');
    const editTaskButton = taskElement.querySelector('[data-edit-task-btn');
    const removeTaskButton = taskElement.querySelector('[data-remove-task-btn');

    // NOTE: this is an input field
    titleElement.value = task.title;

    createdAtElement.innerText = new Date(task.createdAt).toString();
    editedAtElement.innerText = new Date(task.editedAt).toString();

    editTaskButton.addEventListener('click', (evt) => handleTaskEdit(evt, taskId));
    removeTaskButton.addEventListener('click', () => handleTaskRemove(taskId));

    tasksList.prepend(taskElement);
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector("#new_task_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = e.target.querySelector("button");
    const titleInput = document.getElementById("title");
    const title = titleInput.value.toString();

    disableDocumentButtons();

    // Interact with task list actor, calling the add task method
    const result = await tasks_list_backend.addTask(title);

    enableDocumentButtons();
    titleInput.value = '';
    renderTasks();
  });

  renderTasks();
});
