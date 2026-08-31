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

  // Lista de personajes de referencia — MUESTRA PARCIAL, completar con el roster completo de Sparking Zero.
  const PD_CHARACTERS = [
    ['Mr. Satan',1],['Yamcha',1],['Chiaotzu',1],['Yajirobe',1],
    ['Krillin',2],['Ten Shin Han',2],['Videl',2],['Great Saiyaman',2],
    ['Android 16',3],['Android 17',3],['Android 18',3],['Gohan (Niño)',3],
    ['Piccolo',4],['Gohan (Adulto)',4],
    ['Gohan (Adolescente)',5],['Vegeta (Base)',5],['Goku (Base)',5],['Freezer (Forma Final)',5],['Majin Buu (Gordo)',5],
    ['Vegeta (Super Saiyan)',6],['Goku (Kaioken)',6],['Goku (SSJ)',6],['Cell (Perfecto)',6],
    ['Vegeta (SSJ2)',7],['Goku (SSJ2)',7],['Cell (Super Perfecto)',7],['Majin Buu (Kid)',7],
    ['Vegeta (SSJ Blue)',8],['Goku (SSJ3)',8],['Goku (SSJ Blue)',8],['Freezer (Golden)',8],['Beerus',8],
    ['Vegeta (SSJ Blue Evolution)',9],['Gohan Bestia',9],['Broly (DBS)',9],['Gogeta (SSJ4)',9],['Jiren',9],
    ['Goku (Ultra Instinto)',10],['Broly (Full Power)',10],['Gogeta Blue',10],['Vegetto Blue',10]
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
