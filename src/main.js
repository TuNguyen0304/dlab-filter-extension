// Điểm khởi động: nối các module lại với nhau.
(async function main() {
  if (window.top !== window) return;
  if (document.getElementById('dlab-host')) return;

  if (!document.body) {
    await new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }));
  }

  const pageStyle = document.createElement('style');
  pageStyle.id = 'dlab-page-style';
  pageStyle.textContent = DLAB.styles.page;
  (document.head || document.documentElement).appendChild(pageStyle);

  DLAB.state = await DLAB.storage.load();
  DLAB.settings = await DLAB.storage.loadSettings();

  const ui = DLAB.createPanel();
  ui.setScale(DLAB.settings.scale);
  ui.setLayout(DLAB.state.layout);
  ui.setFilter(DLAB.state.filter);
  
  if (!DLAB.settings.enabled) {
    ui.host.style.display = 'none';
  }

  const pos = DLAB.state.pos;
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
    DLAB.position.set(ui.host, pos.x, pos.y);
  }
  document.body.appendChild(ui.host);
  
  // SỬA LỖI: Chỉ tính toán lại tọa độ khi panel đang hiển thị
  if (DLAB.settings.enabled) {
    DLAB.position.clamp(ui.host);
  }

  function applyFilter(id) {
    if (!DLAB.config.FILTERS.some((f) => f.id === id)) id = 'all';
    DLAB.state.filter = id;
    
    if (DLAB.settings.enabled) {
      document.body.setAttribute('data-dlab-filter', id);
    } else {
      document.body.removeAttribute('data-dlab-filter');
    }
    ui.setFilter(id);
  }
  applyFilter(DLAB.state.filter);

  ui.group.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    applyFilter(btn.dataset.action);
    DLAB.storage.save();
  });

  ui.layoutBtn.addEventListener('click', () => {
    DLAB.position.keepAnchor(ui.host, ui.layoutBtn, () => {
      DLAB.state.layout = DLAB.state.layout === 'vertical' ? 'horizontal' : 'vertical';
      ui.setLayout(DLAB.state.layout);
    });
    DLAB.storage.save();
  });

  DLAB.storage.watchSettings((settings) => {
    DLAB.settings = settings;
    ui.setScale(settings.scale);

    // SỬA LỖI: Phải hiển thị panel lên TRƯỚC
    if (settings.enabled) {
      ui.host.style.display = '';
      document.body.setAttribute('data-dlab-filter', DLAB.state.filter);
    } else {
      ui.host.style.display = 'none';
      document.body.removeAttribute('data-dlab-filter');
    }

    // SAU ĐÓ mới cập nhật lại vị trí (tránh việc tọa độ bị hiểu nhầm là 0,0 khi đang ẩn)
    if (settings.enabled) {
      DLAB.position.clamp(ui.host);
    }
  });

  DLAB.enableDrag(ui, () => DLAB.storage.save());
  window.addEventListener('resize', () => {
    if (DLAB.settings.enabled) DLAB.position.clamp(ui.host);
  });

  DLAB.scanner.start((counts) => {
    ui.setCounts(counts);
    DLAB.theme.apply(ui.panel);
  });
})();