// Popup tùy chỉnh kích thước bộ lọc. Ghi vào chrome.storage.local;
// content script lắng nghe thay đổi và áp dụng ngay.
// Giá trị phải khớp với DLAB.config trong src/config.js.
const SETTINGS_KEY = 'dlabSettings';
const MIN = 70, MAX = 160, STEP = 5, DEFAULT = 100;

const slider = document.getElementById('scale');
const output = document.getElementById('value');

function render(percent) {
  slider.value = percent;
  output.textContent = percent + '%';
}

function commit(percent) {
  percent = Math.min(MAX, Math.max(MIN, Math.round(percent / STEP) * STEP));
  render(percent);
  chrome.storage.local.set({ [SETTINGS_KEY]: { scale: percent / 100 } });
}

chrome.storage.local.get(SETTINGS_KEY, (res) => {
  const saved = res && res[SETTINGS_KEY] && Number(res[SETTINGS_KEY].scale);
  render(saved ? Math.round(saved * 100) : DEFAULT);
});

slider.addEventListener('input', () => commit(Number(slider.value)));
document.getElementById('minus').addEventListener('click', () => commit(Number(slider.value) - STEP));
document.getElementById('plus').addEventListener('click', () => commit(Number(slider.value) + STEP));
document.getElementById('reset').addEventListener('click', () => commit(DEFAULT));
