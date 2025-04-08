let totalSeconds = 0;
let timer;
let running = false;

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateDisplay() {
  document.getElementById('time-display').textContent = formatTime(totalSeconds);
}

function saveState() {
  localStorage.setItem('cronometro_totalSeconds', totalSeconds);
  localStorage.setItem('cronometro_running', running);
}

function loadState() {
  const savedSeconds = parseInt(localStorage.getItem('cronometro_totalSeconds'), 10);
  const savedRunning = localStorage.getItem('cronometro_running') === 'true';

  if (!isNaN(savedSeconds)) {
    totalSeconds = savedSeconds;
    running = savedRunning;
    updateDisplay();
    if (running) startTimer();
  }
}

function startTimer() {
  if (running || totalSeconds <= 0) return;
  running = true;
  timer = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
      saveState();
    } else {
      clearInterval(timer);
      running = false;
      updateDisplay();
      saveState();
      notifyEnd();
    }
  }, 1000);
  saveState();
}

function pauseTimer() {
  running = false;
  clearInterval(timer);
  saveState();
}

function resetTimer() {
  pauseTimer();
  totalSeconds = 0;
  updateDisplay();
  saveState();
}

function setTime() {
  const h = parseInt(document.getElementById('hours').value) || 0;
  const m = parseInt(document.getElementById('minutes').value) || 0;
  const s = parseInt(document.getElementById('seconds').value) || 0;
  totalSeconds = h * 3600 + m * 60 + s;
  pauseTimer();
  updateDisplay();
  saveState();
}

function notifyEnd() {
  if (Notification.permission === 'granted') {
    new Notification('⏰ Tempo finalizado!', {
      body: 'As horas de estudos acabaram!',
    });
  }
}

// Solicitar permissão para notificações
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Event listeners
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('set-time').addEventListener('click', setTime);

// Carrega estado anterior
loadState();
