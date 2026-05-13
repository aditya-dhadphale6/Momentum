/* =========================
   ELEMENTS
========================= */

const clock = document.getElementById("clock");

const taskList = document.querySelector(".task-list");

const progressCircle = document.querySelector(".progress-circle");

const levelText = document.querySelector(".level");

/* =========================
   MODAL ELEMENTS
========================= */

const modalOverlay = document.getElementById("modalOverlay");

const openModal = document.getElementById("openModal");

const closeModalBtn = document.getElementById("closeModalBtn");

const createTaskBtn = document.getElementById("createTaskBtn");

const taskNameInput = document.getElementById("taskName");

const taskTimeInput = document.getElementById("taskTime");

const taskDurationInput = document.getElementById("taskDuration");

const taskEmojiInput = document.getElementById("taskEmoji");

/* =========================
   SOUND + EFFECTS
========================= */

const completeSound = document.getElementById("completeSound");

const successSound = document.getElementById("successSound");

const xpPopup = document.getElementById("xp-popup");

const confettiContainer = document.getElementById("confetti-container");

/* =========================
   TIMER ELEMENTS
========================= */

const timerCircle = document.querySelector(".timer-circle");

const startTimerBtn = document.getElementById("startTimerBtn");

const resetTimerBtn = document.getElementById("resetTimerBtn");

/* =========================
   DATA
========================= */

let tasks = JSON.parse(localStorage.getItem("momentumTasks")) || [];

let xp = Number(localStorage.getItem("momentumXP")) || 0;

/* =========================
   TIMER DATA
========================= */

let timer;

let totalSeconds = 1500;

let isRunning = false;

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

    completeSound.play();

    showXPPopup();

    launchConfetti();
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
   MODAL FUNCTIONS
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
   XP POPUP
========================= */

function showXPPopup() {
  xpPopup.classList.add("show");

  setTimeout(() => {
    xpPopup.classList.remove("show");
  }, 2000);
}

/* =========================
   CONFETTI
========================= */

function launchConfetti() {
  const colors = ["#58cc02", "#ffd93d", "#ff6b6b", "#4d96ff", "#ffffff"];

  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");

    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * window.innerWidth + "px";

    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";

    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

/* =========================
   TIMER FUNCTIONS
========================= */

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  timerCircle.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) {
    clearInterval(timer);

    isRunning = false;

    startTimerBtn.innerText = "Start";

    timerCircle.classList.remove("timer-active");

    return;
  }

  isRunning = true;

  startTimerBtn.innerText = "Pause";

  timerCircle.classList.add("timer-active");

  timer = setInterval(() => {
    totalSeconds--;

    updateTimerDisplay();

    if (totalSeconds <= 0) {
      clearInterval(timer);

      isRunning = false;

      totalSeconds = 1500;

      updateTimerDisplay();

      startTimerBtn.innerText = "Start";

      timerCircle.classList.remove("timer-active");

      successSound.play();

      launchConfetti();

      xp += 25;

      levelText.innerHTML = `⭐ XP ${xp}`;

      showXPPopup();

      saveTasks();

      alert("Focus session completed 🚀");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);

  isRunning = false;

  totalSeconds = 1500;

  updateTimerDisplay();

  startTimerBtn.innerText = "Start";

  timerCircle.classList.remove("timer-active");
}

/* =========================
   EVENT LISTENERS
========================= */

openModal.addEventListener("click", openTaskModal);

closeModalBtn.addEventListener("click", closeModal);

createTaskBtn.addEventListener("click", addTask);

startTimerBtn.addEventListener("click", startTimer);

resetTimerBtn.addEventListener("click", resetTimer);

/* =========================
   INITIALIZE
========================= */

renderTasks();

updateTimerDisplay();

levelText.innerHTML = `⭐ XP ${xp}`;
