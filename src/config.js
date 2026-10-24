// Cấu hình chung + khởi tạo namespace dùng chung giữa các file.
self.DLAB = self.DLAB || {};

DLAB.config = {
  SCAN_DEBOUNCE_MS: 200,   
  MIN_COLUMNS: 4,          
  DRAG_THRESHOLD_PX: 4,    
  EDGE_MARGIN_PX: 20,      
  HISTORY_HEADER_PRIMARY: ['ngôn ngữ', 'language'],
  HISTORY_HEADER_SECONDARY: ['kết quả', 'thời gian chạy', 'bộ nhớ', 'verdict', 'runtime', 'memory'],
  EXCLUDE_URL_PATTERNS: [],
  BASE_FONT_PX: 12,        

  STORAGE_KEY: 'dlabFilterState',      
  SETTINGS_KEY: 'dlabSettings',        
  DEFAULT_STATE: { pos: null, layout: 'horizontal', filter: 'all' },
  // [CẬP NHẬT] Thêm biến enabled: true vào cài đặt mặc định
  DEFAULT_SETTINGS: { scale: 1, enabled: true },
  SCALE_MIN: 0.7,
  SCALE_MAX: 1.6,

  FILTERS: [
    { id: 'all',         label: 'Tất cả',   color: '#495057' },
    { id: 'correct',     label: 'Đúng',     color: '#146c43' },
    { id: 'wrong',       label: 'Sai',      color: '#b02a37' },
    { id: 'unattempted', label: 'Chưa làm', color: '#6c757d' }
  ]
};

DLAB.state = Object.assign({}, DLAB.config.DEFAULT_STATE);
DLAB.settings = Object.assign({}, DLAB.config.DEFAULT_SETTINGS);