let tasksList = [];

document.addEventListener("DOMContentLoaded", () => {
  tasksList = JSON.parse(localStorage.getItem("tasks"));
  listUpdate();
});

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let name = taskInput.value.trim();
  if (name) {
    if (doesTaskExist(name)) {
      alert("Задача с таким названием уже существует");
    } else {
      let newTask = {
        name: name,
        completed: false,
      };
      tasksList.push(newTask);
      saveTasks();
      taskInput.value = "";
      listUpdate();
    }
  } else {
    alert("Вы забыли назвать задачу!");
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function doesTaskExist(name) {
  if (tasksList.findIndex((item) => item.name == name) === -1) {
    return false;
  } else {
    return true;
  }
}

function editTask(button) {
  const li = button.parentElement;
  const name = li.querySelector("span").textContent;
  const newName = prompt("Введите новое значение задачи", name);

  if (newName !== null && newName !== "") {
    if (doesTaskExist(newName)) {
      alert("Задача с таким названием уже существует");
    } else {
      tasksList[tasksList.findIndex((item) => item.name == name)].name =
        newName.trim();
      saveTasks();
      listUpdate();
    }
  }
}

function deleteTask(name) {
  if (!doesTaskExist(name)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList = tasksList.filter((item) => item.name !== name);
    saveTasks();
    listUpdate();
  }
}

function changeStatus(name) {
  if (!doesTaskExist(name)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList[tasksList.findIndex((item) => item.name == name)].completed =
      !tasksList[tasksList.findIndex((item) => item.name == name)].completed;
    listUpdate();
    saveTasks();
  }
}

function filterTasks() {
  const filterInput = document.getElementById("filterInput");
  const filterText = filterInput.value.trim().toLowerCase();
  const taskList = document.getElementById("taskList");

  Array.from(taskList.children).forEach((li) => {
    const taskText = li.querySelector("span").textContent.toLowerCase();
    taskText.addEventListener("dblclick", () => { });
    if (taskText.includes(filterText)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
}

function displayTasks(filter = "all") {
  let taskList = document.getElementById("taskList");
  let filterText = filter;

  Array.from(taskList.children).forEach((item) => {
    let taskStatus = item.querySelector("#status").textContent;

    if (taskStatus === filter || filter === "all") {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}


function listUpdate() {
  let array = tasksList;
  const html = array
    .map(
      (item) => `<li>
      <span id='name' style='cursor: pointer; ${item.completed ? "color: green; text-decoration: line-through;" : "color: red"}' ondblclick="editTask(this)">${item.name}</span>
      <span id='status'>${item.completed ? "выполнено" : "не выполнено"}</span>
      <button onclick="editTask(this)">Редактировать задачу</button>
      <button onclick="changeStatus('${item.name}')">Изменить статус</button>
      <button onclick="deleteTask('${item.name}')">Удалить</button>
    </li>`
    )
    .join("");
  document.querySelector("ul").innerHTML = html;
}
