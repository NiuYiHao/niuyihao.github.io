(() => {
  const timeline = document.getElementById('article-timeline');
  if (!timeline) return;
  const key = 'blog.article-marks.v1';
  const entries = [...timeline.querySelectorAll('[data-article-path]')];
  const filters = [...timeline.querySelectorAll('[data-filter]')];
  const status = timeline.querySelector('.timeline-status');
  let marked = new Set();
  let view = 'all';
  let persistent = true;
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      marked = new Set(Array.isArray(saved.marked) ? saved.marked.filter(p => typeof p === 'string') : []);
      view = ['all', 'marked', 'unmarked'].includes(saved.view) ? saved.view : 'all';
    } catch { marked = new Set(); view = 'all'; }
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify({marked: [...marked], view})); persistent = true; }
    catch { persistent = false; }
  }
  function render() {
    let count = 0;
    entries.forEach(entry => {
      const selected = marked.has(entry.dataset.articlePath);
      entry.hidden = view === 'marked' ? !selected : view === 'unmarked' ? selected : false;
      if (!entry.hidden) count++;
      const button = entry.querySelector('.article-mark');
      button.hidden = false;
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? '取消标记' : '标记'}：${button.dataset.title}`);
      button.textContent = selected ? '★ 已标记' : '☆ 标记';
    });
    timeline.querySelectorAll('[data-timeline-year]').forEach(year => {
      year.hidden = !entries.some(entry => !entry.hidden && entry.dataset.year === year.dataset.timelineYear);
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === view)));
    timeline.querySelector('.timeline-empty').hidden = count > 0;
    status.textContent = `显示 ${count} / ${entries.length} 篇` + (persistent ? '' : ' · 当前浏览器仅保留本次访问的标记');
  }
  load();
  timeline.querySelector('.timeline-controls').hidden = false;
  timeline.addEventListener('click', event => {
    const filter = event.target.closest('[data-filter]');
    const mark = event.target.closest('.article-mark');
    if (filter) view = filter.dataset.filter;
    else if (mark) {
      const path = mark.closest('[data-article-path]').dataset.articlePath;
      marked.has(path) ? marked.delete(path) : marked.add(path);
    } else return;
    save(); render();
    if (mark && mark.closest('[data-article-path]').hidden) filters.find(button => button.dataset.filter === view).focus();
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { load(); render(); } });
  render();
})();
