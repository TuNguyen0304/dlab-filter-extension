// Đồng bộ giao diện sáng/tối của panel với trang.
DLAB.theme = {
  apply(panel) {
    const de = document.documentElement;
    const isDark =
      document.body.classList.contains('dark') ||
      de.classList.contains('dark') ||
      de.getAttribute('data-theme') === 'dark' ||
      de.getAttribute('data-bs-theme') === 'dark';
    const isLight =
      de.getAttribute('data-theme') === 'light' ||
      de.getAttribute('data-bs-theme') === 'light';
    panel.classList.toggle('dark', isDark);
    panel.classList.toggle('light', !isDark && isLight);
  }
};
