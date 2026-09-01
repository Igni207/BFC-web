// =========================================================
// MÚSICA DE FONDO — se reproduce muy despacio en loop.
// Agregá tu archivo en assets/music/theme.mp3 (ver README ahí adentro).
// Arranca sola en la primera interacción del usuario (los navegadores
// bloquean el autoplay con sonido hasta que hay un click/touch/tecla),
// y recuerda si la persona la apagó para no molestarla en su próxima visita.
// =========================================================
(function () {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  if (!audio || !btn) return;

  const TARGET_VOLUME = 0.18;
  const STORAGE_KEY = 'bfc_music_enabled';
  audio.volume = 0;

  function fadeTo(target, duration) {
    const start = audio.volume;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      audio.volume = start + (target - start) * t;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function play() {
    audio.play().then(() => {
      fadeTo(TARGET_VOLUME, 2000);
      btn.textContent = '🔊';
      btn.classList.add('playing');
      localStorage.setItem(STORAGE_KEY, '1');
    }).catch(() => {
      // Sin archivo cargado todavía, o el navegador lo bloqueó — no pasa nada,
      // se vuelve a intentar en la próxima interacción.
    });
  }

  function pause() {
    fadeTo(0, 500);
    setTimeout(() => audio.pause(), 520);
    btn.textContent = '🔇';
    btn.classList.remove('playing');
    localStorage.setItem(STORAGE_KEY, '0');
  }

  btn.addEventListener('click', () => {
    if (audio.paused) play(); else pause();
  });

  const pref = localStorage.getItem(STORAGE_KEY);
  if (pref !== '0') {
    const tryStart = () => { if (audio.paused) play(); };
    document.addEventListener('click', tryStart, { once: true });
    document.addEventListener('keydown', tryStart, { once: true });
    document.addEventListener('touchstart', tryStart, { once: true });
  }
})();
