let tasksList = [];

// let name = taskInput.value.trim();

const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", addTask);

document.addEventListener("DOMContentLoaded", () => {
  tasksList = JSON.parse(localStorage.getItem("tasks")) || []; // добавил [] для того, чтобы не было ошибки при считывании из пустого localStorage
  if (tasksList) {
    listUpdate(tasksList);
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
    listUpdate(tasksList);
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

// function editTask(button) {
//   const li = button.parentElement;
//   const name = li.querySelector("span").textContent;
//   const newName = prompt("Введите новое значение задачи", name);

//   if (newName !== null && newName !== "") {
//     if (doesTaskExist(newName, tasksList)) {
//       alert("Задача с таким названием уже существует");
//     } else {
//       tasksList[tasksList.findIndex((item) => item.name == name)].name =
//         newName.trim();
//       saveTasks(tasksList);
//       listUpdate(tasksList);
//     }
//   }
// }

// function editTask(name) {
//   const li = button.parentElement;
//   const name = li.querySelector("span").textContent;
//   const newName = prompt("Введите новое значение задачи", name);

//   if (newName !== null && newName !== "") {
//     if (doesTaskExist(newName, tasksList)) {
//       alert("Задача с таким названием уже существует");
//     } else {
//       tasksList[tasksList.findIndex((item) => item.name == name)].name =
//         newName.trim();
//       saveTasks(tasksList);
//       listUpdate(tasksList);
//     }
//   }
// }

function deleteTask(name) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList = tasksList.filter((item) => item.name !== name);
    saveTasks(tasksList);
    listUpdate(tasksList);
  }
}

function changeStatus(name) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList[tasksList.findIndex((item) => item.name == name)].completed =
      !tasksList[tasksList.findIndex((item) => item.name == name)].completed;
    listUpdate(tasksList);
    saveTasks(tasksList);
  }
}

function filterTasks() {
  const filterInput = document.getElementById("filterInput");
  const filterText = filterInput.value.trim().toLowerCase();
  const taskList = document.getElementById("taskList");

  Array.from(taskList.children).forEach((li) => {
    const taskText = li.querySelector("span").textContent.toLowerCase();
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

function listUpdate(list) {
  const html = list
    .map(
      (item) => `<li>
      <span id='name' style='cursor: pointer; ${
        item.completed
          ? "color: green; text-decoration: line-through;"
          : "color: red"
      }' ondblclick="editTask(this)">${item.name}</span>
      <span id='status'>${item.completed ? "выполнено" : "не выполнено"}</span>
      <button onclick="editTask(this)">Редактировать задачу</button>
      <button onclick="changeStatus('${item.name}')">Изменить статус</button>
      <button onclick="deleteTask('${item.name}')">Удалить</button>
    </li>`
    )
    .join("");
  document.querySelector("ul").innerHTML = html;
}
