let tasksList = [];

document.getElementById("addBtn").onclick = addTask;

document.addEventListener("DOMContentLoaded", () => {
  tasksList = JSON.parse(localStorage.getItem("tasks")) || []; // добавил [] для того, чтобы не было ошибки при считывании из пустого localStorage
  if (tasksList) {
    displayTasks();
  }
});

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let name = taskInput.value.trim();

  if (!name) {
    alert("Вы забыли назвать задачу!");
    return;
  }

  if (tasksList && doesTaskExist(name, tasksList)) {
    alert("Задача с таким названием уже существует");
    taskInput.value = "";
  } else {
    let newTask = {
      name: name,
      completed: false,
    };

    tasksList.push(newTask);
    taskInput.value = "";
    saveTasks(tasksList);
    displayTasks();
  }
}

function saveTasks(list) {
  localStorage.setItem("tasks", JSON.stringify(list));
}

function doesTaskExist(name, list) {
  if (list.findIndex((item) => item.name == name) === -1) {
    return false;
  } else {
    return true;
  }
}

function editTask(name) {
  const newName = prompt("Введите новое значение задачи", name);
  if (!newName) { // проверка на пустое значение
    alert("Введите корректное значение, либо удалите задачу!");
    return;
  }
  if (doesTaskExist(newName, tasksList)) {
    alert("Задача с таким названием уже существует");
  } else {
    tasksList[tasksList.findIndex((item) => item.name == name)].completed = false; // отредактированная задача считается не выполненной
    tasksList[tasksList.findIndex((item) => item.name == name)].name = newName.trim();
    saveTasks(tasksList);
    displayTasks();
  }
}

function deleteTask(name) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList = tasksList.filter((item) => item.name !== name);
    saveTasks(tasksList);
    displayTasks();
  }
}

function changeStatus(name, saveFilter) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList[tasksList.findIndex((item) => item.name == name)].completed =
      !tasksList[tasksList.findIndex((item) => item.name == name)].completed;
    saveTasks(tasksList);
    displayTasks(saveFilter);
  }
}

function displayTasks(filter = "all") {
  let filterInput = document.getElementById("filterInput");
  let filterText = filterInput.value.trim().toLowerCase();
  let taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  let filteredTasks = tasksList.filter((task) => {
    if (filter === "выполнено") return task.completed;
    if (filter === "не выполнено") return !task.completed;
    if (filterText)  return (task.name.toLowerCase().includes(filterText));
    return true;
  });

  filteredTasks.forEach((task) => {
    let listItem = document.createElement("li");
    let taskText = document.createElement("span");
    taskText.textContent = task.name;
    taskText.style.cursor = "pointer";
    taskText.style.textDecoration = task.completed ? "line-through" : "";
    taskText.style.color = task.completed ? "green" : "red";

    let taskStatus = document.createElement("span");
    taskStatus.textContent = task.completed ? "выполнено" : "не выполнено";

    taskText.ondblclick = () => editTask(task.name);

    let editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    editBtn.onclick = (event) => {
      event.stopPropagation();
      editTask(task.name);
    };

    let changeStatusBtn = document.createElement("button");
    changeStatusBtn.textContent = "Изменить статус";
    changeStatusBtn.onclick = (event) => {
      event.stopPropagation();
      changeStatus(task.name, filter);
    };

    let delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";
    delBtn.onclick = (event) => {
      event.stopPropagation();
      deleteTask(task.name);
    };

    listItem.appendChild(taskText);
    listItem.appendChild(taskStatus);
    listItem.appendChild(editBtn);
    listItem.appendChild(changeStatusBtn);
    listItem.appendChild(delBtn);
    taskListElement.appendChild(listItem);

  });
}
