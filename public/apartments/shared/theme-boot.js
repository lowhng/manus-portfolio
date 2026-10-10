/**
 * Apply embed flags and the apartment theme before first paint.
 * Query ?theme= wins (so an embed follows its parent). Otherwise a stored
 * choice in localStorage wins. With neither, the page follows
 * prefers-color-scheme and does not set data-theme.
 */
(function () {
  const KEY = 'apartments-theme';
  const q = new URLSearchParams(location.search);
  const root = document.documentElement;
  if (q.get('embed') === '1') root.classList.add('embed');
  if (q.get('embed') === '1' && q.get('explore') !== '1') root.classList.add('locked');
  if (q.get('ui') === '0') root.classList.add('noui');

  const queryTheme = q.get('theme');
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (err) { stored = null; }
  if (queryTheme === 'light' || queryTheme === 'dark') {
    root.dataset.theme = queryTheme;
    root.dataset.themeSource = 'query';
  } else if (stored === 'light' || stored === 'dark') {
    root.dataset.theme = stored;
    root.dataset.themeSource = 'stored';
  } else {
    delete root.dataset.theme;
    root.dataset.themeSource = 'system';
  }

  function effective() {
    const t = root.dataset.theme;
    if (t === 'light' || t === 'dark') return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    try { localStorage.setItem(KEY, theme); } catch (err) { /* private mode */ }
    root.dataset.theme = theme;
    root.dataset.themeSource = 'stored';
    window.dispatchEvent(new CustomEvent('apartments-theme', { detail: theme }));
  }

  function mount(parent) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    function label() {
      const dark = effective() === 'dark';
      btn.textContent = dark ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    btn.addEventListener('click', () => setTheme(effective() === 'dark' ? 'light' : 'dark'));
    parent.appendChild(btn);
    label();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (root.dataset.themeSource === 'system') {
        label();
        window.dispatchEvent(new CustomEvent('apartments-theme', { detail: effective() }));
      }
    });
    return btn;
  }

  window.apartmentsTheme = { key: KEY, effective, set: setTheme, mount };
})();
