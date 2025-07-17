let timer;
let milliseconds = 0;
let isRunning = false;
let lapCount = 0;

let time = document.getElementById("time");
let startBtn = document.getElementById("start");
let pauseBtn = document.getElementById("pause");
let resetBtn = document.getElementById("reset");
let lapBtn = document.getElementById("lap");
let lapList = document.getElementById("lapList");
let countdownEl = document.getElementById("countdown");

let savedTime = localStorage.getItem("stopwatch-time");
let savedRunning = localStorage.getItem("stopwatch-running");
let lastSaved = localStorage.getItem("last-saved");

if (savedTime !== null) {
  milliseconds = parseInt(savedTime);
  updateTime();

  if (savedRunning === "true" && lastSaved) {
    const timeAway = Date.now() - parseInt(lastSaved);
    milliseconds += Math.floor(timeAway / 10);
    time.style.display = "none";
    countdownEl.style.display = "block";
    let countdown = 3;
    countdownEl.textContent = `Resuming in ${countdown}...`;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownEl.textContent = `Resuming in ${countdown}...`;
      } else {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
        time.style.display = "block";
        updateTime();
        startStopwatch();
      }
    }, 1000);
  }
}

function updateTime() {
  const hrs = Math.floor(milliseconds / 360000);
  const mins = String(Math.floor((milliseconds % 360000) / 6000)).padStart(2, '0');
  const secs = String(Math.floor((milliseconds % 6000) / 100)).padStart(2, '0');
  const ms = String(milliseconds % 100).padStart(2, '0');

  if (hrs > 0) {
    time.textContent = `${String(hrs).padStart(2, '0')}:${mins}:${secs}:${ms}`;
  } else {
    time.textContent = `${mins}:${secs}:${ms}`;
  }
}

function startStopwatch() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      milliseconds++;
      updateTime();
    }, 10);
  }
}

startBtn.addEventListener("click", () => {
  startStopwatch();
  addGlow(startBtn, "glow-start");
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  addGlow(pauseBtn, "glow-pause");
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  milliseconds = 0;
  lapCount = 0;
  lapList.innerHTML = "";
  updateTime();
  localStorage.removeItem("stopwatch-time");
  localStorage.removeItem("stopwatch-running");
  localStorage.removeItem("last-saved");
  addGlow(resetBtn, "glow-reset");
});

lapBtn.addEventListener("click", () => {
  if (isRunning) {
    lapCount++;
    const hrs = Math.floor(milliseconds / 360000);
    const mins = String(Math.floor((milliseconds % 360000) / 6000)).padStart(2, '0');
    const secs = String(Math.floor((milliseconds % 6000) / 100)).padStart(2, '0');
    const ms = String(milliseconds % 100).padStart(2, '0');
    const lapTime = hrs > 0
      ? `${String(hrs).padStart(2, '0')}:${mins}:${secs}:${ms}`
      : `${mins}:${secs}:${ms}`;
    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${lapTime}`;
    lapList.appendChild(li);
  }
  addGlow(lapBtn, "glow-lap");
});

function addGlow(button, className) {
  button.classList.add(className);
  setTimeout(() => {
    button.classList.remove(className);
  }, 500);
}

window.addEventListener("beforeunload", () => {
  localStorage.setItem("stopwatch-time", milliseconds);
  localStorage.setItem("stopwatch-running", isRunning);
  localStorage.setItem("last-saved", Date.now());
});
