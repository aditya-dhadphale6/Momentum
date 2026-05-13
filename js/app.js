const clock = document.getElementById("clock");

const taskList = document.querySelector(".task-list");

const progressCircle = document.querySelector(".progress-circle");

const levelText = document.querySelector(".level");

/* Modal */

const modalOverlay = document.getElementById("modalOverlay");

const openModal = document.getElementById("openModal");

const closeModalBtn = document.getElementById("closeModalBtn");

const createTaskBtn = document.getElementById("createTaskBtn");

const taskNameInput = document.getElementById("taskName");

const taskTimeInput = document.getElementById("taskTime");

const taskDurationInput = document.getElementById("taskDuration");

const taskEmojiInput = document.getElementById("taskEmoji");

/* Data */

let tasks = JSON.parse(localStorage.getItem("momentumTasks")) || [];

let xp = Number(localStorage.getItem("momentumXP")) || 0;

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
        <h3>
          ${task.emoji} ${task.name}
        </h3>

        <p>
          ${task.time} • ${task.duration}
        </p>
      </div>

      <div class="task-actions">

        <button
          class="complete-btn"
          onclick="completeTask(${index})"
        >
          ${task.completed ? "Done ✔" : "Complete"}
        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${index})"
        >
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
  const taskName = taskNameInput.value.trim();

  const taskTime = taskTimeInput.value;

  const taskDuration = taskDurationInput.value.trim();

  const taskEmoji = taskEmojiInput.value;

  if (!taskName) return;

  tasks.push({
    name: taskName,
    time: taskTime || "Anytime",
    duration: taskDuration || "30 min",
    emoji: taskEmoji,
    completed: false,
  });

  saveTasks();

  renderTasks();

  closeModal();

  clearModalInputs();
}

/* =========================
   COMPLETE TASK
========================= */

function completeTask(index) {
  if (!tasks[index].completed) {
    tasks[index].completed = true;

    xp += 15;

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
   MODAL
========================= */

function openTaskModal() {
  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

function clearModalInputs() {
  taskNameInput.value = "";

  taskTimeInput.value = "";

  taskDurationInput.value = "";
}

/* =========================
   EVENT LISTENERS
========================= */

openModal.addEventListener("click", openTaskModal);

closeModalBtn.addEventListener("click", closeModal);

createTaskBtn.addEventListener("click", addTask);

/* =========================
   INITIALIZE
========================= */

renderTasks();

levelText.innerHTML = `⭐ XP ${xp}`;
