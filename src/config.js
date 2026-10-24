// Cấu hình chung + khởi tạo namespace dùng chung giữa các file.
// Các file được nạp theo thứ tự khai báo trong manifest.json.
self.DLAB = self.DLAB || {};

DLAB.config = {
  SCAN_DEBOUNCE_MS: 200,   // trễ khi quét lại sau thay đổi DOM
  MIN_COLUMNS: 4,          // bảng bài tập >= 4 cột (bỏ qua bảng input/output)
  DRAG_THRESHOLD_PX: 4,    // di chuyển quá ngưỡng này mới tính là kéo
  EDGE_MARGIN_PX: 20,      // lề mặc định so với góc dưới phải
  // Loại trừ bảng lịch sử nộp bài (tiêu đề chứa 1 từ ở PRIMARY và 1 từ ở SECONDARY)
  HISTORY_HEADER_PRIMARY: ['ngôn ngữ', 'language'],
  HISTORY_HEADER_SECONDARY: ['kết quả', 'thời gian chạy', 'bộ nhớ', 'verdict', 'runtime', 'memory'],
  // Trang có đường dẫn khớp (vd: /submission/) sẽ không lọc/đếm gì. Mặc định để trống.
  EXCLUDE_URL_PATTERNS: [],

  BASE_FONT_PX: 12,        // cỡ chữ gốc của panel (ứng với scale = 1)

  STORAGE_KEY: 'dlabFilterState',      // vị trí, chiều, bộ lọc
  SETTINGS_KEY: 'dlabSettings',        // tùy chỉnh từ popup (khớp popup/popup.js)
  DEFAULT_STATE: { pos: null, layout: 'horizontal', filter: 'all' },
  DEFAULT_SETTINGS: { scale: 1 },
  SCALE_MIN: 0.7,
  SCALE_MAX: 1.6,

  FILTERS: [
    { id: 'all',         label: 'Tất cả',   color: '#495057' },
    { id: 'correct',     label: 'Đúng',     color: '#146c43' },
    { id: 'wrong',       label: 'Sai',      color: '#b02a37' },
    { id: 'unattempted', label: 'Chưa làm', color: '#6c757d' }
  ]
};

// Trạng thái & tùy chỉnh đang dùng (được nạp từ storage trong main.js)
DLAB.state = Object.assign({}, DLAB.config.DEFAULT_STATE);
DLAB.settings = Object.assign({}, DLAB.config.DEFAULT_SETTINGS);
