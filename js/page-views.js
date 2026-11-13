(() => {
  const value = document.getElementById('busuanzi_value_page_pv');
  const status = document.getElementById('page-views-status');
  if (!value || !status) return;

  // Count only visits to the configured public site; previews stay local.
  const site = new URL(document.currentScript.dataset.siteUrl);
  if (location.hostname !== site.hostname) {
    status.textContent = '上线后统计';
    return;
  }

  const unavailable = () => { status.textContent = '暂时无法获取'; };
  const timeout = setTimeout(unavailable, 15000);
  const observer = new MutationObserver(() => {
    if (/^\d+$/.test(value.textContent.trim())) {
      status.hidden = true;
      clearTimeout(timeout);
      observer.disconnect();
    }
  });
  observer.observe(value, { childList: true, subtree: true, characterData: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.onerror = () => {
    clearTimeout(timeout);
    unavailable();
    observer.disconnect();
  };
  document.head.appendChild(script);
})();
