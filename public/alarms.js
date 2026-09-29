const form = document.getElementById('add-alarm-form');
const timeInput = document.getElementById('time-input');
const labelInput = document.getElementById('label-input');
const list = document.getElementById('alarm-list');
const alertBanner = document.getElementById('alert-banner');
const alertLabel = document.getElementById('alert-label');
const dismissBtn = document.getElementById('dismiss-btn');

let audioContext = null;
let oscillator = null;
let gainNode = null;
const firedAlarms = new Set();

async function loadAlarms() {
  const res = await fetch('/api/alarms');
  const alarms = await res.json();
  renderAlarms(alarms);
}

function renderAlarms(alarms) {
  list.innerHTML = '';
  alarms.forEach((alarm) => {
    const li = document.createElement('li');
    li.className = 'alarm-item';

    const info = document.createElement('div');
    info.className = 'alarm-info';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'alarm-time';
    timeSpan.textContent = alarm.time;
    info.appendChild(timeSpan);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'alarm-label';
    labelSpan.textContent = alarm.label;
    info.appendChild(labelSpan);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'alarm-toggle';
    toggleBtn.textContent = alarm.enabled ? 'Enabled' : 'Disabled';
    toggleBtn.style.background = alarm.enabled ? '#e3fcef' : '#f8f9fa';
    toggleBtn.style.color = alarm.enabled ? '#006644' : '#626f86';
    toggleBtn.addEventListener('click', () => updateAlarmEnabled(alarm.id, !alarm.enabled));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'alarm-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteAlarm(alarm.id));

    li.appendChild(info);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addAlarm(time, label) {
  const res = await fetch('/api/alarms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time, label }),
  });
  if (!res.ok) {
    const err = await res.json();
    alert(err.error || 'Failed to add alarm');
    return;
  }
  await loadAlarms();
}

async function updateAlarmEnabled(id, enabled) {
  const res = await fetch(`/api/alarms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) {
    alert('Failed to update alarm');
    return;
  }
  await loadAlarms();
}

async function deleteAlarm(id) {
  const res = await fetch(`/api/alarms/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    alert('Failed to delete alarm');
    return;
  }
  await loadAlarms();
}

function playBeep() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  }

  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

  oscillator.start();
}

function stopBeep() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    if (gainNode) {
      gainNode.disconnect();
    }
    oscillator = null;
    gainNode = null;
  }
}

function showAlert(label) {
  alertLabel.textContent = label;
  alertBanner.style.display = 'block';
  playBeep();
}

function hideAlert() {
  alertBanner.style.display = 'none';
  stopBeep();
}

dismissBtn.addEventListener('click', hideAlert);

async function checkAlarms() {
  const res = await fetch('/api/alarms');
  const alarms = await res.json();

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  const dateKey = now.toISOString().split('T')[0];

  alarms.forEach((alarm) => {
    if (alarm.enabled && alarm.time === currentTime) {
      const fireKey = `${alarm.id}|${dateKey}`;
      if (!firedAlarms.has(fireKey)) {
        firedAlarms.add(fireKey);
        showAlert(alarm.label);
      }
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const time = timeInput.value;
  if (!time) return;
  const label = labelInput.value.trim();
  if (!label) return;
  addAlarm(time, label);
  timeInput.value = '';
  labelInput.value = '';
});

loadAlarms();
setInterval(checkAlarms, 1000);
