// Toàn bộ CSS: phần chèn vào trang (ẩn hàng theo bộ lọc) và phần trong Shadow DOM của panel.
// Kích thước panel dùng đơn vị em, tỉ lệ theo --dlab-scale (đặt từ popup).
DLAB.styles = {
  page: `
    body[data-dlab-filter="correct"] tr[data-dlab-status]:not([data-dlab-status="correct"]),
    body[data-dlab-filter="wrong"] tr[data-dlab-status]:not([data-dlab-status="wrong"]),
    body[data-dlab-filter="unattempted"] tr[data-dlab-status]:not([data-dlab-status="unattempted"]) {
      display: none !important;
    }
  `,

  panel: `
    :host { all: initial; }

    .panel {
      --bg: rgba(255,255,255,.96); --border: #ccc; --text: #333; --btn2: #f1f1f1;
      font-size: calc(${DLAB.config.BASE_FONT_PX}px * var(--dlab-scale, 1));
      display: flex; gap: .4em; align-items: center; padding: .4em;
      background: var(--bg); color: var(--text); border: 1px solid var(--border);
      border-radius: .65em; box-shadow: 0 3px 12px rgba(0,0,0,.25);
      backdrop-filter: blur(8px); font-family: system-ui, sans-serif;
      user-select: none; -webkit-user-select: none;
      cursor: grab; touch-action: none;
    }
    .panel.dragging { cursor: grabbing; }
    .panel.dark { --bg: rgba(33,37,41,.98); --border: #555; --text: #f8f9fa; --btn2: #444; }
    @media (prefers-color-scheme: dark) {
      .panel:not(.light) { --bg: rgba(33,37,41,.98); --border: #555; --text: #f8f9fa; --btn2: #444; }
    }

    .group { display: flex; gap: .4em; }

    button {
      font: inherit; font-size: 1em; font-weight: 700; color: #fff;
      border: 2px solid transparent; border-radius: .5em; padding: .35em .65em;
      cursor: pointer; white-space: nowrap; line-height: 1.3; opacity: .55;
    }
    button:hover { opacity: .85; }
    button:focus-visible { outline: 2px solid #0d6efd; outline-offset: 1px; }
    button[aria-pressed="true"] {
      opacity: 1; border-color: var(--text); box-shadow: 0 2px 5px rgba(0,0,0,.3);
    }
    .count { font-weight: 400; opacity: .9; margin-left: .25em; }

    .layout {
      background: var(--btn2); color: var(--text); border: 1px solid var(--border);
      opacity: 1; width: 2.2em; height: 2.2em; padding: 0;
      display: flex; align-items: center; justify-content: center; flex: none;
    }
    .layout svg { width: 1.2em; height: 1.2em; }
    .panel.vertical .layout svg { transform: rotate(90deg); }

    /* Chiều dọc: gọn hơn */
    .panel.vertical { flex-direction: column; align-items: stretch; width: 8em; gap: .35em; padding: .35em; }
    .panel.vertical .group { flex-direction: column; gap: .35em; }
    .panel.vertical button:not(.layout) { padding: .25em .5em; font-size: .92em; text-align: center; }
    .panel.vertical .layout { width: 100%; height: 1.85em; }
  `
};
