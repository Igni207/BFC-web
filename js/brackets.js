// =========================================================
  // BRACKETS — sorteo, cruces y resultados en vivo
  // Dragon Ball, FC26 y Brawlhalla comparten el motor RedRank.
  // HaxBall (equipos) y Gang Beast (fase 1) tienen su propio motor,
  // más simple, más abajo.
  // =========================================================
  const REDRANK_GAMES = [
    { id:'db', label:'Dragon Ball Sparking Zero', hasDraw:false },
    { id:'fc26', label:'FC26', hasDraw:true },
    { id:'brawlhalla', label:'Brawlhalla', hasDraw:true }
  ];
  const BRACKET_GAMES = [
    { id:'db', label:'Dragon Ball Sparking Zero', type:'redrank', hasDraw:false },
    { id:'fc26', label:'FC26', type:'redrank', hasDraw:true },
    { id:'brawlhalla', label:'Brawlhalla', type:'redrank', hasDraw:true },
    { id:'haxball', label:'HaxBall', type:'haxball', hasDraw:false },
    { id:'gangbeast', label:'Gang Beast', type:'gangbeast', hasDraw:false }
  ];

  const GANGBEAST_FASE1_PRESET = [
    ['Kacha','Gonzi'], ['Chata','Rojo'], ['Santy','Mena'], ['Croc','Sosa'], ['Fexx','Milanesa']
  ];

  // Colores de cada jugador para el fondo/iluminación del VS.
  const PLAYER_COLORS = {
    Kacha:'#f2efe6', Mena:'#b026ff', Rojo:'#e8352b', Milanesa:'#2e6bf0', Croc:'#3fd1e0',
    Sosa:'#f2a83c', Chata:'#141c5c', Gonzi:'#39ff6a', Santy:'#b98cf2', Fexx:'#a8552b'
  };
  // Cuando tengas las siluetas PNG (sin fondo), agregalas acá, ej: Kacha:'assets/siluetas/kacha.png'
  const PLAYER_SILHOUETTES = {};

  // Sorteos ya realizados por el organizador (Ronda 1). Si un juego tiene un
  // preset acá, "Realizar sorteo" usa este orden en vez de uno al azar.
  const PRESET_DRAWS = {
    db: [ ['Kacha','Mena'], ['Milanesa','Santy'], ['Fexx','Rojo'], ['Sosa','Chata'], ['Croc','Gonzi'] ],
    fc26: [ ['Croc','Santy'], ['Gonzi','Mena'], ['Fexx','Rojo'], ['Chata','Sosa'], ['Kacha','Milanesa'] ],
    brawlhalla: [ ['Rojo','Santy'], ['Chata','Fexx'], ['Mena','Croc'], ['Kacha','Sosa'], ['Milanesa','Gonzi'] ]
  };

  // Equipos de FC26 (sorteados entre las 10 mejores medias del juego)
  const FC26_TEAMS = {
    Rojo:'Bayern Múnich', Milanesa:'Chelsea', Fexx:'Inter de Milán', Chata:'Atlético de Madrid',
    Sosa:'PSG', Gonzi:'Liverpool', Kacha:'Barcelona', Croc:'Arsenal', Mena:'Manchester City', Santy:'Real Madrid'
  };

  const BRACKET_COLLECTION = 'bfc_brackets';
  const BRACKET_LOCAL_KEY = 'bfc_brackets_local';

  function emptyBracketState(type, gameId){
    if (type === 'haxball'){
      return {
        stage:'repechaje',
        repechaje:{ a:'Pajertan Vergrado', b:'Sementales FC', winner:null, advancer:null },
        semis:null, final:null, third:null,
        applied:false, history:[]
      };
    }
    if (type === 'gangbeast'){
      return {
        stage:'fase1',
        fase1: GANGBEAST_FASE1_PRESET.map(([a,b]) => ({ a, b, winner:null, advancer:null })),
        promoted: [],
        group1: null, repechajePool: null, repechajeMatches: null, bestLoser2: null,
        group2: null, eliminated: [],
        groupStars: { g1:{}, g2:{} }, groupQualifiers: { g1:null, g2:null },
        finalStars: {}, finalResults: null,
        applied:false, history:[]
      };
    }
    const preset = gameId && PRESET_DRAWS[gameId];
    return {
      stage:'r1',
      r1: preset ? preset.map(([a,b]) => ({ a, b, winner:null, advancer:null })) : null,
      bestLoser:null, groupA:null, groupB:null,
      r2a:null, r2bSemis:null, r2bFinal:null,
      place56:{ p5:null, p6:null },
      r3semis:null, r3final:null, r3third:null,
      applied:false, history:[]
    };
  }
  function loadBracketsLocal(){ try{ return JSON.parse(localStorage.getItem(BRACKET_LOCAL_KEY) || '{}'); }catch(e){ return {}; } }
  function saveBracketsLocal(all){ try{ localStorage.setItem(BRACKET_LOCAL_KEY, JSON.stringify(all)); }catch(e){} }

  let bracketsLocalCache = firebaseReady ? {} : loadBracketsLocal();
  let brackets = {};
  let currentBracketGame = null;

  function bracketType(gameId){ return (BRACKET_GAMES.find(g => g.id === gameId) || {}).type || 'redrank'; }

  function ensureBracket(gameId){
    if (!brackets[gameId]){
      brackets[gameId] = bracketsLocalCache[gameId]
        ? JSON.parse(JSON.stringify(bracketsLocalCache[gameId]))
        : emptyBracketState(bracketType(gameId), gameId);
    }
  }

  if (firebaseReady){
    BRACKET_GAMES.forEach(g => {
      db.collection(BRACKET_COLLECTION).doc(g.id).onSnapshot(snap => {
        brackets[g.id] = snap.exists ? snap.data() : emptyBracketState(g.type, g.id);
        if (currentBracketGame === g.id) renderBracketView();
      }, err => console.error('Error escuchando bracket de', g.id, err));
    });
  }

  function saveBracket(gameId){
    if (firebaseReady){
      db.collection(BRACKET_COLLECTION).doc(gameId).set(brackets[gameId]).catch(err => console.error('Error guardando bracket:', err));
    } else {
      bracketsLocalCache[gameId] = brackets[gameId];
      saveBracketsLocal(bracketsLocalCache);
    }
  }
  function pushHistory(gameId){
    const { history, ...rest } = brackets[gameId];
    const snap = JSON.stringify(rest);
    brackets[gameId].history = (history || []).concat([snap]).slice(-15);
  }
  function undoBracket(gameId){
    const hist = brackets[gameId].history || [];
    if (!hist.length) return;
    const prev = JSON.parse(hist[hist.length - 1]);
    prev.history = hist.slice(0, -1);
    brackets[gameId] = prev;
    saveBracket(gameId);
    renderBracketView();
  }

  function shufflePairs(players){
    const arr = [...players];
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const pairs = [];
    for (let i = 0; i < arr.length; i += 2) pairs.push({ a: arr[i], b: arr[i+1], winner: null, advancer: null });
    return pairs;
  }
  function getAdvancer(m){ return m.advancer || null; }

  function nonQualifiers(st){
    if (!st.groupA || !st.r2a) return [];
    const groupAAdv = st.r2a.map(getAdvancer);
    const groupALosers = st.groupA.filter(p => !groupAAdv.includes(p));
    const groupBAdv = st.r2bFinal ? getAdvancer(st.r2bFinal) : null;
    const groupBOut = (st.groupB || []).filter(p => p !== groupBAdv);
    return [...groupALosers, ...groupBOut];
  }

  function advanceStage(gameId){
    const st = brackets[gameId];

    if (st.r1 && st.r1.every(m => getAdvancer(m)) && !st.r2a){
      if (st.bestLoser === null) return; // falta que el organizador elija al mejor perdedor
      const winners = st.r1.map(getAdvancer);
      const losers = st.r1.map(m => (m.a === getAdvancer(m) ? m.b : m.a));
      st.groupA = [...winners, st.bestLoser];
      st.groupB = losers.filter(p => p !== st.bestLoser);
      st.r2a = shufflePairs(st.groupA);
      st.r2bSemis = shufflePairs(st.groupB);
    }

    if (st.r2a && st.r2a.every(m => getAdvancer(m)) && st.r2bSemis && st.r2bSemis.every(m => getAdvancer(m)) && !st.r2bFinal){
      const semiWinners = st.r2bSemis.map(getAdvancer);
      st.r2bFinal = { a: semiWinners[0], b: semiWinners[1], winner: null, advancer: null };
    }

    if (st.r2bFinal && getAdvancer(st.r2bFinal) && !st.r3semis){
      const qualifiers = [...st.r2a.map(getAdvancer), getAdvancer(st.r2bFinal)];
      st.r3semis = [
        { a: qualifiers[0], b: qualifiers[2], winner: null, advancer: null },
        { a: qualifiers[1], b: qualifiers[3], winner: null, advancer: null }
      ];
    }

    if (st.r3semis && st.r3semis.every(m => getAdvancer(m)) && !st.r3final){
      const w = st.r3semis.map(getAdvancer);
      st.r3final = { a: w[0], b: w[1], winner: null, advancer: null };
      st.r3third = {
        a: st.r3semis[0].a === w[0] ? st.r3semis[0].b : st.r3semis[0].a,
        b: st.r3semis[1].a === w[1] ? st.r3semis[1].b : st.r3semis[1].a,
        winner: null, advancer: null
      };
    }

    if (st.r3final && getAdvancer(st.r3final) && st.r3third && getAdvancer(st.r3third)){
      st.stage = 'ranked';
    }
  }

  function advanceHaxball(gameId){
    const st = brackets[gameId];
    if (getAdvancer(st.repechaje) && !st.semis){
      const repW = getAdvancer(st.repechaje);
      st.semis = [
        { a:'Deportivo Vergatieso', b: repW, winner:null, advancer:null },
        { a:'Lomas Turbas', b:'Unión Glande', winner:null, advancer:null }
      ];
    }
    if (st.semis && st.semis.every(m => getAdvancer(m)) && !st.final){
      const w = st.semis.map(getAdvancer);
      st.final = { a:w[0], b:w[1], winner:null, advancer:null };
      st.third = {
        a: st.semis[0].a === w[0] ? st.semis[0].b : st.semis[0].a,
        b: st.semis[1].a === w[1] ? st.semis[1].b : st.semis[1].a,
        winner:null, advancer:null
      };
    }
    if (st.final && getAdvancer(st.final) && st.third && getAdvancer(st.third)){
      st.stage = 'ranked';
    }
  }

  function resolveMatch(gameId, roundKey, i, who, scoreA, scoreB){
    pushHistory(gameId);
    const st = brackets[gameId];
    const target = i === -1 ? st[roundKey] : st[roundKey][i];
    target.winner = who;
    if (who !== 'draw') target.advancer = who;
    if (scoreA !== undefined) target.scoreA = scoreA;
    if (scoreB !== undefined) target.scoreB = scoreB;
    const type = bracketType(gameId);
    if (type === 'redrank') advanceStage(gameId);
    else if (type === 'haxball') advanceHaxball(gameId);
    // gangbeast: la fase 1 no encadena rondas automáticamente todavía.
    saveBracket(gameId);
    renderBracketView();
  }

  function computeFinalPoints(st){
    const pts = {};
    const finalW = getAdvancer(st.r3final);
    pts[finalW] = 5;
    pts[st.r3final.a === finalW ? st.r3final.b : st.r3final.a] = 4;
    const thirdW = getAdvancer(st.r3third);
    pts[thirdW] = 3;
    pts[st.r3third.a === thirdW ? st.r3third.b : st.r3third.a] = 2;
    if (st.place56.p5) pts[st.place56.p5] = 1;
    if (st.place56.p6) pts[st.place56.p6] = 1;
    return pts;
  }

  // HaxBall reparte puntos por EQUIPO — se aplican los mismos puntos a los 2 jugadores del equipo.
  function computeHaxballTeamPoints(st){
    const pts = {};
    const finalW = getAdvancer(st.final);
    pts[finalW] = 5;
    pts[st.final.a === finalW ? st.final.b : st.final.a] = 4;
    const thirdW = getAdvancer(st.third);
    pts[thirdW] = 3;
    pts[st.third.a === thirdW ? st.third.b : st.third.a] = 2;
    const repLoser = getAdvancer(st.repechaje) === st.repechaje.a ? st.repechaje.b : st.repechaje.a;
    pts[repLoser] = 1;
    return pts;
  }
  function haxballPointsByPlayer(st){
    const teamPts = computeHaxballTeamPoints(st);
    const pts = {};
    HAXBALL_TEAMS.forEach(t => {
      if (teamPts[t.name] !== undefined){
        t.players.forEach(p => { pts[p] = teamPts[t.name]; });
      }
    });
    return { teamPts, pts };
  }

  function computeGangbeastPoints(st){
    const pts = {};
    [...(st.group1 || []), ...(st.group2 || [])].forEach(p => pts[p] = 1);
    if (st.finalResults){
      pts[st.finalResults.champion] = 5;
      pts[st.finalResults.second] = 4;
      pts[st.finalResults.third] = 3;
      pts[st.finalResults.fourth] = 2;
    }
    return pts;
  }

  function goalDifference(roundsArrays){
    const gd = {};
    PLAYERS.forEach(p => gd[p] = 0);
    roundsArrays.forEach(arr => {
      (arr || []).forEach(m => {
        if (!m || m.scoreA === undefined || m.scoreA === null) return;
        gd[m.a] = (gd[m.a] || 0) + (m.scoreA - m.scoreB);
        gd[m.b] = (gd[m.b] || 0) + (m.scoreB - m.scoreA);
      });
    });
    return gd;
  }

  function partialPoints(st){
    const p = {};
    PLAYERS.forEach(pl => p[pl] = 0);
    [st.r1, st.r2a, st.r2bSemis].forEach(arr => {
      (arr || []).forEach(m => {
        if (!m.winner) return;
        if (m.winner === 'draw'){ p[m.a] += 1; p[m.b] += 1; }
        else { p[m.winner] += 3; }
      });
    });
    return p;
  }

  function matchRowHTML(gameId, roundKey, idx, m, hasDraw, scoreMode){
    scoreMode = scoreMode || 'none';
    const advancer = getAdvancer(m);
    const decided = !!advancer;
    const needsTie = m.winner === 'draw' && !m.advancer;
    const idxAttr = idx === -1 ? 'x' : idx;
    let inner;
    if (!decided && !needsTie){
      if (!organizerMode){
        inner = `<span class="match-tag waiting">Esperando resultado del organizador…</span>`;
      } else if (scoreMode === 'goals' || scoreMode === 'stars'){
        const hint = scoreMode === 'goals' ? 'goles de cada uno — el empate se calcula solo' : 'estrellas totales de cada uno en el mejor de 3';
        inner = `<div class="score-entry">
          <span class="score-name">${m.a}</span>
          <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" class="score-mini" data-scorefield="a" placeholder="0">
          <span class="score-sep">–</span>
          <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" class="score-mini" data-scorefield="b" placeholder="0">
          <span class="score-name">${m.b}</span>
          <button data-act="scoreconfirm" data-round="${roundKey}" data-idx="${idxAttr}" data-a="${m.a}" data-b="${m.b}" data-mode="${scoreMode}">Confirmar</button>
          <span class="score-hint">${hint}</span>
        </div>`;
      } else {
        inner = `<div class="match-actions">
          <button data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${m.a}">Ganó ${m.a}</button>
          ${hasDraw ? `<button class="draw-btn" data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="draw">Empate</button>` : ''}
          <button data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${m.b}">Ganó ${m.b}</button>
          <button data-act="vs" data-round="${roundKey}" data-idx="${idxAttr}">Ver presentación</button>
        </div>`;
      }
    } else if (needsTie){
      if (!organizerMode){
        inner = `<span class="match-tag waiting">Empate — esperando que el organizador decida quién avanza…</span>`;
      } else {
        inner = `<div class="tie-alert">Empate — elegí quién avanza:
          <div class="match-actions">
            <button data-act="tie" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${m.a}">${m.a}</button>
            <button data-act="tie" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${m.b}">${m.b}</button>
          </div></div>`;
      }
    } else {
      const scoreLabel = (m.scoreA !== undefined && m.scoreA !== null) ? ` (${m.scoreA}-${m.scoreB})` : '';
      inner = `<span class="match-tag">Avanza${scoreLabel}</span>`;
    }
    return `<div class="match-row ${decided ? 'decided' : ''}">
      <div class="match-players">
        <span class="${advancer === m.a ? 'winner-name' : ''}"><b>${m.a}</b></span>
        <span class="match-vs-mini">VS</span>
        <span class="${advancer === m.b ? 'winner-name' : ''}"><b>${m.b}</b></span>
      </div>
      ${inner}
    </div>`;
  }

  // ---- VS overlay a pantalla completa ----
  const vsOverlay = document.getElementById('vsOverlay');
  const vsFigLeft = document.getElementById('vsFigLeft');
  const vsFigRight = document.getElementById('vsFigRight');
  const vsNameLeft = document.getElementById('vsNameLeft');
  const vsNameRight = document.getElementById('vsNameRight');
  const vsPickRow = document.getElementById('vsPickRow');

  function openVsOverlay(gameId, roundKey, idxAttr, a, b){
    const colorA = PLAYER_COLORS[a] || 'var(--red)';
    const colorB = PLAYER_COLORS[b] || 'var(--cyan)';
    vsOverlay.style.setProperty('--p1c', colorA);
    vsOverlay.style.setProperty('--p2c', colorB);
    vsFigLeft.style.setProperty('--figc', colorA);
    vsFigRight.style.setProperty('--figc', colorB);
    vsFigLeft.innerHTML = PLAYER_SILHOUETTES[a] ? `<img src="${PLAYER_SILHOUETTES[a]}" onerror="this.remove()">` : '';
    vsFigRight.innerHTML = PLAYER_SILHOUETTES[b] ? `<img src="${PLAYER_SILHOUETTES[b]}" onerror="this.remove()">` : '';
    vsNameLeft.textContent = a;
    vsNameRight.textContent = b;
    const gameDef = BRACKET_GAMES.find(g => g.id === gameId);
    vsPickRow.innerHTML = `
      <button data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${a}">${a}</button>
      ${gameDef.hasDraw ? `<button class="draw" data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="draw">Empate</button>` : ''}
      <button data-act="win" data-round="${roundKey}" data-idx="${idxAttr}" data-who="${b}">${b}</button>
    `;
    vsOverlay.dataset.game = gameId;
    vsOverlay.classList.add('open');
    requestAnimationFrame(() => requestAnimationFrame(() => vsOverlay.classList.add('reveal')));
  }
  function closeVsOverlay(){ vsOverlay.classList.remove('open', 'reveal'); }
  document.getElementById('vsSkip').addEventListener('click', closeVsOverlay);
  vsPickRow.addEventListener('click', (e) => {
    if (!organizerMode) return;
    const btn = e.target.closest('button[data-act="win"]');
    if (!btn) return;
    const idxAttr = btn.dataset.idx;
    resolveMatch(vsOverlay.dataset.game, btn.dataset.round, idxAttr === 'x' ? -1 : Number(idxAttr), btn.dataset.who);
    closeVsOverlay();
  });

  // ---- render principal del bracket ----
  const bracketViewEl = document.getElementById('bracketView');

  function playDrawAnimation(gameId, onDone){
    if (reduceMotion){ onDone(); return; }
    let ticks = 0;
    const maxTicks = 14;
    const tick = () => {
      const shuffled = shufflePairs(PLAYERS);
      bracketViewEl.innerHTML = `<div class="draw-shuffle">
        <div class="ds-label">Sorteando Ronda 1…</div>
        ${shuffled.map(p => `<div class="ds-pair">${p.a} <span style="color:var(--dim);font-family:var(--font-mono);">vs</span> ${p.b}</div>`).join('')}
      </div>`;
      ticks++;
      if (ticks < maxTicks) setTimeout(tick, 110);
      else onDone();
    };
    tick();
  }

  function renderHaxballView(){
    const gameId = 'haxball';
    const st = brackets[gameId];
    let mainHTML = `<div class="bracket-round-card"><div class="bracket-round-title">Repechaje — clasifica al 4to lugar del cuadro</div>`;
    mainHTML += matchRowHTML(gameId,'repechaje',-1,st.repechaje,false);
    mainHTML += `</div>`;

    if (st.semis){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Semifinales</div>`;
      mainHTML += st.semis.map((m,i) => matchRowHTML(gameId,'semis',i,m,false)).join('');
      mainHTML += `</div>`;
    }
    if (st.final){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Final</div>`;
      mainHTML += matchRowHTML(gameId,'final',-1,st.final,false);
      mainHTML += `</div><div class="bracket-round-card"><div class="bracket-round-title">Tercer puesto</div>`;
      mainHTML += matchRowHTML(gameId,'third',-1,st.third,false);
      mainHTML += `</div>`;
    }
    if (st.stage === 'ranked'){
      const { teamPts } = haxballPointsByPlayer(st);
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Resultado final</div>
        <div class="final-ranking">${Object.entries(teamPts).sort((a,b)=>b[1]-a[1]).map(([t,v]) => `<div class="fr-chip"><b>${t}</b><span>${v} pts (por jugador)</span></div>`).join('')}</div>
        ${organizerMode ? `<button class="btn" data-act="applyhax" ${st.applied ? 'disabled' : ''}>${st.applied ? 'Puntaje ya aplicado ✓' : 'Aplicar puntaje a la Tabla'}</button>` : ''}
      </div>`;
    }

    let sideHTML = `<div class="side-panel"><h4>Equipos</h4>`;
    sideHTML += HAXBALL_TEAMS.map(t => `<div class="standing-row"><span>${t.name}</span><b style="font-family:var(--font-mono);font-size:.72rem;color:var(--dim);">${t.players.join(' · ')}</b></div>`).join('');
    sideHTML += `</div>`;
    if (organizerMode){
      sideHTML += `<div class="side-panel side-actions">
        <button class="btn btn--ghost" data-act="undo" ${(!st.history || !st.history.length) ? 'disabled' : ''}>Deshacer último cambio</button>
        <button class="btn btn--ghost" data-act="reset">Reiniciar bracket</button>
      </div>`;
    }
    bracketViewEl.innerHTML = `<div class="bracket-layout"><div class="bracket-main">${mainHTML}</div><div class="bracket-side">${sideHTML}</div></div>`;
  }

  function starInputRow(p, key, value){
    return `<div style="display:flex;gap:.6rem;align-items:center;margin-bottom:.5rem;">
      <span style="flex:1;font-family:var(--font-sub);">${p}</span>
      <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" data-gbstar="${key}" data-player="${p}"
        value="${value ?? ''}" placeholder="★"
        style="width:52px;background:var(--bg);border:1px solid var(--line);color:var(--white);text-align:center;font-family:var(--font-mono);padding:.35rem;box-sizing:border-box;">
    </div>`;
  }

  function groupCardHTML(title, key, players, st){
    const qualified = st.groupQualifiers[key];
    if (qualified){
      return `<div class="bracket-round-card"><div class="bracket-round-title">${title} — resultado</div>
        <div class="final-ranking">${qualified.map(p => `<div class="fr-chip"><b>${p}</b><span>Clasifica a la Final</span></div>`).join('')}</div>
      </div>`;
    }
    const stars = st.groupStars[key] || {};
    return `<div class="bracket-round-card"><div class="bracket-round-title">${title} — todos contra todos (hasta 5 estrellas)</div>
      <p style="font-family:var(--font-sub);color:var(--dim);font-size:.85rem;margin:-.4rem 0 1rem;">Cuando terminen de jugar, cargá cuántas estrellas terminó teniendo cada uno. Pasan los 2 primeros.</p>
      ${players.map(p => starInputRow(p, key, stars[p])).join('')}
      ${organizerMode ? `<button class="btn" data-act="gbconfirmgroup" data-group="${key}">Confirmar resultado del grupo</button>` : ''}
    </div>`;
  }

  function renderGangbeastView(){
    const gameId = 'gangbeast';
    const st = brackets[gameId];
    let mainHTML = `<div class="bracket-round-card"><div class="bracket-round-title">Fase 1 — Duelos rápidos (mejor de 3)</div>`;
    mainHTML += st.fase1.map((m,i) => matchRowHTML(gameId,'fase1',i,m,false,'stars')).join('');
    mainHTML += `</div>`;

    const fase1Done = st.fase1.every(m => getAdvancer(m));

    if (fase1Done && !st.group1){
      const winners = st.fase1.map(getAdvancer);
      const pending = winners.filter(w => !st.promoted.includes(w));
      mainHTML += `<div class="tie-alert">Elegí los 4 ganadores que pasan directo al Grupo 1 (van ${st.promoted.length}/4):
        <div class="match-actions">${pending.map(p => `<button data-act="gbpromote" data-who="${p}">${p}</button>`).join('')}</div></div>`;
    }

    if (st.repechajeMatches){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Repechaje — definen el Grupo 2</div>`;
      mainHTML += st.repechajeMatches.map((m,i) => matchRowHTML(gameId,'repechajeMatches',i,m,false,'stars')).join('');
      mainHTML += `</div>`;
    }

    if (st.repechajeMatches && st.repechajeMatches.every(m => getAdvancer(m)) && !st.group2){
      const losers = st.repechajeMatches.map(m => (m.a === getAdvancer(m) ? m.b : m.a));
      mainHTML += `<div class="tie-alert">Elegí al <strong>mejor perdedor</strong> del repechaje (se suma al Grupo 2 — los otros 2 quedan eliminados):
        <div class="match-actions">${losers.map(p => `<button data-act="gbbestloser" data-who="${p}">${p}</button>`).join('')}</div></div>`;
    }

    if (st.group1 && st.group2){
      mainHTML += groupCardHTML('Grupo 1', 'g1', st.group1, st);
      mainHTML += groupCardHTML('Grupo 2', 'g2', st.group2, st);
    }

    if (st.groupQualifiers.g1 && st.groupQualifiers.g2 && !st.finalResults){
      const finalists = [...st.groupQualifiers.g1, ...st.groupQualifiers.g2];
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Final — todos contra todos (hasta 5 estrellas)</div>
        <p style="font-family:var(--font-sub);color:var(--dim);font-size:.85rem;margin:-.4rem 0 1rem;">Cargá las estrellas finales de los 4 finalistas.</p>
        ${finalists.map(p => starInputRow(p, 'final', st.finalStars[p])).join('')}
        ${organizerMode ? `<button class="btn" data-act="gbconfirmfinal">Confirmar resultado final</button>` : ''}
      </div>`;
    }

    if (st.stage === 'ranked'){
      const pts = computeGangbeastPoints(st);
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Resultado final</div>
        <div class="final-ranking">${Object.entries(pts).sort((a,b) => b[1]-a[1]).map(([p,v]) => `<div class="fr-chip"><b>${p}</b><span>${v} pts</span></div>`).join('')}</div>
        ${organizerMode ? `<button class="btn" data-act="applygb" ${st.applied ? 'disabled' : ''}>${st.applied ? 'Puntaje ya aplicado ✓' : 'Aplicar puntaje a la Tabla'}</button>` : ''}
      </div>`;
    }

    const starsF1 = {};
    PLAYERS.forEach(p => starsF1[p] = 0);
    st.fase1.forEach(m => { if (m.scoreA !== undefined && m.scoreA !== null){ starsF1[m.a] += m.scoreA; starsF1[m.b] += m.scoreB; } });
    (st.repechajeMatches || []).forEach(m => { if (m.scoreA !== undefined && m.scoreA !== null){ starsF1[m.a] += m.scoreA; starsF1[m.b] += m.scoreB; } });

    let sideHTML = `<div class="side-panel"><h4>Tabla de este juego (estrellas)</h4>`;
    sideHTML += [...PLAYERS].sort((a,b) => starsF1[b]-starsF1[a]).map(p => `<div class="standing-row"><span>${p}</span><b>${starsF1[p]}</b></div>`).join('');
    sideHTML += `</div>`;
    sideHTML += `<div class="side-panel"><h4>Estado</h4>
      <div class="standing-row"><span>Grupo 1</span><b style="font-family:var(--font-mono);font-size:.72rem;">${st.group1 ? st.group1.join(', ') : '—'}</b></div>
      <div class="standing-row"><span>Grupo 2</span><b style="font-family:var(--font-mono);font-size:.72rem;">${st.group2 ? st.group2.join(', ') : '—'}</b></div>
      <div class="standing-row"><span>Eliminados</span><b style="font-family:var(--font-mono);font-size:.72rem;">${st.eliminated.length ? st.eliminated.join(', ') : '—'}</b></div>
    </div>`;
    if (organizerMode){
      sideHTML += `<div class="side-panel side-actions">
        <button class="btn btn--ghost" data-act="undo" ${(!st.history || !st.history.length) ? 'disabled' : ''}>Deshacer último cambio</button>
        <button class="btn btn--ghost" data-act="reset">Reiniciar bracket</button>
      </div>`;
    }
    bracketViewEl.innerHTML = `<div class="bracket-layout"><div class="bracket-main">${mainHTML}</div><div class="bracket-side">${sideHTML}</div></div>`;
  }

  function renderBracketView(){
    if (!currentBracketGame){ bracketViewEl.innerHTML = '<p class="placeholder-note">Elegí un juego arriba para ver su bracket.</p>'; return; }
    const type = bracketType(currentBracketGame);
    ensureBracket(currentBracketGame);
    if (type === 'haxball') renderHaxballView();
    else if (type === 'gangbeast') renderGangbeastView();
    else renderRedrankView();
  }

  function renderRedrankView(){
    const gameId = currentBracketGame;
    const gameDef = REDRANK_GAMES.find(g => g.id === gameId);
    const st = brackets[gameId];

    if (!st.r1){
      bracketViewEl.innerHTML = `<div class="placeholder-note">
        Todavía no se sorteó la Ronda 1 de ${gameDef.label}.
        ${organizerMode ? `<div style="margin-top:1rem;"><button class="btn" data-act="draw1">Realizar sorteo</button></div>` : '<br>Esperá a que el organizador haga el sorteo.'}
      </div>`;
      return;
    }

    let mainHTML = '';
    if (gameId === 'fc26'){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Equipos (sorteados entre las 10 mejores medias)</div>
        <div class="final-ranking">${PLAYERS.map(p => `<div class="fr-chip"><b>${p}</b><span>${FC26_TEAMS[p]}</span></div>`).join('')}</div>
      </div>`;
    }
    mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Ronda 1 — Cruces iniciales</div>`;
    mainHTML += st.r1.map((m,i) => matchRowHTML(gameId,'r1',i,m,gameDef.hasDraw, gameId==='fc26'?'goals':'none')).join('');
    mainHTML += `</div>`;

    if (st.r1.every(m => getAdvancer(m)) && st.bestLoser === null){
      const losers = st.r1.map(m => (m.a === getAdvancer(m) ? m.b : m.a));
      mainHTML += `<div class="tie-alert">Elegí al <strong>mejor perdedor</strong> de la Ronda 1 (se suma al Grupo Ganadores):
        <div class="match-actions">${losers.map(p => `<button data-act="bestloser" data-who="${p}">${p}</button>`).join('')}</div></div>`;
    }

    if (st.r2a){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Ronda 2 — Grupo Ganadores</div>`;
      mainHTML += st.r2a.map((m,i) => matchRowHTML(gameId,'r2a',i,m,gameDef.hasDraw, gameId==='fc26'?'goals':'none')).join('');
      mainHTML += `</div>`;
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Ronda 2 — Grupo Perdedores (semis)</div>`;
      mainHTML += st.r2bSemis.map((m,i) => matchRowHTML(gameId,'r2bSemis',i,m,gameDef.hasDraw, gameId==='fc26'?'goals':'none')).join('');
      mainHTML += `</div>`;
    }
    if (st.r2bFinal){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Ronda 2 — Definición Grupo Perdedores</div>`;
      mainHTML += matchRowHTML(gameId,'r2bFinal',-1,st.r2bFinal,gameDef.hasDraw, gameId==='fc26'?'goals':'none');
      mainHTML += `</div>`;
    }
    if (st.r3semis){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Ronda 3 — Semifinales</div>`;
      mainHTML += st.r3semis.map((m,i) => matchRowHTML(gameId,'r3semis',i,m,gameDef.hasDraw, gameId==='fc26'?'goals':'none')).join('');
      mainHTML += `</div>`;
    }
    if (st.r3final){
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Final</div>`;
      mainHTML += matchRowHTML(gameId,'r3final',-1,st.r3final,gameDef.hasDraw, gameId==='fc26'?'goals':'none');
      mainHTML += `</div><div class="bracket-round-card"><div class="bracket-round-title">Tercer puesto</div>`;
      mainHTML += matchRowHTML(gameId,'r3third',-1,st.r3third,gameDef.hasDraw, gameId==='fc26'?'goals':'none');
      mainHTML += `</div>`;
    }
    if (st.stage === 'ranked'){
      const pts = computeFinalPoints(st);
      mainHTML += `<div class="bracket-round-card"><div class="bracket-round-title">Resultado final</div>
        <div class="final-ranking">${Object.entries(pts).sort((a,b) => b[1]-a[1]).map(([p,v]) => `<div class="fr-chip"><b>${p}</b><span>${v} pts</span></div>`).join('')}</div>
        ${organizerMode ? `<button class="btn" data-act="apply" ${st.applied ? 'disabled' : ''}>${st.applied ? 'Puntaje ya aplicado ✓' : 'Aplicar puntaje a la Tabla'}</button>` : ''}
      </div>`;
    }

    const partial = partialPoints(st);
    let sideHTML = `<div class="side-panel"><h4>Tabla — ${gameDef.label}</h4>
      <p style="font-family:var(--font-mono);font-size:.62rem;color:var(--dim);margin:-.4rem 0 .6rem;">3 pts victoria · 1 pt empate · 0 derrota</p>`;
    if (gameId === 'fc26'){
      const gd = goalDifference([st.r1, st.r2a, st.r2bSemis, [st.r2bFinal], st.r3semis, [st.r3final], [st.r3third]]);
      sideHTML += [...PLAYERS].sort((a,b) => partial[b] - partial[a] || gd[b] - gd[a])
        .map(p => `<div class="standing-row"><span>${p}</span><b>${partial[p]} pts <span style="color:var(--dim);font-family:var(--font-mono);font-size:.68rem;">(DG ${gd[p] > 0 ? '+' : ''}${gd[p]})</span></b></div>`).join('');
    } else {
      sideHTML += [...PLAYERS].sort((a,b) => partial[b]-partial[a]).map(p => `<div class="standing-row"><span>${p}</span><b>${partial[p]}</b></div>`).join('');
    }
    sideHTML += `</div>`;

    const nq = nonQualifiers(st);
    if (nq.length && (st.place56.p5 === null || st.place56.p6 === null)){
      const pending = nq.filter(p => p !== st.place56.p5 && p !== st.place56.p6);
      sideHTML += `<div class="side-panel"><h4>Asignar 5to y 6to puesto</h4>${pending.map(p => `
        <div style="display:flex;gap:.4rem;align-items:center;margin-bottom:.5rem;">
          <span style="flex:1;font-family:var(--font-sub);">${p}</span>
          ${st.place56.p5 === null ? `<button data-act="place5" data-who="${p}" style="font-family:var(--font-mono);font-size:.68rem;padding:.35rem .6rem;background:var(--bg);border:1px solid var(--line);color:var(--white);cursor:pointer;">5to</button>` : ''}
          ${st.place56.p6 === null ? `<button data-act="place6" data-who="${p}" style="font-family:var(--font-mono);font-size:.68rem;padding:.35rem .6rem;background:var(--bg);border:1px solid var(--line);color:var(--white);cursor:pointer;">6to</button>` : ''}
        </div>`).join('')}</div>`;
    }

    if (organizerMode){
      sideHTML += `<div class="side-panel side-actions">
        <button class="btn btn--ghost" data-act="undo" ${(!st.history || !st.history.length) ? 'disabled' : ''}>Deshacer último cambio</button>
        <button class="btn btn--ghost" data-act="reset">Reiniciar bracket</button>
      </div>`;
    }

    bracketViewEl.innerHTML = `<div class="bracket-layout"><div class="bracket-main">${mainHTML}</div><div class="bracket-side">${sideHTML}</div></div>`;
  }

  bracketViewEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const gameId = currentBracketGame;
    const { act, round, who } = btn.dataset;
    const idxAttr = btn.dataset.idx;
    const i = idxAttr === 'x' ? -1 : Number(idxAttr);

    if (act === 'draw1'){
      if (!organizerMode) return;
      playDrawAnimation(gameId, () => {
        pushHistory(gameId);
        const preset = PRESET_DRAWS[gameId];
        brackets[gameId].r1 = preset
          ? preset.map(([a,b]) => ({ a, b, winner:null, advancer:null }))
          : shufflePairs(PLAYERS);
        saveBracket(gameId); renderBracketView();
      });
    } else if (act === 'win'){
      if (!organizerMode) return;
      resolveMatch(gameId, round, i, who);
    } else if (act === 'scoreconfirm'){
      if (!organizerMode) return;
      const row = btn.closest('.match-row');
      const inputA = row.querySelector('input[data-scorefield="a"]');
      const inputB = row.querySelector('input[data-scorefield="b"]');
      const scoreA = Number(inputA.value || 0);
      const scoreB = Number(inputB.value || 0);
      const mode = btn.dataset.mode;
      if (scoreA === scoreB && mode !== 'goals'){
        alert('No puede haber empate acá — corregí el marcador antes de confirmar.'); return;
      }
      const winner = scoreA === scoreB ? 'draw' : (scoreA > scoreB ? btn.dataset.a : btn.dataset.b);
      resolveMatch(gameId, round, i, winner, scoreA, scoreB);
    } else if (act === 'vs'){
      const st = brackets[gameId];
      const m = i === -1 ? st[round] : st[round][i];
      openVsOverlay(gameId, round, idxAttr, m.a, m.b);
    } else if (act === 'tie'){
      if (!organizerMode) return;
      pushHistory(gameId);
      const st = brackets[gameId];
      const m = i === -1 ? st[round] : st[round][i];
      m.advancer = who;
      advanceStage(gameId);
      saveBracket(gameId); renderBracketView();
    } else if (act === 'bestloser'){
      if (!organizerMode) return;
      pushHistory(gameId);
      brackets[gameId].bestLoser = who;
      advanceStage(gameId);
      saveBracket(gameId); renderBracketView();
    } else if (act === 'place5'){
      if (!organizerMode) return;
      pushHistory(gameId);
      brackets[gameId].place56.p5 = who;
      saveBracket(gameId); renderBracketView();
    } else if (act === 'place6'){
      if (!organizerMode) return;
      pushHistory(gameId);
      brackets[gameId].place56.p6 = who;
      saveBracket(gameId); renderBracketView();
    } else if (act === 'apply'){
      if (!organizerMode) return;
      if (!confirm('¿Aplicar este puntaje a la Tabla general (3ra Edición)? Sobreescribe la columna de este juego para estos jugadores.')) return;
      const pts = computeFinalPoints(brackets[gameId]);
      const edScores = allScores['ed3'];
      Object.keys(pts).forEach(p => { if (edScores[p]) edScores[p][gameId] = pts[p]; });
      persistEdition('ed3');
      if (currentEditionId === 'ed3') renderBody();
      brackets[gameId].applied = true;
      saveBracket(gameId); renderBracketView();
    } else if (act === 'applyhax'){
      if (!organizerMode) return;
      if (!confirm('¿Aplicar este puntaje a la Tabla general (3ra Edición)? Se le suma a cada jugador el puntaje de su equipo.')) return;
      const { pts } = haxballPointsByPlayer(brackets[gameId]);
      const edScores = allScores['ed3'];
      Object.keys(pts).forEach(p => { if (edScores[p]) edScores[p].haxball = pts[p]; });
      persistEdition('ed3');
      if (currentEditionId === 'ed3') renderBody();
      brackets[gameId].applied = true;
      saveBracket(gameId); renderBracketView();
    } else if (act === 'gbpromote'){
      if (!organizerMode) return;
      pushHistory(gameId);
      const st = brackets[gameId];
      if (!st.promoted.includes(who)) st.promoted.push(who);
      if (st.promoted.length === 4){
        const winners = st.fase1.map(getAdvancer);
        const losers = st.fase1.map(m => (m.a === getAdvancer(m) ? m.b : m.a));
        const extraWinner = winners.find(w => !st.promoted.includes(w));
        st.group1 = [...st.promoted];
        st.repechajePool = [extraWinner, ...losers];
        st.repechajeMatches = shufflePairs(st.repechajePool);
      }
      saveBracket(gameId); renderBracketView();
    } else if (act === 'gbbestloser'){
      if (!organizerMode) return;
      pushHistory(gameId);
      const st = brackets[gameId];
      const winners = st.repechajeMatches.map(getAdvancer);
      const losers = st.repechajePool.filter(p => !winners.includes(p));
      st.bestLoser2 = who;
      st.group2 = [...winners, who];
      st.eliminated = losers.filter(p => p !== who);
      saveBracket(gameId); renderBracketView();
    } else if (act === 'gbconfirmgroup'){
      if (!organizerMode) return;
      const st = brackets[gameId];
      const key = btn.dataset.group;
      const players = key === 'g1' ? st.group1 : st.group2;
      const stars = st.groupStars[key] || {};
      if (players.some(p => stars[p] === undefined || stars[p] === '')){
        alert('Cargá las estrellas de los 4 jugadores antes de confirmar.'); return;
      }
      const sorted = [...players].sort((a,b) => (Number(stars[b]) || 0) - (Number(stars[a]) || 0));
      if (Number(stars[sorted[1]]) === Number(stars[sorted[2]])){
        alert('Hay empate por el 2do lugar del grupo — resolvelo con un 1v1 al mejor de 3 y ajustá las estrellas antes de confirmar.'); return;
      }
      pushHistory(gameId);
      st.groupQualifiers[key] = [sorted[0], sorted[1]];
      saveBracket(gameId); renderBracketView();
    } else if (act === 'gbconfirmfinal'){
      if (!organizerMode) return;
      const st = brackets[gameId];
      const finalists = [...st.groupQualifiers.g1, ...st.groupQualifiers.g2];
      const stars = st.finalStars || {};
      if (finalists.some(p => stars[p] === undefined || stars[p] === '')){
        alert('Cargá las estrellas de los 4 finalistas antes de confirmar.'); return;
      }
      const sorted = [...finalists].sort((a,b) => (Number(stars[b]) || 0) - (Number(stars[a]) || 0));
      if (Number(stars[sorted[1]]) === Number(stars[sorted[2]]) || Number(stars[sorted[2]]) === Number(stars[sorted[3]])){
        alert('Hay un empate en la final — resolvelo con un 1v1 al mejor de 3 entre los empatados y ajustá las estrellas antes de confirmar.'); return;
      }
      pushHistory(gameId);
      st.finalResults = { champion:sorted[0], second:sorted[1], third:sorted[2], fourth:sorted[3] };
      st.stage = 'ranked';
      saveBracket(gameId); renderBracketView();
    } else if (act === 'applygb'){
      if (!organizerMode) return;
      if (!confirm('¿Aplicar este puntaje a la Tabla general (3ra Edición)? Sobreescribe la columna de Gang Beast para estos jugadores.')) return;
      const pts = computeGangbeastPoints(brackets[gameId]);
      const edScores = allScores['ed3'];
      Object.keys(pts).forEach(p => { if (edScores[p]) edScores[p].gangbeast = pts[p]; });
      persistEdition('ed3');
      if (currentEditionId === 'ed3') renderBody();
      brackets[gameId].applied = true;
      saveBracket(gameId); renderBracketView();
    } else if (act === 'undo'){
      if (!organizerMode) return;
      undoBracket(gameId);
    } else if (act === 'reset'){
      if (!organizerMode) return;
      if (!confirm('¿Reiniciar todo el bracket de este juego? Se pierde el progreso actual.')) return;
      pushHistory(gameId);
      const hist = brackets[gameId].history;
      brackets[gameId] = emptyBracketState(bracketType(gameId), gameId);
      brackets[gameId].history = hist;
      saveBracket(gameId); renderBracketView();
    }
  });

  // Inputs de estrellas (Gang Beast): guardamos sin re-renderizar para no perder el foco al tipear.
  let bracketSaveTimers = {};
  function scheduleBracketSave(gameId){
    if (firebaseReady){
      clearTimeout(bracketSaveTimers[gameId]);
      bracketSaveTimers[gameId] = setTimeout(() => saveBracket(gameId), 400);
    } else {
      saveBracket(gameId);
    }
  }
  bracketViewEl.addEventListener('input', (e) => {
    const inp = e.target.closest('input[data-gbstar]');
    if (!inp || !organizerMode || !currentBracketGame) return;
    const clean = inp.value.replace(/[^0-9]/g, '');
    if (clean !== inp.value) inp.value = clean;
    const st = brackets[currentBracketGame];
    const key = inp.dataset.gbstar;
    if (key === 'final'){
      st.finalStars = st.finalStars || {};
      st.finalStars[inp.dataset.player] = clean;
    } else {
      st.groupStars[key] = st.groupStars[key] || {};
      st.groupStars[key][inp.dataset.player] = clean;
    }
    scheduleBracketSave(currentBracketGame);
  });
  bracketViewEl.addEventListener('blur', (e) => {
    if (e.target && e.target.matches && e.target.matches('input[data-gbstar]')) renderBracketView();
  }, true);

  function renderBracketPicker(){
    const el = document.getElementById('bracketPicker');
    el.innerHTML = BRACKET_GAMES.map(g => `<button class="bracket-pick-btn ${currentBracketGame === g.id ? 'active' : ''}" data-pick="${g.id}">${g.label}</button>`).join('');
  }
  document.getElementById('bracketPicker').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-pick]');
    if (!btn) return;
    currentBracketGame = btn.dataset.pick;
    ensureBracket(currentBracketGame);
    renderBracketPicker();
    renderBracketView();
  });

  renderBracketPicker();
  renderBracketView();
