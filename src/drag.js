// Kéo thả ở bất kỳ vị trí nào trong panel (kể cả trên nút bấm).
// Di chuyển quá ngưỡng => kéo; ngược lại => click bình thường vào nút.
DLAB.enableDrag = function enableDrag(ui, onEnd) {
  const { host, panel } = ui;
  const THRESHOLD = DLAB.config.DRAG_THRESHOLD_PX;

  let start = null;      // { x, y, offX, offY, id }
  let dragging = false;

  function suppressNextClick() {
    const block = (e) => { e.stopPropagation(); e.preventDefault(); };
    panel.addEventListener('click', block, { capture: true, once: true });
    setTimeout(() => panel.removeEventListener('click', block, { capture: true }), 0);
  }

  panel.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const r = host.getBoundingClientRect();
    start = { x: e.clientX, y: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, id: e.pointerId };
    dragging = false;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  });

  function onMove(e) {
    if (!start || e.pointerId !== start.id) return;

    if (!dragging) {
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < THRESHOLD) return;
      dragging = true;
      panel.classList.add('dragging');
    }

    e.preventDefault();
    const p = DLAB.position.limit(host, e.clientX - start.offX, e.clientY - start.offY);
    DLAB.position.set(host, p.x, p.y);
    DLAB.state.pos = p;
  }

  function onUp(e) {
    if (!start || e.pointerId !== start.id) return;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);

    if (dragging) {
      suppressNextClick();   // không kích hoạt nút sau khi vừa kéo
      panel.classList.remove('dragging');
      onEnd();
    }
    start = null;
    dragging = false;
  }

  // Nhấp đúp vào vùng trống của panel để đặt lại vị trí
  panel.addEventListener('dblclick', (e) => {
    if (e.composedPath().some((n) => n.tagName === 'BUTTON')) return;
    DLAB.position.reset(host);
    onEnd();
  });
};
