// =========================================================
  // TABLAS — ediciones, puntaje en vivo y modo organizador
  // NOTA: la contraseña es solo un candado simple del lado del
  // cliente para uso entre amigos, NO es seguridad real.
  //
  // SINCRONIZACIÓN ENTRE NAVEGADORES (Firebase Firestore)
  // 1. Andá a https://console.firebase.google.com y creá un proyecto (gratis).
  // 2. Build > Firestore Database > Crear base de datos (podés elegir modo producción).
  // 3. En Reglas, pegá esto (ver explicación de seguridad en el chat):
  //      rules_version = '2';
  //      service cloud.firestore {
  //        match /databases/{database}/documents {
  //          match /{document=**} { allow read, write: if true; }
  //        }
  //      }
  // 4. Configuración del proyecto (ícono de tuerca) > Tus apps > Web (</>) > copiá el
  //    objeto firebaseConfig que te da Firebase y pegalo reemplazando FIREBASE_CONFIG abajo.
  // 5. Volvé a subir/deployar el archivo. Listo: la tabla queda igual en cualquier navegador.
  // =========================================================
  
  const SCORE_GAMES = [
    { key:'db', label:'DB' },
    { key:'fc26', label:'FC26' },
    { key:'gangbeast', label:'GB' },
    { key:'brawlhalla', label:'BH' },
    { key:'haxball', label:'HaxBall' }
  ];

  const EDITIONS = [
    { id:'ed3', label:'3ra Edición (actual)', players: PLAYERS },
    { id:'ed2', label:'2da Edición (histórico)', players: PLAYERS.filter(p => p !== 'Fexx' && p !== 'Santy') }
  ];

  const ORGANIZER_PASSWORD = 'ring2026';
  const STORAGE_KEY = 'bfc_scores_by_edition_v1';

  function emptyScores(players){
    const obj = {};
    players.forEach(p => { obj[p] = {}; SCORE_GAMES.forEach(g => obj[p][g.key] = 0); });
    return obj;
  }
  function fillGaps(obj, players){
    players.forEach(p => {
      if (!obj[p]) obj[p] = {};
      SCORE_GAMES.forEach(g => { if (obj[p][g.key] === undefined) obj[p][g.key] = 0; });
    });
    return obj;
  }

  // ---- intento de conexión a Firebase ----
  let firebaseReady = false;
  let db = null;
  try{
    if (FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'TU_API_KEY' && window.firebase){
      firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      firebaseReady = true;
    }
  }catch(err){ console.error('No se pudo inicializar Firebase:', err); }

  // ---- respaldo local (mientras Firebase no esté configurado, o si falla la conexión) ----
  function loadAllScoresLocal(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }catch(e){}
    return {};
  }
  function saveAllScoresLocal(all){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); }catch(e){}
  }

  let allScores = firebaseReady ? {} : loadAllScoresLocal();
  EDITIONS.forEach(ed => {
    if (!allScores[ed.id]) allScores[ed.id] = emptyScores(ed.players);
    fillGaps(allScores[ed.id], ed.players);
  });

  let currentEditionId = EDITIONS[0].id;
  let organizerMode = sessionStorage.getItem('bfc_organizer') === '1';
  let saveTimers = {};

  const editionTabs = document.getElementById('editionTabs');
  const scoreHead = document.getElementById('scoreHead');
  const scoreBody = document.getElementById('scoreBody');
  const organizerStatus = document.getElementById('organizerStatus');
  const organizerToggle = document.getElementById('organizerToggle');
  const tableNote = document.getElementById('tableNote');
  const syncBanner = document.getElementById('syncBanner');
  const syncStatus = document.getElementById('syncStatus');

  syncBanner.classList.toggle('show', !firebaseReady);
  syncStatus.textContent = firebaseReady ? '● Sincronizado en vivo con todos los navegadores' : '○ Guardado solo en este navegador';
  syncStatus.classList.toggle('live', firebaseReady);

  // ---- suscripción en tiempo real por edición ----
  if (firebaseReady){
    EDITIONS.forEach(ed => {
      db.collection('bfc_scores').doc(ed.id).onSnapshot(snap => {
        allScores[ed.id] = snap.exists ? fillGaps(snap.data(), ed.players) : emptyScores(ed.players);
        if (ed.id === currentEditionId) renderBody();
      }, err => console.error('Error escuchando Firestore:', err));
    });
  }

  function persistEdition(edId){
    if (firebaseReady){
      clearTimeout(saveTimers[edId]);
      saveTimers[edId] = setTimeout(() => {
        db.collection('bfc_scores').doc(edId).set(allScores[edId]).catch(err => console.error('Error guardando en Firestore:', err));
      }, 400);
    } else {
      saveAllScoresLocal(allScores);
    }
  }

  function currentEdition(){ return EDITIONS.find(e => e.id === currentEditionId); }

  function renderEditionTabs(){
    editionTabs.innerHTML = '';
    EDITIONS.forEach(ed => {
      const btn = document.createElement('button');
      btn.className = 'edition-tab' + (ed.id === currentEditionId ? ' active' : '');
      btn.textContent = ed.label;
      btn.addEventListener('click', () => {
        currentEditionId = ed.id;
        renderEditionTabs();
        renderBody();
      });
      editionTabs.appendChild(btn);
    });
  }

  function renderHead(){
    scoreHead.innerHTML = `<th>Jugador</th><th class="col-total">Total</th>` +
      SCORE_GAMES.map(g => `<th>${g.label}</th>`).join('');
  }

  function totalOf(player){
    const ed = currentEdition();
    const scores = allScores[ed.id];
    return SCORE_GAMES.reduce((sum, g) => sum + (Number(scores[player][g.key]) || 0), 0);
  }

  function sanitizeDigits(str){
    return str.replace(/[^0-9]/g, '');
  }

  function renderBody(){
    const ed = currentEdition();
    const scores = allScores[ed.id];
    const sorted = [...ed.players].sort((a,b) => totalOf(b) - totalOf(a));
    scoreBody.innerHTML = '';
    sorted.forEach((player, i) => {
      const tr = document.createElement('tr');
      if (i === 0 && totalOf(player) > 0) tr.classList.add('rank-1');
      const cells = SCORE_GAMES.map(g => {
        const val = scores[player][g.key] || 0;
        return organizerMode
          ? `<td><input class="score-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3"
                data-player="${player}" data-game="${g.key}" value="${val}"></td>`
          : `<td>${val}</td>`;
      }).join('');
      tr.innerHTML = `<td>${player}</td><td class="col-total">${totalOf(player)}</td>${cells}`;
      scoreBody.appendChild(tr);
    });

    tableNote.textContent = organizerMode
      ? 'Modo organizador: escribí el puntaje directamente en cada casillero.'
      : '';

    if (organizerMode){
      scoreBody.querySelectorAll('.score-input').forEach(input => {
        input.addEventListener('input', () => {
          const clean = sanitizeDigits(input.value);
          if (clean !== input.value) input.value = clean;
          const { player, game } = input.dataset;
          scores[player][game] = clean === '' ? 0 : Number(clean);
          persistEdition(ed.id);
        });
        input.addEventListener('blur', () => { renderBody(); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
      });
    }
  }

  function renderOrganizerUI(){
    organizerStatus.textContent = organizerMode ? 'Modo organizador activo' : 'Modo espectador';
    organizerStatus.classList.toggle('active', organizerMode);
    organizerToggle.textContent = organizerMode ? 'Cerrar sesión de organizador' : 'Ingresar como organizador';
  }

  organizerToggle.addEventListener('click', () => {
    if (organizerMode){
      organizerMode = false;
      sessionStorage.removeItem('bfc_organizer');
    } else {
      const pass = prompt('Contraseña de organizador:');
      if (pass === ORGANIZER_PASSWORD){
        organizerMode = true;
        sessionStorage.setItem('bfc_organizer', '1');
      } else if (pass !== null){
        alert('Contraseña incorrecta.');
      }
    }
    renderOrganizerUI();
    renderBody();
    if (typeof renderBracketView === 'function' && currentBracketGame) renderBracketView();
  });

  renderEditionTabs();
  renderHead();
  renderOrganizerUI();
  renderBody();
