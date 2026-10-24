// Đọc / ghi trạng thái và tùy chỉnh.
(() => {
  const { STORAGE_KEY, SETTINGS_KEY, DEFAULT_STATE, DEFAULT_SETTINGS, SCALE_MIN, SCALE_MAX } = DLAB.config;
  const hasChrome = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

  function readKey(key, defaults) {
    return new Promise((resolve) => {
      try {
        if (hasChrome) {
          chrome.storage.local.get(key, (res) => resolve(Object.assign({}, defaults, (res && res[key]) || {})));
        } else {
          resolve(Object.assign({}, defaults, JSON.parse(localStorage.getItem(key) || '{}')));
        }
      } catch (_) {
        resolve(Object.assign({}, defaults));
      }
    });
  }

  function writeKey(key, value) {
    try {
      if (hasChrome) chrome.storage.local.set({ [key]: value });
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (_) { /* bỏ qua */ }
  }

  function cleanSettings(s) {
    const out = Object.assign({}, DEFAULT_SETTINGS, s || {});
    const n = Number(out.scale);
    out.scale = Number.isFinite(n) ? Math.min(SCALE_MAX, Math.max(SCALE_MIN, n)) : DEFAULT_SETTINGS.scale;
    // [CẬP NHẬT] Đảm bảo biến enabled là kiểu Boolean (nếu không có thì lấy mặc định)
    out.enabled = typeof out.enabled === 'boolean' ? out.enabled : DEFAULT_SETTINGS.enabled;
    return out;
  }

  DLAB.storage = {
    load: () => readKey(STORAGE_KEY, DEFAULT_STATE),
    save: () => writeKey(STORAGE_KEY, DLAB.state),
    loadSettings: () => readKey(SETTINGS_KEY, DEFAULT_SETTINGS).then(cleanSettings),
    watchSettings(callback) {
      if (!hasChrome || !chrome.storage.onChanged) return;
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[SETTINGS_KEY]) {
          callback(cleanSettings(changes[SETTINGS_KEY].newValue));
        }
      });
    }
  };
})();