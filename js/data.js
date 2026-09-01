// =========================================================
  // DATOS BASE — editables
  // =========================================================
  const PLAYERS = ['Rojo','Milanesa','Croc','Mena','Kacha','Fexx','Santy','Sosa','Chata','Gonzi'];

  const HAXBALL_TEAMS = [
    { name:'Unión Glande',          players:['Chata','Croc'],     logo:'assets/logos/union-glande.png' },
    { name:'Lomas Turbas',          players:['Rojo','Sosa'],      logo:'assets/logos/lomas-turbas.png' },
    { name:'Sementales FC',         players:['Kacha','Mena'],     logo:'assets/logos/sementales-fc.png' },
    { name:'Deportivo Vergatieso',  players:['Gonzi','Milanesa'], logo:'assets/logos/deportivo-vergatieso.png' },
    { name:'Pajertan Vergrado',     players:['Fexx','Santy'],     logo:'assets/logos/pajertan-vergrado.png' }
  ];

  // Lista real de personajes de Sparking Zero con su PD (190 personajes).
  const PD_CHARACTERS = [
    ['Mr Satan',1],
    ['Chaozu',2],
    ['Saibaman',2],
    ['Soldado del Ejército de Freezer',2],
    ['Guldo',2],
    ['Videl',2],
    ['Spopovich',2],
    ['Maestro Roshi',2],
    ['Yajirobe',2],
    ['Panzy',2],
    ['Raditz',3],
    ['Gohan(Niño)',3],
    ['Yamcha',3],
    ['Krilin',3],
    ['Nappa',3],
    ['Dodoria',3],
    ['Zarbon',3],
    ['Super Zarbon',3],
    ['Cui',3],
    ['Recoome',3],
    ['Burter',3],
    ['Jeice',3],
    ['Cell Jr',3],
    ['Babidi',3],
    ['Pan(GT)',3],
    ['Goku(Adolescente)',3],
    ['Goku (Z)',4],
    ['Piccolo',4],
    ['Ten Shin Han',4],
    ['Vegeta (Z)',4],
    ['Ginyu',4],
    ['Nail',4],
    ['Gohan(Adolescente)',4],
    ['Trunks(Espada)',4],
    ['King Cold',4],
    ['Androide 19',4],
    ['Dr Gero',4],
    ['Gohan(Adulto)',4],
    ['Gran Saiyaman',4],
    ['Goten',4],
    ['Trunks(niño)',4],
    ['Super Garlic Jr',4],
    ['Dr Wheelo',4],
    ['Turles',4],
    ['Lord Slug',4],
    ['Tapion',4],
    ['Bardock',4],
    ['Gohan(Super Hero)',4],
    ['Uub(GT)',4],
    ['Goku(Mini)',4],
    ['Vegeta(Mini)',4],
    ['Glorio',4],
    ['Vegeta Ozaru',5],
    ['Goku(Z-Medio)',5],
    ['Freezer(Z)',5],
    ['Vegetta(Z-Temprano)',5],
    ['Androide 17 (Z)',5],
    ['Androide 18 (Z)',5],
    ['Androide 16',5],
    ['Piccolo (Kami)',5],
    ['Trunks',5],
    ['Cell',5],
    ['Goku(Z-Final)',5],
    ['Vegeta(Z-Final)',5],
    ['Goten Super Saiyajin',5],
    ['Trunks Super Saiyajin(Niño)',5],
    ['Gohan(Futuro)',5],
    ['Goku(Super)',5],
    ['Vegeta(Super)',5],
    ['Cabba',5],
    ['Trunks(Super)',5],
    ['Black Goku',5],
    ['Zamasu',5],
    ['Bergamo',5],
    ['Caulifla',5],
    ['Kale',5],
    ['Ribrianne',5],
    ['Kakunsa',5],
    ['Roasie',5],
    ['Androide 13',5],
    ['Broly(Z)',5],
    ['Bojack',5],
    ['Janemba',5],
    ['Broly(Super)',5],
    ['Piccolo (Super Hero)',5],
    ['Goku(GT)',5],
    ['Baby Vegeta (GT)',5],
    ['Goku Super Saiyajin(Mini)',5],
    ['Vegeta Super Saiyajin(Mini)',5],
    ['Majin Kuu',5],
    ['Shallot',5],
    ['Super Vegeta',6],
    ['Trunks Super Saiyajin (Espada)',6],
    ['Mecha Freezer',6],
    ['Trunks Super Saiyajin',6],
    ['Super Trunks',6],
    ['Cell Forma Perfecta',6],
    ['Goku Super Saiyajin (Z-Final)',6],
    ['Goku Super Saiyajin 2 (Z-Final)',6],
    ['Gohan Super Saiyajin (Adulto)',6],
    ['Vegeta Super Saiyajin (Z-final)',6],
    ['Vegeta Super Saiyajin 2 (Z-final)',6],
    ['Freezer (Super)',6],
    ['Frost',6],
    ['Cabba Super Saiyajin',6],
    ['Trunks Super Saiyajin (Futuro)',6],
    ['Androide 17 (Super)',6],
    ['Kale Super Saiyajin',6],
    ['Dyspo',6],
    ['Kefla',6],
    ['Lord Slug',6],
    ['Cooler',6],
    ['Hildegard',6],
    ['Gohan Super Saiyajin (Super Hero)',6],
    ['Piccolo Despertado (Super Hero)',6],
    ['Goku Super Saiyajin (GT)',6],
    ['Majuub (GT)',6],
    ['Super Baby 1 (GT)',6],
    ['Vegeta Super Saiyajin 2 (Mini)',6],
    ['Gotenks',6],
    ['Freezer Full Power (Z)',7],
    ['Gohan Super Saiyajin 2 (adolescente)',7],
    ['Cell Perfecto',7],
    ['Goku Super Saiyajin 3(Z Final)',7],
    ['Gohan Super Saiyajin 2 (Z final)',7],
    ['Gohan Definitivo',7],
    ['Vegetto',7],
    ['Gotenks Super Saiyajin',7],
    ['Majin Vegeta',7],
    ['Super Buu',7],
    ['Kid Buu',7],
    ['Goku Dios',7],
    ['Vegeta Dios',7],
    ['Cabba Super Saiyajin 2',7],
    ['Toppo',7],
    ['Caulifla Super Saiyajin 2',7],
    ['Kale Super Saiyajin Legendario',7],
    ['Kefla Super Saiyajin',7],
    ['Cooler Segunda Forma',7],
    ['Metal Cooler',7],
    ['Androide 13 Fusionado',7],
    ['Broly Super Saiyajin(Z)',7],
    ['Full Power Bojack',7],
    ['Super Janemba',7],
    ['Broly Super Saiyajin (Super)',7],
    ['Gogeta',7],
    ['gamma2',7],
    ['Gamma1',7],
    ['Goku Super Saiyajin 3(GT)',7],
    ['Super Baby 2',7],
    ['Baby Ozaru',7],
    ['Syn Shenron',7],
    ['Vegeta Super Saiyajin 3 (Mini)',7],
    ['Goku Fase 4 (Mini)',7],
    ['Vegeta Super Saiyajin 3 (Daima)',7],
    ['Majin Duu forma 2',7],
    ['Gomah',7],
    ['Super Vegetto',8],
    ['Gotenks Super Saiyajin 3',8],
    ['Goku Blue',8],
    ['vegeta blue',8],
    ['Golden Freezer',8],
    ['Hit',8],
    ['Goku Black Super Saiyajin Rose',8],
    ['Zamasu Fusionado',8],
    ['Toppo Dios de la destrucción',8],
    ['Jiren',8],
    ['Goku Señal de Ultra Instinto',8],
    ['Kefla Super Saiyajin 2',8],
    ['Anilaza',8],
    ['Super Gogeta',8],
    ['Ultimate Gohan (Super Hero)',8],
    ['Orange Piccolo',8],
    ['Goku Super Saiyajin 4 (GT)',8],
    ['Vegeta Super Saiyajin 4 (GT)',8],
    ['Omega Shenron',8],
    ['Goku Super Saiyajin 4 (Daima)',8],
    ['Gomah Gigante',8],
    ['Zamasu Fusionado Corrupto',9],
    ['Jiren Full Power',9],
    ['Goku Ultra Instinto Dominado',9],
    ['Broly Super Saiyajin Legendario(Z)',9],
    ['Broly Super Saiyajin Legendario (Super)',9],
    ['Gohan Bestia',9],
    ['Cell Max',9],
    ['Vegetto Blue',10],
    ['Bills',10],
    ['Whis',10],
    ['Gogeta Blue',10],
    ['Gogeta Super Saiyajin 4',10]
  ];

  // Palabras para el efecto glitch en la sección "Elegí tu camino"
  const GLITCH_WORDS = [
    'Basados','Basado','GOAT','Cabra','Campeón','Remontada','Golazo','GOOOOOOOOOL',
    'DERROTA','PASIÓN','EQUIPO','REPECHAJE','GANADOR','GOKU','AURA',
    ...HAXBALL_TEAMS.map(t => t.name),
    ...PLAYERS
  ];

  // =========================================================
  // REGLAS DE LOS JUEGOS
  // =========================================================
  const GAMES = [
    {
      id:'db', name:'Dragon Ball Sparking Zero', tag:'Equipos de personajes · Sistema RedRank', accent:'var(--red)',
      detailsHTML: `
        <div class="rule-block">
          <h4>Equipos</h4>
          <p>Cada jugador arma un equipo de hasta 5 personajes con un límite fijo de <strong>15 puntos de PD</strong> en total.
          Se puede ir desde un equipo grande de personajes débiles (varios PD bajos) hasta pocos personajes muy fuertes
          (ej. un Gogeta Blue de PD 10 + un Mr. Satan de PD 1 + otro de PD 4). Armá tu equipo con antelación.</p>
          <button class="accordion-toggle" id="pdToggle">Ver personajes y su PD <span>+</span></button>
          <div class="accordion-body" id="pdBody">
            <table class="pd-table">
              <thead><tr><th>Personaje</th><th>PD</th></tr></thead>
              <tbody id="pdTableBody"></tbody>
            </table>
          </div>
        </div>

        <div class="rule-block">
          <h4>Ronda 1 — Cruces iniciales</h4>
          <p>Se sortean 5 cruces 1 contra 1. En Sparking Zero no hay empates, así que siempre hay ganador y perdedor.
          Ganar suma 3 puntos de ronda, perder suma 0.</p>
        </div>

        <div class="rule-block">
          <h4>Ronda 2 — Filtrado por nivel</h4>
          <p><strong>Grupo Ganadores:</strong> los 5 ganadores de la Ronda 1 + el mejor perdedor de la Ronda 1 (6 jugadores) juegan entre sí. Cada victoria vuelve a sumar 3 puntos.</p>
          <p><strong>Grupo Perdedores:</strong> los 4 perdedores restantes juegan todos contra todos. El de mejor puntaje pasa a la Ronda 3. Si hay empate en la cima, los empatados desempatan luchando entre sí.</p>
        </div>

        <div class="rule-block">
          <h4>Ronda 3 — Torneo de 4</h4>
          <p>Con los 4 mejores clasificados de la Ronda 2 se arma la llave: 1° vs 3°, 2° vs 4°. Semifinales → Final y tercer puesto.</p>
        </div>

        <div class="rule-block">
          <h4>Puntaje que suma a la tabla general</h4>
          <p>Los puntos de Rondas 1 y 2 solo sirven para clasificar. Lo que suma a la tabla general es la posición final:</p>
          <div class="points-grid">
            <div class="points-chip"><b>5</b><span>Campeón</span></div>
            <div class="points-chip"><b>4</b><span>Subcampeón</span></div>
            <div class="points-chip"><b>3</b><span>3er puesto</span></div>
            <div class="points-chip"><b>2</b><span>4to puesto</span></div>
            <div class="points-chip"><b>1</b><span>5to puesto</span></div>
            <div class="points-chip"><b>1</b><span>6to puesto</span></div>
          </div>
          <p style="margin-top:.6rem;">5to y 6to puesto quedan definidos por el rendimiento en Ronda 2, sin chance de desempate.</p>
        </div>`
    },
    {
      id:'fc26', name:'FC26', tag:'1v1 · Sistema RedRank con empates', accent:'var(--cyan)',
      detailsHTML: `
        <div class="rule-block">
          <h4>Formato general</h4>
          <p>Torneo 1 contra 1 de 3 rondas. A diferencia de un juego de lucha, en el fútbol hay empates: victoria 3 puntos
          de ronda, empate 1 punto, derrota 0 puntos. Cuando dos jugadores quedan igualados en puntos, se desempata
          por diferencia de goles.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 1 — Cruces iniciales</h4>
          <p>Se sortean 5 cruces 1 contra 1. Según el resultado (puntos y diferencia de goles) quedan ordenados
          los 5 mejores y los 5 peores de esta primera ronda.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 2 — Filtrado por nivel</h4>
          <p><strong>Grupo Ganadores:</strong> los 5 mejores de la Ronda 1 + el mejor de los peores juegan entre sí, sumando puntos de la misma forma (victoria 3, empate 1, derrota 0).</p>
          <p><strong>Grupo Perdedores:</strong> los 4 restantes juegan todos contra todos. El de mejor puntaje pasa a la Ronda 3, con la diferencia de goles como criterio de desempate y, si persiste, un cruce directo entre los empatados.</p>
          <p>Los primeros 4 puestos resultantes de esta ronda clasifican a la Ronda 3.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 3 — Semifinales, final y tercer puesto</h4>
          <p>Con los 4 clasificados se arman las semifinales (1° vs 4°, 2° vs 3°), luego la final entre los ganadores
          y el partido por el tercer puesto entre los perdedores de semis.</p>
        </div>
        <div class="rule-block">
          <h4>Puntaje que suma a la tabla general</h4>
          <div class="points-grid">
            <div class="points-chip"><b>5</b><span>Campeón</span></div>
            <div class="points-chip"><b>4</b><span>Subcampeón</span></div>
            <div class="points-chip"><b>3</b><span>3er puesto</span></div>
            <div class="points-chip"><b>2</b><span>4to puesto</span></div>
            <div class="points-chip"><b>1</b><span>5to puesto</span></div>
            <div class="points-chip"><b>1</b><span>6to puesto</span></div>
          </div>
        </div>`
    },
    {
      id:'gangbeast', name:'Gang Beast', tag:'Duelos + grupos de 4 · Estrellas', accent:'var(--yellow)',
      detailsHTML: `
        <div class="rule-block">
          <h4>Fase 1 — Duelos rápidos (mejor de 3)</h4>
          <p>5 duelos 1 contra 1 al mejor de 3. Solo los 2 peores del total quedan eliminados, y lo que decide quién es "peor"
          no es solo ganar o perder: importan las <strong>estrellas</strong> acumuladas en cada duelo. Perder 3-1 (te llevás una estrella)
          es mucho mejor que perder 2-0.</p>
        </div>
        <div class="rule-block">
          <h4>Fase 1 — Definición</h4>
          <p>Los 4 mejores por victorias/estrellas forman directamente el <strong>Grupo 1</strong>.</p>
          <p>Los 6 restantes juegan un repechaje para decidir su futuro: 6° vs 8°, 7° vs 10°, 9° vs 5°.
          Los 4 mejores de estos 6 pasan a formar el <strong>Grupo 2</strong>. Los otros 2 quedan eliminados del torneo.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 2 — Grupos de 4</h4>
          <p>Cada grupo juega todos contra todos hasta que alguien llegue a <strong>5 estrellas</strong>. Ese jugador pasa a la final.
          El segundo lugar (el que más estrellas acumuló después del ganador) también pasa a la final. Así, cada grupo aporta 2 finalistas.</p>
        </div>
        <div class="rule-block">
          <h4>Final</h4>
          <p>Los 4 finalistas juegan todos contra todos hasta que alguien llegue a 5 estrellas: ese es el campeón.
          El resto de las posiciones se define por estrellas acumuladas. Si hay empate por el 2° o 3er puesto, se desempata con un 1v1 al mejor de 3.</p>
        </div>
        <div class="rule-block">
          <h4>Puntaje que suma a la tabla general</h4>
          <div class="points-grid">
            <div class="points-chip"><b>5</b><span>Campeón</span></div>
            <div class="points-chip"><b>4</b><span>2do puesto</span></div>
            <div class="points-chip"><b>3</b><span>3er puesto</span></div>
            <div class="points-chip"><b>2</b><span>4to puesto</span></div>
            <div class="points-chip"><b>1</b><span>Clasificó a Ronda 2</span></div>
          </div>
          <p style="margin-top:.6rem;">Todos los que llegan a la Ronda 2 (es decir, todos salvo los 2 eliminados en la Fase 1) aseguran al menos 1 punto.</p>
        </div>`
    },
    {
      id:'brawlhalla', name:'Brawlhalla', tag:'1v1 · 3 personajes = 3 vidas', accent:'var(--red)',
      detailsHTML: `
        <div class="rule-block">
          <h4>Formato de personajes</h4>
          <p>Se puede traer PC/cuenta propia con los personajes favoritos. Cada jugador elige 3 personajes:
          cada uno vale como 1 vida, así que se compite con un total de 3 vidas por combate.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 1 — Cruces iniciales</h4>
          <p>Se sortean 5 cruces 1 contra 1. Victoria: 3 puntos de ronda. Empate: 1 punto. Derrota: 0 puntos.
          Según el resultado quedan ordenados los 5 mejores y los 5 peores de esta ronda.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 2 — Filtrado por nivel</h4>
          <p><strong>Grupo Ganadores:</strong> los 5 mejores de la Ronda 1 + el mejor de los peores juegan entre sí, sumando puntos de la misma forma.</p>
          <p><strong>Grupo Perdedores:</strong> los 4 restantes juegan todos contra todos. El de mejor puntaje pasa a la Ronda 3. En caso de empate, los empatados desempatan enfrentándose entre sí.</p>
        </div>
        <div class="rule-block">
          <h4>Ronda 3 — Torneo de 4</h4>
          <p>Con los 4 mejores clasificados se arma la llave: 1° vs 3°, 2° vs 4°. Semifinales → Final y tercer puesto.</p>
        </div>
        <div class="rule-block">
          <h4>Puntaje que suma a la tabla general</h4>
          <div class="points-grid">
            <div class="points-chip"><b>5</b><span>Campeón</span></div>
            <div class="points-chip"><b>4</b><span>Subcampeón</span></div>
            <div class="points-chip"><b>3</b><span>3er puesto</span></div>
            <div class="points-chip"><b>2</b><span>4to puesto</span></div>
            <div class="points-chip"><b>1</b><span>5to puesto</span></div>
            <div class="points-chip"><b>1</b><span>6to puesto</span></div>
          </div>
        </div>`
    },
    {
      id:'haxball', name:'HaxBall', tag:'El único juego por equipos', accent:'var(--cyan)',
      detailsHTML: `
        <div class="rule-block">
          <h4>Conocé a los basados</h4>
          <p>5 equipos de 2 jugadores. Agregá el logo del club en PNG sin fondo reemplazando la imagen de cada tarjeta.</p>
          <div class="teams-grid" id="teamsGrid"></div>
        </div>
        <div class="rule-block">
          <h4>Fixture — nivel extra por mérito</h4>
          <p>Antes se iba directo a cuartos. Ahora, al ser 5 equipos, los 3 mejores de la edición anterior pasan directo de fase.
          El equipo de más bajo rendimiento de la edición anterior debe jugar un repechaje contra el equipo nuevo para
          quedarse con el último lugar disponible.</p>
          <div class="bracket">
            <div class="bracket-col">
              <div class="bracket-slot bracket-slot--bye"><span class="bracket-tag">Clasificado directo</span><span class="bracket-name">Clasificado 1</span></div>
              <div class="bracket-slot bracket-slot--bye"><span class="bracket-tag">Clasificado directo</span><span class="bracket-name">Clasificado 2</span></div>
              <div class="bracket-slot bracket-slot--bye"><span class="bracket-tag">Clasificado directo</span><span class="bracket-name">Clasificado 3</span></div>
            </div>
            <div class="bracket-vs-wrap">
              <div class="bracket-slot"><span class="bracket-tag">Repechaje</span><span class="bracket-name">Pajertan Vergrado</span></div>
              <span class="bracket-vs">VS</span>
              <div class="bracket-slot"><span class="bracket-tag">Repechaje</span><span class="bracket-name">Sementales FC</span></div>
            </div>
          </div>
        </div>
        <div class="rule-block">
          <h4>Formato de partidos</h4>
          <p>Todos los enfrentamientos (el repechaje y la fase de 4 equipos) se juegan a <strong>ida y vuelta</strong>,
          es decir, cada equipo hace de local y de visitante una vez. El resultado se define por el marcador global
          de ambos partidos.</p>
        </div>
        <div class="rule-block">
          <h4>Puntaje que suma a la tabla general</h4>
          <div class="points-grid">
            <div class="points-chip"><b>5</b><span>Campeón</span></div>
            <div class="points-chip"><b>4</b><span>2do puesto</span></div>
            <div class="points-chip"><b>3</b><span>3er puesto</span></div>
            <div class="points-chip"><b>2</b><span>4to puesto</span></div>
            <div class="points-chip"><b>1</b><span>5to puesto (por participar)</span></div>
          </div>
          <p style="margin-top:.6rem;">El equipo que pierde el repechaje queda directo en el 5to puesto. Los puntos se reparten entre los jugadores del equipo por igual.</p>
        </div>`
    }
  ];
