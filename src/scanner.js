// Quét bảng bài tập, gắn data-dlab-status cho từng hàng và đếm số lượng.
// Dùng MutationObserver + debounce thay cho setInterval.
DLAB.scanner = (() => {
  const { SCAN_DEBOUNCE_MS } = DLAB.config;
  let timer = null;
  let onResult = () => {};

  function scan() {
    if (document.hidden) return;
    const counts = { all: 0, correct: 0, wrong: 0, unattempted: 0 };

    const rows = DLAB.tables.eligibleRows();
    const keep = new Set(rows);

    // Gỡ nhãn khỏi hàng không còn hợp lệ (tránh bị ẩn nhầm khi lọc)
    document.querySelectorAll('[data-dlab-status]').forEach((row) => {
      if (!keep.has(row)) row.removeAttribute('data-dlab-status');
    });

    rows.forEach((row) => {
      const status = DLAB.classify(row);
      if (row.dataset.dlabStatus !== status) row.dataset.dlabStatus = status;
      counts[status]++;
      counts.all++;
    });

    onResult(counts);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(scan, SCAN_DEBOUNCE_MS);
  }

  return {
    start(callback) {
      onResult = callback;
      scan();
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
    }
  };
})();
