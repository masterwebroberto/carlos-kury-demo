/* Una vez por sesión. Sin storage o con movimiento reducido, acceso directo. */
(() => {
  const intro = document.querySelector('.artist-intro');
  if (!intro) return;
  const key = 'carlos-kury:intro-seen';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch { return; }
  if (motion.matches) return;
  const logo = intro.querySelector('img');
  const skip = intro.querySelector('button');
  let timer;
  let active = false;
  let previous;
  function finish() {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    const restore = intro.contains(document.activeElement);
    intro.hidden = true;
    document.removeEventListener('keydown', keyboard);
    motion.removeEventListener('change', finish);
    if (restore) {
      const target = previous && previous !== document.body && previous.isConnected ? previous : document.querySelector('#contenido');
      target?.focus({ preventScroll: true });
    }
  }
  function keyboard(event) {
    if (!active || getComputedStyle(intro).visibility === 'hidden') return;
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
    else if (event.key === 'Tab') { event.preventDefault(); skip.focus({ preventScroll: true }); }
  }
  function start() {
    if (!logo.naturalWidth || motion.matches) return;
    previous = document.activeElement;
    active = true;
    // Instalar la salida antes de mostrar la capa.
    timer = setTimeout(finish, 2600);
    intro.addEventListener('animationend', event => { if (event.target === intro) finish(); });
    skip.addEventListener('click', finish);
    document.addEventListener('keydown', keyboard);
    motion.addEventListener('change', finish);
    intro.hidden = false;
    skip.focus({ preventScroll: true });
  }
  if (logo.complete) start();
  else logo.addEventListener('load', start, { once: true });
})();
