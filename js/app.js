/* =========================
   ELEMENTS
========================= */

const clock = document.getElementById("clock");

const greeting = document.getElementById("greeting");

const quote = document.getElementById("quote");

const streakElement = document.querySelector(".streak");

const levelText = document.querySelector(".level");

const progressCircle = document.querySelector(".progress-circle");

const taskList = document.querySelector(".task-list");

const totalTasksElement = document.getElementById("totalTasks");

const completedTasksElement = document.getElementById("completedTasks");

const focusSessionsElement = document.getElementById("focusSessions");

const productivityScoreElement = document.getElementById("productivityScore");

/* Theme */

const themeToggle = document.getElementById("themeToggle");

/* Modal */

const modalOverlay = document.getElementById("modalOverlay");

const openModal = document.getElementById("openModal");

const closeModalBtn = document.getElementById("closeModalBtn");

const createTaskBtn = document.getElementById("createTaskBtn");

const taskNameInput = document.getElementById("taskName");

const taskTimeInput = document.getElementById("taskTime");

const taskDurationInput = document.getElementById("taskDuration");

const taskEmojiInput = document.getElementById("taskEmoji");

/* Sounds */

const completeSound = document.getElementById("completeSound");

const successSound = document.getElementById("successSound");

/* Effects */

const xpPopup = document.getElementById("xp-popup");

const confettiContainer = document.getElementById("confetti-container");

/* Timer */

const timerCircle = document.querySelector(".timer-circle");

const startTimerBtn = document.getElementById("startTimerBtn");

const resetTimerBtn = document.getElementById("resetTimerBtn");

/* =========================
   DATA
========================= */

let tasks = JSON.parse(localStorage.getItem("momentumTasks")) || [];

let xp = Number(localStorage.getItem("momentumXP")) || 0;

let streak = Number(localStorage.getItem("momentumStreak")) || 1;

let lastVisit = localStorage.getItem("momentumLastVisit");

let focusSessions = Number(localStorage.getItem("momentumFocus")) || 0;

/* Timer */

let timer;

let totalSeconds = 1500;

let isRunning = false;

/* Quotes */

const quotes = [
  "Small progress is still progress.",

  "Momentum beats motivation.",

  "Dream big. Start small.",

  "Discipline creates freedom.",

  "Stay patient and trust the process.",

  "Success is built daily.",
];

/* =========================
   CLOCK
========================= */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  clock.innerHTML = time;
}

setInterval(updateClock, 1000);

/* =========================
   GREETING
========================= */

function updateGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.innerText = "Good Morning ☀️";
  } else if (hour < 18) {
    greeting.innerText = "Good Afternoon 🌤️";
  } else {
    greeting.innerText = "Good Evening 🌙";
  }
}

/* =========================
   QUOTE
========================= */

function updateQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  quote.innerText = `"${randomQuote}"`;
}

/* =========================
   STREAK
========================= */

function updateStreak() {
  const today = new Date().toDateString();

  if (!lastVisit) {
    localStorage.setItem("momentumLastVisit", today);

    return;
  }

  const previousDate = new Date(lastVisit);

  const currentDate = new Date(today);

  const difference = Math.floor(
    (currentDate - previousDate) / (1000 * 60 * 60 * 24),
  );

  if (difference === 1) {
    streak++;
  } else if (difference > 1) {
    streak = 1;
  }

  localStorage.setItem("momentumStreak", streak);

  localStorage.setItem("momentumLastVisit", today);

  streakElement.innerHTML = `🔥 ${streak} Day Streak`;
}

/* =========================
   LEVEL
========================= */

function updateLevel() {
  const level = Math.floor(xp / 100) + 1;

  levelText.innerHTML = `⭐ Level ${level} • XP ${xp}`;
}

/* =========================
   TASKS
========================= */

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        No tasks yet 🚀
      </div>
    `;

    updateStats();

    updateProgress();

    return;
  }

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");

    taskDiv.classList.add("task-item");

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

    if (task.completed) {
      taskDiv.style.opacity = "0.6";
    }

    taskList.appendChild(taskDiv);
  });

  updateProgress();

  updateStats();
}

function addTask() {
  const taskName = taskNameInput.value.trim();

  if (!taskName) return;

  tasks.push({
    name: taskName,
    time: taskTimeInput.value || "Anytime",
    duration: taskDurationInput.value || "30 min",
    emoji: taskEmojiInput.value,
    completed: false,
  });

  saveData();

  renderTasks();

  closeModal();

  clearModalInputs();
}

function completeTask(index) {
  if (!tasks[index].completed) {
    tasks[index].completed = true;

    xp += 15;

    completeSound.play();

    launchConfetti();

    showXPPopup();
  }

  saveData();

  renderTasks();

  updateLevel();
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveData();

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
   STATS
========================= */

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;

  totalTasksElement.innerText = tasks.length;

  completedTasksElement.innerText = completed;

  focusSessionsElement.innerText = focusSessions;

  const productivity =
    tasks.length === 0 ? 0 : Math.floor((completed / tasks.length) * 100);

  productivityScoreElement.innerText = `${productivity}%`;
}

/* =========================
   STORAGE
========================= */

function saveData() {
  localStorage.setItem("momentumTasks", JSON.stringify(tasks));

  localStorage.setItem("momentumXP", xp);

  localStorage.setItem("momentumFocus", focusSessions);
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
   TIMER
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

      focusSessions++;

      xp += 25;

      successSound.play();

      launchConfetti();

      showXPPopup();

      updateLevel();

      updateStats();

      saveData();

      updateTimerDisplay();

      startTimerBtn.innerText = "Start";

      timerCircle.classList.remove("timer-active");

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
   THEME
========================= */

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

/* =========================
   EVENT LISTENERS
========================= */

themeToggle.addEventListener("click", toggleTheme);

openModal.addEventListener("click", openTaskModal);

closeModalBtn.addEventListener("click", closeModal);

createTaskBtn.addEventListener("click", addTask);

startTimerBtn.addEventListener("click", startTimer);

resetTimerBtn.addEventListener("click", resetTimer);

/* =========================
   INITIALIZE
========================= */

updateClock();

updateGreeting();

updateQuote();

updateStreak();

updateLevel();

updateTimerDisplay();

renderTasks();

updateStats();
