const clock = document.getElementById("clock");

const taskList = document.querySelector(".task-list");

const addBtn = document.querySelector(".add-btn");

const progressCircle = document.querySelector(".progress-circle");

const streakText = document.querySelector(".streak");

const levelText = document.querySelector(".level");

let tasks = JSON.parse(localStorage.getItem("momentumTasks")) || [];

let xp = Number(localStorage.getItem("momentumXP")) || 0;

let completedTasks = 0;

/* =========================
   LIVE CLOCK
========================= */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  clock.innerHTML = `
    ${time}
    <p>${date}</p>
  `;
}

setInterval(updateClock, 1000);

updateClock();

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        No tasks yet 🚀
      </div>
    `;

    updateProgress();
    return;
  }

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");

    taskDiv.classList.add("task-item");

    if (task.completed) {
      taskDiv.style.opacity = "0.6";
    }

    taskDiv.innerHTML = `
      <div>
        <h3>${task.emoji} ${task.name}</h3>
        <p>
          ${task.time} • ${task.duration}
        </p>
      </div>

      <div class="task-actions">

        <button class="complete-btn"
          onclick="completeTask(${index})">
          ${task.completed ? "Done ✔" : "Complete"}
        </button>

        <button class="delete-btn"
          onclick="deleteTask(${index})">
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(taskDiv);
  });

  updateProgress();
}

/* =========================
   ADD TASK
========================= */

function addTask() {
  const taskName = prompt("Enter task name:");

  if (!taskName) return;

  const taskTime = prompt("Enter task time:");

  const taskDuration = prompt("Enter duration:");

  const emojis = ["📚", "💻", "🔥", "🎯", "🚀", "🧠"];

  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  tasks.push({
    name: taskName,
    time: taskTime || "Anytime",
    duration: taskDuration || "30 min",
    emoji: randomEmoji,
    completed: false,
  });

  saveTasks();

  renderTasks();
}

/* =========================
   COMPLETE TASK
========================= */

function completeTask(index) {
  if (!tasks[index].completed) {
    tasks[index].completed = true;

    xp += 15;

    completedTasks++;

    levelText.innerHTML = `⭐ XP ${xp}`;
  }

  saveTasks();

  renderTasks();
}

/* =========================
   DELETE TASK
========================= */

function deleteTask(index) {
  tasks.splice(index, 1);

  saveTasks();

  renderTasks();
}

/* =========================
   PROGRESS
========================= */

function updateProgress() {
  const completed = tasks.filter((task) => task.completed).length;

  const progress =
    tasks.length === 0 ? 0 : Math.floor((completed / tasks.length) * 100);

  progressCircle.innerText = `${progress}%`;
}

/* =========================
   SAVE TASKS
========================= */

function saveTasks() {
  localStorage.setItem("momentumTasks", JSON.stringify(tasks));

  localStorage.setItem("momentumXP", xp);
}

/* =========================
   EVENT LISTENERS
========================= */

addBtn.addEventListener("click", addTask);

/* =========================
   INITIALIZE
========================= */

renderTasks();

levelText.innerHTML = `⭐ XP ${xp}`;
