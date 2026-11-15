/* Spotify independiente de YouTube: un único iframe, creado solo a petición. */
(() => {
  let activeButton;
  function closePlayer(button) {
    document.getElementById(button.getAttribute('aria-controls')).replaceChildren();
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.querySelector('span').textContent = 'Reproducir';
    button.setAttribute('aria-label', `Reproducir ${button.closest('[data-spotify-card]').querySelector('h3, h4').textContent}`);
    activeButton = undefined;
  }
  document.querySelectorAll('[data-spotify-open]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (activeButton === button) { closePlayer(button); return; }
      if (activeButton) closePlayer(activeButton);
      const { spotifyType: type, spotifyId: id } = button.dataset;
      if (!['track', 'album'].includes(type) || !/^[a-zA-Z0-9]{22}$/.test(id)) return;
      const title = button.closest('[data-spotify-card]').querySelector('h3, h4').textContent;
      const player = document.getElementById(button.getAttribute('aria-controls'));
      const iframe = document.createElement('iframe');
      iframe.title = `Spotify: ${title}`;
      iframe.src = `https://open.spotify.com/embed/${type}/${id}?utm_source=oembed`;
      iframe.width = '100%';
      iframe.height = type === 'album' ? '352' : '152';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(iframe);
      player.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('span').textContent = 'Cerrar reproductor';
      button.setAttribute('aria-label', `Cerrar reproductor de ${title}`);
      activeButton = button;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeButton && event.target.closest('[data-spotify-card]')) {
      const button = activeButton;
      closePlayer(button);
      button.focus({ preventScroll: true });
    }
  });
})();
