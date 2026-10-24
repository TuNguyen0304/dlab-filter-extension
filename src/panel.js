// Dựng giao diện panel (Shadow DOM) và cung cấp các hàm cập nhật giao diện.
DLAB.createPanel = function createPanel() {
  const { FILTERS, EDGE_MARGIN_PX } = DLAB.config;

  const host = document.createElement('div');
  host.id = 'dlab-host';
  host.style.cssText =
    `position:fixed;right:${EDGE_MARGIN_PX}px;bottom:${EDGE_MARGIN_PX}px;z-index:2147483647;`;
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>${DLAB.styles.panel}</style>
    <div class="panel" role="toolbar" aria-label="Bộ lọc bài tập DLAB">
      <div class="group" role="group" aria-label="Lọc theo trạng thái"></div>
      <button class="layout" type="button" title="Đổi chiều Dọc/Ngang" aria-label="Đổi chiều dọc/ngang">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M4 9h16M4 15h16"/>
        </svg>
      </button>
    </div>
  `;

  const panel = shadow.querySelector('.panel');
  const group = shadow.querySelector('.group');
  const layoutBtn = shadow.querySelector('.layout');
  const buttons = {};
  const countEls = {};

  FILTERS.forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.action = f.id;
    b.style.background = f.color;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span>${f.label}</span><span class="count"></span>`;
    countEls[f.id] = b.querySelector('.count');
    buttons[f.id] = b;
    group.appendChild(b);
  });

  return {
    host, panel, group, layoutBtn,

    setFilter(id) {
      FILTERS.forEach((f) => buttons[f.id].setAttribute('aria-pressed', String(f.id === id)));
    },

    setLayout(layout) {
      panel.classList.toggle('vertical', layout === 'vertical');
    },

    setScale(scale) {
      panel.style.setProperty('--dlab-scale', String(scale));
    },

    setCounts(counts) {
      FILTERS.forEach((f) => {
        countEls[f.id].textContent = counts.all ? `(${counts[f.id]})` : '';
      });
    }
  };
};
