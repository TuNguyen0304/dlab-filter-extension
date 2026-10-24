// Xác định trạng thái một hàng bài tập: correct | wrong | unattempted.
// So khớp theo "token" của class (tách bởi khoảng trắng, '-', '_') thay vì chuỗi con,
// tránh nhầm "required", "credit", "checkbox"...
(() => {
  const CORRECT_TOKENS = new Set(['success', 'check', 'checked', 'correct', 'green', 'accepted', 'ok', 'done']);
  const WRONG_TOKENS   = new Set(['danger', 'times', 'close', 'red', 'wrong', 'error', 'fail', 'failed', 'x']);
  const CORRECT_CHARS  = /[✔✓✅]/;
  const WRONG_CHARS    = /[✗✘✖❌×]/;

  function classTokens(el) {
    const cls = el.getAttribute('class') || ''; // an toàn cả với SVG
    return cls.toLowerCase().split(/[\s\-_]+/).filter(Boolean);
  }

  function inspectCell(cell, result) {
    const nodes = [cell, ...cell.querySelectorAll('*')];
    for (const el of nodes) {
      for (const t of classTokens(el)) {
        if (CORRECT_TOKENS.has(t)) result.correct = true;
        if (WRONG_TOKENS.has(t)) result.wrong = true;
      }
      const style = (el.getAttribute('style') || '').toLowerCase();
      if (/\bgreen\b/.test(style)) result.correct = true;
      if (/\bred\b/.test(style)) result.wrong = true;
    }
    const text = cell.textContent || '';
    if (CORRECT_CHARS.test(text)) result.correct = true;
    if (WRONG_CHARS.test(text)) result.wrong = true;
  }

  DLAB.classify = function classify(row) {
    const result = { correct: false, wrong: false };
    inspectCell(row.cells[0], result);
    inspectCell(row.cells[1], result);
    if (result.wrong && !result.correct) return 'wrong';
    if (result.correct) return 'correct';
    return 'unattempted';
  };
})();
