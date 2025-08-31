const timerElem = document.getElementById("timer");
const timeout = 10000; // 10 min

// Create timer in localStorage if it doesn't exist
if (localStorage.getItem("timer") === null) {
  localStorage.setItem("timer", Date.now());
}

// Calculate time difference and time left initially
let storedDate = Number(localStorage.getItem("timer"));
let timeDifference = Date.now() - storedDate;
let timeLeft = timeout - timeDifference;

// Convert ms to mm:ss
function msToMinSec(ms) {
  let min = Math.floor(ms / 60000);
  let sec = Math.floor((ms % 60000) / 1000);
  return min + ":" + (sec <= 9 ? "0" : "") + sec;
}

// Initial HTML update
if (timeDifference >= timeout) {
  timerElem.innerHTML = "0:00";
} else {
  timerElem.innerHTML = msToMinSec(timeLeft);
}

// Update timer every second
const timerInterval = setInterval(() => updateTimer(), 1000);

function updateTimer() {
  const currentDate = Date.now();
  storedDate = localStorage.getItem("timer");
  timeDifference = currentDate - storedDate;
  timeLeft = timeout - timeDifference;
  timerElem.innerHTML = timeLeft > 0 ? msToMinSec(timeLeft) : "0:00";
}

// Get time left
function getTimeLeft() {
  const storedDate = Number(localStorage.getItem("timer"));
  return timeout - (Date.now() - storedDate);
}

// Check if the cooldown is active
export function isCooldownActive() {
  return getTimeLeft() >= 0;
}

// Reset timer
export function resetTimer() {
  localStorage.setItem("timer", Date.now());
}
