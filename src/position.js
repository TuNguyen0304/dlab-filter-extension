// Quản lý vị trí panel: đặt, đặt lại, giữ trong khung nhìn.
DLAB.position = {
  set(host, x, y) {
    host.style.left = x + 'px';
    host.style.top = y + 'px';
    host.style.right = 'auto';
    host.style.bottom = 'auto';
  },

  reset(host) {
    const m = DLAB.config.EDGE_MARGIN_PX;
    host.style.left = host.style.top = '';
    host.style.right = m + 'px';
    host.style.bottom = m + 'px';
    DLAB.state.pos = null;
  },

  limit(host, x, y) {
    const r = host.getBoundingClientRect();
    return {
      x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - r.width)),
      y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - r.height))
    };
  },

  // Chạy mutate() (đổi chiều, đổi cỡ...) nhưng giữ tâm của phần tử anchorEl đứng yên trên màn hình,
  // để panel không "nhảy" khỏi con trỏ chuột.
  keepAnchor(host, anchorEl, mutate) {
    const b = anchorEl.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;

    mutate();

    const a = anchorEl.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    const p = this.limit(host, h.left + (cx - (a.left + a.width / 2)), h.top + (cy - (a.top + a.height / 2)));
    this.set(host, p.x, p.y);
    DLAB.state.pos = p;
  },

  // Gọi khi đổi kích thước cửa sổ / đổi cỡ panel
  clamp(host) {
    if (!DLAB.state.pos) return;
    const r = host.getBoundingClientRect();
    const p = this.limit(host, r.left, r.top);
    this.set(host, p.x, p.y);
    DLAB.state.pos = p;
  }
};
