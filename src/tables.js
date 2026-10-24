// Xác định bảng/hàng nào thuộc "danh sách bài tập" cần lọc & đếm.
// Loại trừ: bảng lịch sử nộp bài, hàng tiêu đề, bảng input/output của đề bài.
DLAB.tables = (() => {
  const { MIN_COLUMNS, EXCLUDE_URL_PATTERNS, HISTORY_HEADER_PRIMARY, HISTORY_HEADER_SECONDARY } = DLAB.config;

  function norm(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ');
  }

  function headerText(table) {
    const head = table.querySelector('thead tr') || table.querySelector('tr');
    return head ? norm(head.textContent) : '';
  }

  // Bảng lịch sử nộp bài: tiêu đề có "Ngôn ngữ" kèm "Kết quả"/"Thời gian chạy"/"Bộ nhớ"...
  function isSubmissionHistory(table) {
    const h = headerText(table);
    return HISTORY_HEADER_PRIMARY.some((k) => h.includes(k)) &&
           HISTORY_HEADER_SECONDARY.some((k) => h.includes(k));
  }

  const INTERACTIVE = 'a, button, input, img, svg, i';

  // Bảng không có <thead>/<th>: hàng đầu là tiêu đề nếu không chứa link/icon
  // trong khi hàng kế tiếp có.
  function isHeaderRow(row, table) {
    if (row.closest('thead') || row.querySelector('th')) return true;
    if (table.querySelector('thead, th')) return false;
    const first = table.querySelector('tr');
    if (row !== first) return false;
    const next = row.nextElementSibling;
    return !!next && !row.querySelector(INTERACTIVE) && !!next.querySelector(INTERACTIVE);
  }

  function urlExcluded() {
    return EXCLUDE_URL_PATTERNS.some((re) => re.test(location.pathname));
  }

  return {
    // Trả về danh sách hàng bài tập hợp lệ trên trang hiện tại
    eligibleRows() {
      if (urlExcluded()) return [];
      const rows = [];
      
      // Khuyến nghị: Có thể đổi 'table' thành 'table.table' nếu Code PTIT luôn dùng class Bootstrap này
      document.querySelectorAll('table').forEach((table) => {
        if (isSubmissionHistory(table)) return;
        
        table.querySelectorAll(':scope > tbody > tr').forEach((row) => {
          if (row.cells.length < MIN_COLUMNS) return;   // bảng input/output của đề bài
          if (isHeaderRow(row, table)) return;
          
          // [ĐÃ THÊM] Bỏ qua các hàng không chứa thẻ <a> (link đề bài)
          // Giúp loại bỏ hoàn toàn các hàng layout, hàng trống hoặc bảng phụ gây đếm thừa
          if (!row.querySelector('a')) return;

          rows.push(row);
        });
      });
      return rows;
    }};
})();
