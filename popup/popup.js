const SETTINGS_KEY = 'dlabSettings';
const MIN = 70, MAX = 160, STEP = 5, DEFAULT_SCALE = 100;

let currentSettings = { scale: 1, enabled: true };

const slider = document.getElementById('scale');
const output = document.getElementById('value');
const toggleBtn = document.getElementById('toggle-btn');
const controls = document.querySelectorAll('.actions button, #scale');

function render() {
  // Cập nhật thanh trượt Scale
  const percent = Math.round(currentSettings.scale * 100);
  slider.value = percent;
  output.textContent = percent + '%';

  // Cập nhật giao diện nút Bật/Tắt
  if (currentSettings.enabled) {
    toggleBtn.textContent = 'Đang Bật';
    toggleBtn.className = 'on';
    controls.forEach(c => c.disabled = false); // Mở khóa thanh trượt
  } else {
    toggleBtn.textContent = 'Đã Tắt';
    toggleBtn.className = 'off';
    controls.forEach(c => c.disabled = true);  // Khóa thanh trượt khi bị tắt
  }
}

function commit() {
  render();
  chrome.storage.local.set({ [SETTINGS_KEY]: currentSettings });
}

// Lấy cài đặt đã lưu khi mở popup
chrome.storage.local.get(SETTINGS_KEY, (res) => {
  if (res && res[SETTINGS_KEY]) {
    if (typeof res[SETTINGS_KEY].scale === 'number') {
      currentSettings.scale = res[SETTINGS_KEY].scale;
    }
    if (typeof res[SETTINGS_KEY].enabled === 'boolean') {
      currentSettings.enabled = res[SETTINGS_KEY].enabled;
    }
  }
  render();
});

// Bắt sự kiện Bật/Tắt
toggleBtn.addEventListener('click', () => {
  currentSettings.enabled = !currentSettings.enabled;
  commit();
});

// Bắt sự kiện thanh trượt Scale
slider.addEventListener('input', () => {
  currentSettings.scale = Number(slider.value) / 100;
  commit();
});

document.getElementById('minus').addEventListener('click', () => {
  currentSettings.scale = Math.max(MIN / 100, currentSettings.scale - STEP / 100);
  commit();
});

document.getElementById('plus').addEventListener('click', () => {
  currentSettings.scale = Math.min(MAX / 100, currentSettings.scale + STEP / 100);
  commit();
});

document.getElementById('reset').addEventListener('click', () => {
  currentSettings.scale = DEFAULT_SCALE / 100;
  commit();
});