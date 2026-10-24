// Điểm khởi động: nối các module lại với nhau.
(async function main() {
  if (window.top !== window) return;
  if (document.getElementById('dlab-host')) return; // chống inject lặp

  if (!document.body) {
    await new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }));
  }

  // CSS ẩn hàng theo bộ lọc
  const pageStyle = document.createElement('style');
  pageStyle.id = 'dlab-page-style';
  pageStyle.textContent = DLAB.styles.page;
  (document.head || document.documentElement).appendChild(pageStyle);

  // Nạp trạng thái và tùy chỉnh đã lưu
  DLAB.state = await DLAB.storage.load();
  DLAB.settings = await DLAB.storage.loadSettings();

  // Dựng panel
  const ui = DLAB.createPanel();
  ui.setScale(DLAB.settings.scale);
  ui.setLayout(DLAB.state.layout);
  ui.setFilter(DLAB.state.filter);
  const pos = DLAB.state.pos;
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
    DLAB.position.set(ui.host, pos.x, pos.y);
  }
  document.body.appendChild(ui.host);
  DLAB.position.clamp(ui.host);

  // Bộ lọc
  function applyFilter(id) {
    if (!DLAB.config.FILTERS.some((f) => f.id === id)) id = 'all';
    DLAB.state.filter = id;
    document.body.setAttribute('data-dlab-filter', id);
    ui.setFilter(id);
  }
  applyFilter(DLAB.state.filter);

  ui.group.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    applyFilter(btn.dataset.action);
    DLAB.storage.save();
  });

  // Đổi chiều dọc/ngang
  // Lấy chính nút đổi chiều làm tâm xoay: nút đứng yên dưới con trỏ chuột
  ui.layoutBtn.addEventListener('click', () => {
    DLAB.position.keepAnchor(ui.host, ui.layoutBtn, () => {
      DLAB.state.layout = DLAB.state.layout === 'vertical' ? 'horizontal' : 'vertical';
      ui.setLayout(DLAB.state.layout);
    });
    DLAB.storage.save();
  });

  // Áp dụng ngay khi người dùng chỉnh kích thước trong popup
  DLAB.storage.watchSettings((settings) => {
    DLAB.settings = settings;
    ui.setScale(settings.scale);
    DLAB.position.clamp(ui.host);
  });

  // Kéo thả toàn khung
  DLAB.enableDrag(ui, () => DLAB.storage.save());
  window.addEventListener('resize', () => DLAB.position.clamp(ui.host));

  // Quét bảng
  DLAB.scanner.start((counts) => {
    ui.setCounts(counts);
    DLAB.theme.apply(ui.panel);
  });
})();
