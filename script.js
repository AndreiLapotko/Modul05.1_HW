let tasksList = [];

// let name = taskInput.value.trim();

// const addBtn = document.getElementById("addBtn");
document.getElementById("addBtn").onclick = addTask;
// addBtn.addEventListener("click", addTask);

document.addEventListener("DOMContentLoaded", () => {
  tasksList = JSON.parse(localStorage.getItem("tasks")) || []; // добавил [] для того, чтобы не было ошибки при считывании из пустого localStorage
  if (tasksList) {
    // listUpdate(tasksList);
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
    // listUpdate(tasksList);
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
    // listUpdate(tasksList);
    displayTasks();
  }
}

function deleteTask(name) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList = tasksList.filter((item) => item.name !== name);
    saveTasks(tasksList);
    // listUpdate(tasksList);
    displayTasks();
  }
}

function changeStatus(name) {
  if (!doesTaskExist(name, tasksList)) {
    alert("Задачи с таким названием нет в списке!");
  } else {
    tasksList[tasksList.findIndex((item) => item.name == name)].completed =
      !tasksList[tasksList.findIndex((item) => item.name == name)].completed;
    saveTasks(tasksList);
    // listUpdate(tasksList);
    displayTasks();
  }
}

function filterTasks() {
  const filterInput = document.getElementById("filterInput");
  const filterText = filterInput.value.trim().toLowerCase();
  const taskList = document.getElementById("taskList");

  arrayTasks = Array.from(taskList.children);

  arrayTasks.forEach((li) => {
    const taskText = li.querySelector("span").textContent.toLowerCase();
    if (taskText.includes(filterText)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
}

// function displayTasks(filter = "all") {
//   let taskList = document.getElementById("taskList");

//   Array.from(taskList.children).forEach((item) => {
//     let taskStatus = item.querySelector("#status").textContent;

//     if (taskStatus === filter || filter === "all") {
//       item.style.display = "";
//     } else {
//       item.style.display = "none";
//     }
//   });
// }

function displayTasks(filter = "all") {
  let filterInput = document.getElementById("filterInput");
  let filterText = filterInput.value.trim().toLowerCase();
  let taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  let filteredTasks = tasksList.filter((task) => {
    if (filter === "выполнено") return task.completed;
    if (filter === "не выполнено") return !task.completed;
    console.log(task.name.toLowerCase().includes(filterText));
    if (filterText)  return (task.name.toLowerCase().includes(filterText));
    return true;
  });
  console.log(filteredTasks);
  console.log(filterText);
  

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
      changeStatus(task.name);
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

// function listUpdate(list) {
//   const html = list
//     .map(
//       (item) => `<li>
//   <span id='name' style='cursor: pointer; ${
//     item.completed
//       ? "color: green; text-decoration: ine-through;"
//       : "color: red"
//   }' ondblclick="editTask('${item.name}')">${item.name}</span>
//       <span id='status'>${item.completed ? "выполнено" : "не выполнено"}</span>
//       <button id='editBtn' onclick="editTask('${
//         item.name
//       }')">Редактировать задачу(имя)</button>
//       <button onclick="changeStatus('${item.name}')">Изменить статус</button>
//       <button onclick="deleteTask('${item.name}')">Удалить</button>
//     </li>`
//     )
//     .join("");
//   document.querySelector("ul").innerHTML = html;
// }
