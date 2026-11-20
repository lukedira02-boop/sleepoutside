const durationInput = document.querySelector('#duration');
const countdownDisplay = document.querySelector('#countdown');
const statusMessage = document.querySelector('#countdown-status');
const startButton = document.querySelector('#start-button');
const pauseButton = document.querySelector('#pause-button');
const resetButton = document.querySelector('#reset-button');

let secondsLeft = Number(durationInput.value);
let intervalId;
let timeoutId;
let isRunning = false;
let isPaused = false;

function renderTime() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  countdownDisplay.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function clearTimers() {
  window.clearInterval(intervalId);
  window.clearTimeout(timeoutId);
}

function finishCountdown() {
  clearTimers();
  secondsLeft = 0;
  isRunning = false;
  isPaused = false;
  renderTime();
  statusMessage.textContent = "Time's up!";
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = 'Pause';
}

function runCountdown() {
  if (secondsLeft <= 0) {
    finishCountdown();
    return;
  }

  isRunning = true;
  isPaused = false;
  startButton.disabled = true;
  pauseButton.disabled = false;
  pauseButton.textContent = 'Pause';
  statusMessage.textContent = 'Countdown in progress.';

  intervalId = window.setInterval(() => {
    secondsLeft -= 1;
    renderTime();
    if (secondsLeft <= 0) finishCountdown();
  }, 1000);

  timeoutId = window.setTimeout(finishCountdown, secondsLeft * 1000);
}

startButton.addEventListener('click', () => {
  if (isRunning) return;

  const duration = Number(durationInput.value);
  if (!durationInput.reportValidity() || !Number.isInteger(duration)) return;

  clearTimers();
  secondsLeft = duration;
  renderTime();
  runCountdown();
});

pauseButton.addEventListener('click', () => {
  if (isRunning) {
    clearTimers();
    isRunning = false;
    isPaused = true;
    startButton.disabled = false;
    pauseButton.textContent = 'Resume';
    statusMessage.textContent = 'Countdown paused.';
    return;
  }

  if (isPaused) runCountdown();
});

resetButton.addEventListener('click', () => {
  const duration = Number(durationInput.value);
  if (!durationInput.reportValidity() || !Number.isInteger(duration)) return;

  clearTimers();
  isRunning = false;
  isPaused = false;
  secondsLeft = duration;
  renderTime();
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = 'Pause';
  statusMessage.textContent = 'Timer reset.';
});

durationInput.addEventListener('input', () => {
  if (isRunning || isPaused) return;
  if (durationInput.validity.valid && Number.isInteger(Number(durationInput.value))) {
    secondsLeft = Number(durationInput.value);
    renderTime();
  }
});

renderTime();
