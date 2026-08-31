// =========================================================
  // INTRO ANIMATION
  // =========================================================
  const introEl = document.getElementById('intro');
  const introLetters = document.getElementById('introLetters');
  const mainEl = document.getElementById('main');
  const skipBtn = document.getElementById('skipIntro');
  const bodyEl = document.body;
  const topnav = document.getElementById('topnav');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wordTargets = {
    wordB: { el: document.getElementById('wordB'), text: 'ASED' },
    wordF: { el: document.getElementById('wordF'), text: 'IGHTING' },
    wordC: { el: document.getElementById('wordC'), text: 'UP' }
  };

  function typeWordVertical(target, delayStart){
    return new Promise(resolve => {
      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          const span = document.createElement('span');
          span.className = 'vchar';
          span.textContent = target.text[i];
          target.el.appendChild(span);
          i++;
          if (i >= target.text.length){
            clearInterval(interval);
            resolve();
          }
        }, 110);
      }, delayStart);
    });
  }

  function revealMain(){
    introEl.classList.add('fade-out');
    mainEl.classList.remove('hidden-init');
    requestAnimationFrame(() => {
      mainEl.classList.add('reveal');
      bodyEl.classList.remove('lock');
    });
    setTimeout(() => { introEl.style.display = 'none'; }, 850);
  }

  async function playIntro(){
    if (reduceMotion){ revealMain(); return; }
    await new Promise(r => setTimeout(r, 500));
    introLetters.classList.add('spread');
    await new Promise(r => setTimeout(r, 700));
    await Promise.all([
      typeWordVertical(wordTargets.wordB, 0),
      typeWordVertical(wordTargets.wordF, 250),
      typeWordVertical(wordTargets.wordC, 550)
    ]);
    await new Promise(r => setTimeout(r, 1000));
    revealMain();
  }
  skipBtn.addEventListener('click', revealMain);
  playIntro();

  // =========================================================
  // RING → NAV TRANSITION + GLITCH WORDS
  // =========================================================
  const ringStage = document.getElementById('ringStage');
  const ringNavStage = document.getElementById('ringNavStage');
  const ringFrame = document.getElementById('ringFrame');
  let navTriggered = false;
  let glitchInterval = null;

  const bfcMarquee = document.getElementById('bfcMarquee');
  'BASED FIGHTING CUP'.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = (i * 0.06) + 's';
    bfcMarquee.appendChild(span);
  });

  function spawnGlitchWord(){
    const word = GLITCH_WORDS[Math.floor(Math.random() * GLITCH_WORDS.length)];
    const el = document.createElement('span');
    el.className = 'glitch-word';
    el.textContent = word;
    const side = Math.random() < 0.5 ? 'left' : 'right';
    el.style[side] = (2 + Math.random() * 5) + '%';
    el.style.top = (8 + Math.random() * 78) + '%';
    const colors = ['var(--red)','var(--yellow)','var(--cyan)','var(--white)'];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    ringNavStage.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  function activateRingNav(){
    if (navTriggered) return;
    navTriggered = true;
    ringStage.classList.add('nav-active');
    if (!reduceMotion){
      glitchInterval = setInterval(spawnGlitchWord, 1300);
    }
  }
  ringFrame.addEventListener('click', activateRingNav);
  setTimeout(() => { if (!reduceMotion) activateRingNav(); }, 2600);
  if (reduceMotion) activateRingNav();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelector(btn.dataset.target).scrollIntoView({ behavior:'smooth' });
    });
  });

  window.addEventListener('scroll', () => {
    topnav.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
  });

  // =========================================================
  // ROSTER
  // =========================================================
  const teamByPlayer = {};
  HAXBALL_TEAMS.forEach(t => t.players.forEach(p => { teamByPlayer[p] = t.name; }));

  const rosterGrid = document.getElementById('rosterGrid');
  PLAYERS.forEach((name, i) => {
    const card = document.createElement('div');
    card.className = 'roster-card';
    card.innerHTML = `
      <div class="roster-num">#${String(i+1).padStart(2,'0')}</div>
      <div class="roster-name">${name}</div>
      ${teamByPlayer[name] ? `<div class="roster-tag">HaxBall: ${teamByPlayer[name]}</div>` : ''}
    `;
    rosterGrid.appendChild(card);
  });

  // =========================================================
  // REDES
  // =========================================================
  const REDES = [
    { name:'YouTube', sub:'@PibesBasados', href:'https://www.youtube.com/@PibesBasados' }
  ];
  const redesGrid = document.getElementById('redesGrid');
  REDES.forEach(r => {
    const a = document.createElement('a');
    a.className = 'red-card';
    a.href = r.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `<div class="red-name">${r.name}</div><div class="red-sub">${r.sub}</div>`;
    redesGrid.appendChild(a);
  });

  // =========================================================
  // JUEGOS + MODAL
  // =========================================================
  const gamesGrid = document.getElementById('gamesGrid');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalPanel = document.getElementById('modalPanel');

  GAMES.forEach((game, index) => {
    const card = document.createElement('button');
    card.className = 'game-card';
    card.style.setProperty('--accent', game.accent);
    card.innerHTML = `
      <div class="game-num">0${index + 1}</div>
      <div class="game-name">${game.name}</div>
      <div class="game-tag">${game.tag}</div>
      <div class="game-cta">Ver reglas →</div>
    `;
    card.addEventListener('click', () => openModal(game));
    gamesGrid.appendChild(card);
  });

  function openModal(game){
    document.getElementById('modalTitle').textContent = game.name;
    document.getElementById('modalBody').innerHTML = game.detailsHTML;
    modalPanel.style.setProperty('--accent', game.accent);
    modalOverlay.classList.add('open');

    if (game.id === 'db'){
      const pdBody = document.getElementById('pdTableBody');
      pdBody.innerHTML = PD_CHARACTERS.map(([n,pd]) => `<tr><td>${n}</td><td>${pd}</td></tr>`).join('');
      document.getElementById('pdToggle').addEventListener('click', function(){
        const body = document.getElementById('pdBody');
        body.classList.toggle('open');
        this.querySelector('span').textContent = body.classList.contains('open') ? '−' : '+';
      });
    }

    if (game.id === 'haxball'){
      const teamsGrid = document.getElementById('teamsGrid');
      teamsGrid.innerHTML = HAXBALL_TEAMS.map(t => `
        <div class="team-card">
          <div class="team-logo">
            <img src="${t.logo}" alt="${t.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="logo-fallback">${t.name.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase()}</div>
          </div>
          <div>
            <div class="team-name">${t.name}</div>
            <div class="team-players">${t.players.join(' · ')}</div>
          </div>
        </div>
      `).join('');
    }
  }

  function closeModal(){ modalOverlay.classList.remove('open'); }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
