/**
 * =============================================================================
 * PROGRAMACIÓN WEB - PRÁCTICA 1
 * Seguimiento de series de TV con JavaScript (datos de TVmaze)
 * =============================================================================
 *
 * Este archivo debe implementar las 9 etapas de la práctica utilizando:
 *   - Clases con campos privados, getters y setters
 *   - Métodos de clase y funciones flecha
 *   - Recursividad, reduce, map, filter
 *   - Destructuring y spread operator
 *   - Manejo de fechas con el objeto Date
 *
 * Convenciones a seguir:
 *   - Se usa `const` para valores que no cambian y `let` para los que sí.
 *   - Las funciones anónimas se escriben como arrow functions.
 *   - Los nombres siguen camelCase (variables/funciones) y PascalCase (clases).
 *   - Todos los identificadores se escriben en inglés.
 *   - Las comparaciones son siempre estrictas (=== / !==).
 *   - Se usan métodos de Array en lugar de bucles for/while
 *     (excepto en la función recursiva de la etapa 5.1).
 *   - Los datos no válidos se gestionan siempre igual: aviso con console.warn,
 *     sin modificar ningún dato, y devolviendo false / null / [].
 *   - Los comentarios siguen las 9 reglas de Ellen Spertus:
 *     explicar el "por qué", no el "qué" evidente en el código.
 *
 * Las firmas de este archivo (nombres y parámetros) son las que pide el
 * enunciado: no las cambiéis. Podéis añadir las funciones auxiliares que
 * necesitéis.
 * =============================================================================
 */

/* =============================================================================
   ETAPA 1 — Clase Show (3 puntos)
   Representa una serie con sus datos de catálogo (los que vendrán de la API).
   ============================================================================= */

class Show {

  // Propiedad privada para rating: la inicializamos como null para asegurar que en el setter si no es un valor válido 
  // se mantenga como null. Accedemos a ella mediante el getter/setter
  #rating = null;

  constructor({
    id,
    name,
    summary,
    premiered,
    status,
    rating,
    type,
    genres,
    network,
    webChannel,
    imageUrl,
    weight,
    episodes,
  }) {
     // Se comprueba que el identificador sea un entero positivo.
    if (!Number.isInteger(id) || id <= 0) {
      console.warn(`Show: id --> "${id}", debe ser un número entero positivo.`);
    }
    this.id = id;

    // Se comprueba que el nombre sea un texto no vacío.
    if (typeof name !== 'string' || name.trim() === '') {
      console.warn(`Show: name --> "${name}", debe ser un texto no vacío.`);
    }
    this.name = name;
    
    this.summary = summary;
    this.premiered = premiered;
    this.status = status;
    this.rating = rating; // El setter validará que el valor es válido. Iniciado como NULL
    this.type = type;

    // Si genres no es un array, se inicializa vacío.
    if (Array.isArray(genres)) {
      this.genres = genres;
    } else {
      console.warn(`Show: genres --> "${genres}", debe ser un array.`);
      this.genres = [];
    }

    this.network = network;
    this.webChannel = webChannel;
    this.imageUrl = imageUrl;
    this.weight = weight;

    // Si episodes no es un array, se inicializa vacío.
    if (Array.isArray(episodes)) {
      this.episodes = episodes;
    } else {
      console.warn(`Show: episodes --> "${episodes}",  debe ser un array.`);
      this.episodes = [];  
    }
  }

  // ── Getters y setters ────────────────────────────────────────────────────


/** 
 * Getter para el valor de rating
 * @returns {number|null} Devuelve la puntuación media de la serie. 
 */
  get rating() {
    return this.#rating;
  }

  /**
   * Setter para el valor de rating
   * Se hace la comprobación de un valor válido (número entre 0 y 10, o NULL).
   * Si el valor no es válido, avisa y mantiene el valor anterior.
   * @param {number|null} value
   */
  set rating(value) {
    if (
        value === null ||
        (typeof value === 'number' &&
         Number.isFinite(value) &&
         value >= 0 &&
         value <= 10)
    ) {
        this.#rating = value;
    } else {
        console.warn(`Show: rating --> "${value}", no válido (debe ser null o un número entre 0 y 10).`);
    }
  }
 
  /** 
   * Getter para el valor de platform (cadena o plataforma de emisión).
   * @returns {string|null} Devuelve el nombre de cadena o, si no hay, de plataforma;
   *    Si no tiene ninguna de las dos, devuelve NULL.
   *    
   *    Uso de la estructura:
   *      En lugar de evaluar con condiciones "if" anidadas, hago uso de dos operadores vistos en la documentación 
   *      en internet para que no falle la evaluación en caso de que no exista la variable, quedando un codigo limpio y
   *      combinando encadenamiento opcional y fusión nula. 
   *      - Con el operador ??, consigo que se asegure el retorno de null en caso de que alguna de las propiedades
   *        no esté definida, que carezcan del campo name o valga null.
   *      - Con el operador ?, evaluo si la propiedad name de la cadena o plataforma es null 
   *        evitando un error en la evaluación.
   */
  get platform() {
    return this.network?.name ?? this.webChannel?.name ?? null;
  }
}


/* =============================================================================
   ETAPA 2 — Clase Progress (2 puntos)
   Progreso de visionado de un usuario en una serie concreta.
   ============================================================================= */

class Progress {
  constructor(showId) {
    this.showId = showId;
    this.currentSeason = 0;
    this.currentEpisode = 0;
  }

  // ── Getters y setters ────────────────────────────────────────────────────

  /** Getter que indica si se ha comenzado a ver la serie.
  *  @returns {true|false} Devuelve True si se ha comenzado a ver la serie. 
  */
  get hasStarted() {
    return this.currentSeason > 0 && this.currentEpisode > 0;
  }


  // ── Métodos ───────────────────────────────────────────────────────────────

  /**
   * Marca como último visto el episodio indicado.
   * Devuelve true si se ha actualizado el progreso.
   */
  advance(season, number) {
    // Ambos valores deben ser enteros positivos.
    if (season <= 0 || number <= 0 ||
    !Number.isInteger(season) || !Number.isInteger(number)) {
    console.warn('La temporada y el episodio deben ser números enteros positivos.');
    return false;
    }

    this.currentSeason = season;
    this.currentEpisode = number;

    return true;
  }

  /**
   * Vuelve el progreso a 0 / 0 (sin empezar).
   */
  reset() {
    this.currentSeason = 0;
    this.currentEpisode = 0;
  }

}


/* =============================================================================
   ETAPA 3 — Clase ShowList (3 puntos)
   Lista de series que sigue el usuario: array de pares { show, progress }.
   ============================================================================= */

class ShowList {

  // Array privado que almacena las series junto con su progreso.
  #showEntries = [];

  /**
   * Constructor de la clase ShowList.
   * Inicializa una lista vacía de series.
   */
  constructor() {
    this.#showEntries = [];
  }

    // ── Getters y setters ────────────────────────────────────────────────────

  /**
   * Getter que devuelve una copia del array de series y sus progresos.
   * @returns {Array} Devuelve un array de pares { show, progress }.
   */
  get entries() {
    return this.#showEntries.map(showEntry => ({
      show: showEntry.show,
      progress: showEntry.progress
    }));
  }

  
  /**
   * Getter que devuelve un array nuevo con los objetos Show.
   * @returns {Array<Show>} Devuelve un array con las series de la lista.
   */
  get shows() {
    return this.#showEntries.map(showEntry => showEntry.show);
  }



  // ── Métodos ───────────────────────────────────────────────────────────────

  /**
   * Añade una serie a la lista y crea su progreso inicial.
   * No permite añadir objetos que no sean de la clase Show ni series duplicadas.
   * @param {Show} show Objeto de la serie que se quiere añadir.
   * @returns {boolean} Devuelve true si se ha añadido correctamente.
   */
  addShow(show) {

    // Comprueba que el objeto recibido pertenece a la clase Show.
    if (!(show instanceof Show)) {
      console.warn('ShowList: solo se pueden añadir objetos de la clase Show.');
      return false;
    }

    // Comprueba si la serie ya está incluida en la lista.
    const showAlreadyExists = this.#showEntries.some(
      showEntry => showEntry.show.id === show.id
    );

    if (showAlreadyExists) {
      console.warn('ShowList: la serie ya está en la lista.');
      return false;
    }

    // Crea el progreso inicial de la serie.
    const showProgress = new Progress(show.id);

    // Añade la serie junto con su progreso.
    this.#showEntries.push({
      show: show,
      progress: showProgress
    });

    return true;
  }

  /**
   * Elimina una serie (y su progreso) por su id.
   * @param {number} showId Identificador de la serie que se quiere eliminar.
   * @returns {boolean} Devuelve true si se ha eliminado correctamente.
   */
  removeShow(showId) {

    // Busca la posición de la serie dentro del array.
    const showIndex = this.#showEntries.findIndex(
      showEntry => showEntry.show.id === showId
    );

    // Comprueba si la serie existe.
    if (showIndex === -1) {
      console.warn('ShowList: no existe ninguna serie con ese ID.');
      return false;
    }

    // Crea un array nuevo sin la serie que queremos eliminar.
    const updatedShowEntries = [];
    
    for (let i = 0; i < this.#showEntries.length; i++) {
      if (i !== showIndex) {
        updatedShowEntries.push(this.#showEntries[i]);
      }
    }

    // Actualiza el array de series.
    this.#showEntries = updatedShowEntries;

    return true;
  }

  /**
   * Reinicia el progreso de una serie de la lista.
   * @param {number} showId Identificador de la serie cuyo progreso se quiere reiniciar.
   * @returns {boolean} Devuelve true si se ha reiniciado correctamente.
   */
  resetProgress(showId) {

    // Busca la serie dentro de la lista.
    const showEntry = this.#showEntries.find(
      showEntry => showEntry.show.id === showId
    );

    // Comprueba si la serie existe.
    if (showEntry === undefined) {
      console.warn('ShowList: no existe ninguna serie con ese ID.');
      return false;
    }

    // Reinicia el progreso de la serie.
    showEntry.progress.reset();

    return true;
  }

   /**
   * Muestra por consola el nombre, tipo, valoración y progreso de cada serie.
   * Si la lista está vacía, muestra un mensaje informativo.
   */
  showList() {

    // Comprueba si la lista está vacía.
    if (this.#showEntries.length === 0) {
      console.log('La lista de series está vacía.');
      return;
    }

    // Recorre las series y muestra su información.
    this.#showEntries.forEach(showEntry => {

      const currentShow = showEntry.show;
      const showProgress = showEntry.progress;

      // Prepara el texto de la valoración.
      let ratingDisplay;

      if (currentShow.rating === null) {
        ratingDisplay = 'Sin valoración';
      } else {
        ratingDisplay = currentShow.rating;
      }

      // Prepara el texto del progreso.
      let progressDisplay;

      if (showProgress.hasStarted) {
        progressDisplay = `T${showProgress.currentSeason}E${showProgress.currentEpisode}`;
      } else {
        progressDisplay = 'Sin empezar';
      }

      console.log(
        `Nombre: ${currentShow.name} | Tipo: ${currentShow.type} | Rating: ${ratingDisplay} | Progreso: ${progressDisplay}`
      );
    });
  };

  /* ===========================================================================
     ETAPA 4 — Funciones flecha dentro de ShowList (2 puntos)
     =========================================================================== */

  /**
   * Añade varias series a la vez (operador rest).
   * Utiliza el método addShow() para comprobar cada serie antes de añadirla.
   * @param {...Show} shows Series que se quieren añadir.
   * @returns {number} Devuelve el número de series añadidas correctamente.
   */
  addMultipleShows = (...shows) => {

    // Contador de series añadidas.
    let addedShows = 0;

    // Recorre las series recibidas.
    for (const show of shows) {

      // Intenta añadir cada serie a la lista.
      if (this.addShow(show)) {
        addedShows++;
      }
    }

    return addedShows;
  };

  /**
   * No modifica el array interno de la lista.
   * @returns {Array} Devuelve los pares { show, progress } con rating dentro del rango
   *                  [minRating, maxRating].
   */
  sortShowsByPopularity = () => {

    // Crea una copia del array original para no modificar la lista.
    const sortedShowEntries = this.#showEntries.slice();

    // Ordena las series según su popularidad (weight), de mayor a menor.
    sortedShowEntries.sort((firstEntry, secondEntry) => {
      return secondEntry.show.weight - firstEntry.show.weight;
    });

    return sortedShowEntries;
  };

  /**
   * Devuelve los pares { show, progress } ordenados por weight (de mayor a
   * menor) sin modificar la lista original.
   * Excluye las series que no tienen valoración.
   * @param {number} minRating Valoración mínima.
   * @param {number} maxRating Valoración máxima.
   * @returns {Array} Devuelve un array nuevo con los pares { show, progress }.
   */
  getShowsByRatingRange = (minRating, maxRating) => {

    // Comprueba que las valoraciones sean números entre 0 y 10.
    if (
      typeof minRating !== 'number' || !Number.isFinite(minRating) || minRating < 0 || minRating > 10 ||
      typeof maxRating !== 'number' || !Number.isFinite(maxRating) || maxRating < 0 || maxRating > 10 ||
      minRating > maxRating
    ) {
      console.warn('ShowList: el rango de valoraciones no es válido.');
      return [];
    }

    // Devuelve las series cuya valoración está dentro del rango.
    return this.#showEntries.filter(showEntry => {
      const rating = showEntry.show.rating;
      // Comprueba que la serie tenga valoración.
      if (rating === null) {
        return false;
      }

      // Comprueba que la valoración esté dentro del rango.
      if (rating >= minRating && rating <= maxRating) {
        return true;
      }
      
      return false;
    });
  };

  
  /* ===========================================================================
     ETAPA 5.2 — markEpisodeWatched (forma parte de la etapa 5)
     =========================================================================== */
  
  /**
   * Avanza el progreso de una serie hasta su siguiente episodio.
   * @param {number} showId Identificador de la serie.
   * @returns {Object|null} Devuelve el episodio marcado como visto o null.
   */
  markEpisodeWatched(showId) {

    // Busca la serie dentro de la lista.
    const showEntry = this.#showEntries.find(
      showEntry => showEntry.show.id === showId
    );

    // Comprueba si la serie existe.
    if (showEntry === undefined) {
      console.warn('ShowList: no existe ninguna serie con ese ID.');
      return null;
    }

    // Busca el siguiente episodio pendiente.
    const nextEpisode = getNextPendingEpisode(
      showEntry.show,
      showEntry.progress
    );

    // Comprueba si quedan episodios pendientes.
    if (nextEpisode === null) {
      console.warn('ShowList: la serie ha terminado. No quedan episodios pendientes.');
      return null;
    }

    // Actualiza el progreso con el episodio encontrado.
    showEntry.progress.advance(nextEpisode.season, nextEpisode.number);

    return nextEpisode;
  };

}


/* =============================================================================
   ETAPA 5 — Función recursiva (4 puntos)
   ============================================================================= */

/**
 * 5.1 — Busca recursivamente un episodio por temporada y número.
 * @param {Array<Object>} episodes Array de episodios de la serie.
 * @param {number} season Temporada que queremos localizar.
 * @param {number} number Número de episodio que queremos localizar.
 * @param {number} index Posición del array que se está comprobando.
 * @returns {Object|null} Devuelve el episodio encontrado o null si no existe.
 */

const findEpisodeByNumber = (episodes, season, number, index = 0) => {

  // Comprueba que los datos recibidos sean válidos.
  if (!Array.isArray(episodes) || !Number.isInteger(season) || season <= 0 || !Number.isInteger(number) || number <= 0) {
    return null;
  }

  // Comprueba si hemos llegado al final del array.
  if (index >= episodes.length) {
    return null;
  }

  // Obtiene el episodio de la posición actual.
  const currentEpisode = episodes[index];

  // Comprueba si es el episodio que estamos buscando.
  if (currentEpisode.season === season && currentEpisode.number === number) {
    return currentEpisode;
  }

  // Si no coincide, continúa buscando en la siguiente posición.
  return findEpisodeByNumber(episodes, season, number, index + 1);
};



/* =============================================================================
   ETAPA 6 — Uso de reduce (4 puntos)
   ============================================================================= */



/**
 * Busca el género más frecuente entre todas las series.
 * @param {Array<Show>} shows Array de series que queremos analizar.
 * @returns {{genre: string, count: number}|null} Devuelve el género más frecuente y sus apariciones, o null.
 */
const getMostCommonGenre = (shows) => {

  // Comprueba que se ha recibido un array con elementos.
  if (!Array.isArray(shows) || shows.length === 0) {
    return null;
  }

  // Cuenta las apariciones de cada género.
  const genreCounts = shows.reduce((counts, show) => {

    show.genres.forEach(genre => {

      if (counts[genre] === undefined) {
        counts[genre] = 1;
      } else {
        counts[genre]++;
      }

    });

    return counts;

  }, {});

  // Obtiene los géneros encontrados.
  const genres = Object.keys(genreCounts);

  if (genres.length === 0) {
    return null;
  }

  // Busca el género más frecuente.
  const mostCommonGenre = genres.reduce((mostCommon, genre) => {

    if (genreCounts[genre] > genreCounts[mostCommon]) {
      return genre;
    }

    if (
      genreCounts[genre] === genreCounts[mostCommon] &&
      genre.localeCompare(mostCommon) < 0
    ) {
      return genre;
    }

    return mostCommon;

  });

  return {
    genre: mostCommonGenre,
    count: genreCounts[mostCommonGenre]
  };
};



/* =============================================================================
   ETAPA 7 — Destructuring y spread (3 puntos)
   ============================================================================= */

/**
 * Muestra la información principal de una serie y devuelve una copia
 * del objeto con el campo adicional following.
 * @param {Show} show Serie de la que queremos obtener la información.
 * @returns {Object|null} Devuelve una copia de la serie o null si no es válida.
 */
const getShowInfo = (show) => {

  // Comprobación del parametro recibido.
  if (!(show instanceof Show)) {
    console.warn('getShowInfo: el parámetro no es un objeto Show.');
    return null;
  }

  // Extraemos las propiedades de la serie recibida.
  const {name, type, rating, genres = [], network = {}, webChannel = {}} = show;

  // Extraemos el nombre de la cadena y de la plataforma.
  const { name: networkName } = network || {};
  const { name: webChannelName } = webChannel || {};

  // Obtenemos el primer género.
  let firstGenre = 'Sin género';
  if (genres.length > 0) {firstGenre = genres[0];}

  // Obtenemos la valoración.
  let ratingInfo = rating;
  if (rating === null) {ratingInfo = 'Sin valorar';}

  // Obtenemos el nombre de la plataforma disponible.
  let platformName = 'Desconocida';
  if (networkName) {platformName = networkName;} 
  else if (webChannelName) {platformName = webChannelName;}

  // Mostramos la información por consola.
  console.log('===== Información de la serie =====');
  console.log('Título:', name);
  console.log('Tipo:', type);
  console.log('Valoración:', ratingInfo);
  console.log('Primer Género:', firstGenre);
  console.log('Cadena / Plataforma:', platformName);

  // Creamos una copia de la serie añadiendo los campos adicionales.
  const showInfo = { ...show, rating: rating, following: true};

  return showInfo;
};


/* =============================================================================
   ETAPA 8 — Manejo de fechas (4 puntos)
   ============================================================================= */

/**
 * Calcula los días naturales que faltan hasta una fecha.
 * @param {string} isoDate Fecha en formato aaaa-mm-dd.
 * @param {Date} today Fecha desde la que se calcula la diferencia.
 * @returns {number|null} Devuelve los días restantes o null si la fecha no es válida.
 */
const daysUntil = (isoDate, today = new Date()) => {
  // Comprobamos el formato de la fecha.
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    console.warn('daysUntil: la fecha debe tener el formato aaaa-mm-dd.');
    return null;
  }

  // Convertimos la fecha de entrada en un objeto Date con formato de día y hora
  const targetDate = new Date(isoDate + 'T00:00:00Z');

  // Comprobamos que la fecha es válida.
  if (Number.isNaN(targetDate.getTime())) {
    console.warn('daysUntil: la fecha indicada no es válida.');
    return null;
  }

  // Comprobamos que la fecha existe.
  const dateParts = isoDate.split('-');

  if (targetDate.getFullYear() !== Number(dateParts[0]) || targetDate.getMonth() !== Number(dateParts[1]) - 1 ||
    targetDate.getDate() !== Number(dateParts[2])
  ) {
    console.warn('daysUntil: la fecha indicada no es válida.');
    return null;
  }

  // Obtenemos las fechas sin tener en cuenta las horas.
  const targetTime = Date.UTC(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate()
  );

  const todayTime = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Calculamos la diferencia en días.
  const difference = (targetTime - todayTime) / (1000 * 60 * 60 * 24);

  return difference;
};




/**
 * Busca el siguiente episodio pendiente de una serie.
 * @param {Show} show Serie cuyos episodios queremos consultar.
 * @param {Progress} progress Progreso actual de la serie.
 * @returns {Object|null} Devuelve el siguiente episodio o null si no existe.
 */
const getNextPendingEpisode = (show, progress) => {

  // Comprobamos que se han recibido los objetos bien.
  if (!(show instanceof Show) || !(progress instanceof Progress)) {
    console.warn('getNextPendingEpisode: se necesita un objeto Show y un objeto Progress.');
    return null;
  }

  // Comprobamos que el progreso pertenece a la serie.
  if (progress.showId !== show.id) {
    console.warn('getNextPendingEpisode: el progreso no pertenece a esta serie.');
    return null;
  }

  // Si no se ha comenzado la serie, busca el primer episodio.
  if (progress.currentSeason === 0 && progress.currentEpisode === 0) {
    return findEpisodeByNumber(show.episodes, 1, 1);
  }

  // Buscamos el siguiente episodio.
  let nextEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason, progress.currentEpisode + 1);
  if (nextEpisode !== null) {
    return nextEpisode;
  }

  // Si no existe, buscamos el primer episodio de la siguiente temporada.
  nextEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason + 1, 1);

  return nextEpisode;
};


/* =============================================================================
   ETAPA 9 — Función avanzada con múltiples operadores (5 puntos)
   ============================================================================= */

/**
 * Devuelve { platform, count, shows, averageRating } para una cadena
 * o plataforma concreta.
 * @param {Array<Show>} shows Array de series que queremos consultar.
 * @param {string} platformName Nombre de la cadena o plataforma.
 * @returns {Object|null} Devuelve la información de la plataforma o null si los datos no son válidos.
 */
const getShowsByPlatform = (shows, platformName) => {

  // Comprobamos que se han recibido los datos bien.
  if (!Array.isArray(shows) || typeof platformName !== 'string' || platformName.trim() === '') {
    console.warn('getShowsByPlatform: los parámetros no son válidos.');
    return null;
  }

  // Filtramos las series que pertenecen a la cadena o plataforma.
  const platformShows = shows.filter(show => {

    if ((show.network && show.network.name === platformName) || (show.webChannel && show.webChannel.name === platformName)) {
      return true;
    }
    return false;
  });

  // Obtenemos los títulos de las series que hemos encontrado.
  const showTitles = platformShows.map(show => show.name);

  // Sumamos las valoraciones y contamos las series que tienen valoración.
  const ratingData = platformShows.reduce((result, show) => {

    if (show.rating !== null) {
      result.total += show.rating;
      result.count++;
    }

    return result;
  }, { total: 0, count: 0 });

  // Calculamos la valoración media si existen.
  let averageRating = null;

  if (ratingData.count > 0) {
    averageRating = ratingData.total / ratingData.count;
  }

  // Devolvemos el resultado.
  return {
    platform: platformName,
    count: platformShows.length,
    shows: showTitles,
    averageRating: averageRating
  };
};




/* =============================================================================
   DATOS DE PRUEBA
   Datos reales de la API de TVmaze (consultados en septiembre de 2026),
   simplificados para la práctica: cada serie incluye solo algunos episodios
   por temporada y el resumen está en castellano y en texto plano.
   Hay tres excepciones, pensadas para poder probar todos los casos:
     - weight: en la API vale 100 en todas estas series. Aquí usamos valores
       distintos para que ordenar por popularidad dé un resultado visible.
     - El episodio T3E1 de The Last of Us, anunciado pero sin fecha.
     - La serie "Proyecto Aurora", sin valoración, sin géneros, sin cadena
       ni plataforma y con estrenos futuros.
   ============================================================================= */

const breakingBad = new Show({
  id: 169,
  name: 'Breaking Bad',
  summary: 'Un profesor de química con cáncer terminal empieza a fabricar metanfetamina para asegurar el futuro de su familia.',
  premiered: '2008-01-20',
  status: 'Ended',
  rating: 9.2,
  type: 'Scripted',
  genres: ['Drama', 'Crime', 'Thriller'],
  network: { name: 'AMC', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg',
  weight: 98,
  episodes: [
    { season: 1, number: 1, name: 'Pilot', airdate: '2008-01-20', summary: '', runtime: 60 },
    { season: 1, number: 2, name: "Cat's in the Bag...", airdate: '2008-01-27', summary: '', runtime: 60 },
    { season: 1, number: 3, name: "...and the Bag's in the River", airdate: '2008-02-10', summary: '', runtime: 60 },
    { season: 2, number: 1, name: 'Seven Thirty-Seven', airdate: '2009-03-08', summary: '', runtime: 60 },
    { season: 2, number: 2, name: 'Grilled', airdate: '2009-03-15', summary: '', runtime: 60 },
  ],
});

const gameOfThrones = new Show({
  id: 82,
  name: 'Game of Thrones',
  summary: 'Varias familias nobles luchan por el control del Trono de Hierro de los Siete Reinos.',
  premiered: '2011-04-17',
  status: 'Ended',
  rating: 8.9,
  type: 'Scripted',
  genres: ['Drama', 'Adventure', 'Fantasy'],
  network: { name: 'HBO', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg',
  weight: 99,
  episodes: [
    { season: 1, number: 1, name: 'Winter is Coming', airdate: '2011-04-17', summary: '', runtime: 60 },
    { season: 1, number: 2, name: 'The Kingsroad', airdate: '2011-04-24', summary: '', runtime: 60 },
    { season: 2, number: 1, name: 'The North Remembers', airdate: '2012-04-01', summary: '', runtime: 60 },
  ],
});

const strangerThings = new Show({
  id: 2993,
  name: 'Stranger Things',
  summary: 'Tras la desaparición de un niño, un pueblo descubre experimentos secretos y fuerzas sobrenaturales.',
  premiered: '2016-07-15',
  status: 'Ended',
  rating: 8.4,
  type: 'Scripted',
  genres: ['Drama', 'Horror', 'Science-Fiction'],
  network: null,
  webChannel: { name: 'Netflix', country: null },
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/595/1489169.jpg',
  weight: 99,
  episodes: [
    { season: 1, number: 1, name: 'Chapter One: The Vanishing of Will Byers', airdate: '2016-07-15', summary: '', runtime: 49 },
    { season: 1, number: 2, name: 'Chapter Two: The Weirdo on Maple Street', airdate: '2016-07-15', summary: '', runtime: 56 },
    { season: 2, number: 1, name: 'Chapter One: MADMAX', airdate: '2017-10-27', summary: '', runtime: 48 },
  ],
});

const theLastOfUs = new Show({
  id: 46562,
  name: 'The Last of Us',
  summary: 'Veinte años después de una pandemia, un superviviente escolta a una adolescente a través de un país devastado.',
  premiered: '2023-01-15',
  status: 'Running',
  rating: 7.9,
  type: 'Scripted',
  genres: ['Drama', 'Action', 'Horror'],
  network: { name: 'HBO', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/563/1409008.jpg',
  weight: 97,
  episodes: [
    { season: 1, number: 1, name: 'When You\'re Lost in the Darkness', airdate: '2023-01-15', summary: '', runtime: 85 },
    { season: 1, number: 2, name: 'Infected', airdate: '2023-01-22', summary: '', runtime: 56 },
    { season: 2, number: 1, name: 'Future Days', airdate: '2025-04-13', summary: '', runtime: 62 },
    // Ficticio: episodio anunciado pero sin fecha de emisión conocida.
    // (En la API, un episodio sin fecha llega con airdate ""; aquí usamos null.)
    { season: 3, number: 1, name: 'TBA', airdate: null, summary: '', runtime: null },
  ],
});

const severance = new Show({
  id: 44933,
  name: 'Severance',
  summary: 'Los empleados de una empresa se someten a un procedimiento que separa sus recuerdos del trabajo y de su vida personal.',
  premiered: '2022-02-18',
  status: 'Running',
  rating: 7.7,
  type: 'Scripted',
  genres: ['Drama', 'Science-Fiction', 'Mystery'],
  network: null,
  webChannel: { name: 'Apple TV', country: null },
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/548/1371406.jpg',
  weight: 96,
  episodes: [
    { season: 1, number: 1, name: 'Good News About Hell', airdate: '2022-02-18', summary: '', runtime: 57 },
    { season: 1, number: 2, name: 'Half Loop', airdate: '2022-02-18', summary: '', runtime: 53 },
    { season: 2, number: 1, name: 'Hello, Ms. Cobel', airdate: '2025-01-17', summary: '', runtime: 48 },
  ],
});

// Serie ficticia pensada para los casos límite: sin valoración, sin géneros,
// sin cadena ni plataforma y con episodios que se emitirán en el futuro.
const proyectoAurora = new Show({
  id: 90001,
  name: 'Proyecto Aurora',
  summary: 'Serie ficticia para las pruebas de la práctica.',
  premiered: '2026-11-20',
  status: 'To Be Determined',
  rating: null,
  type: 'Documentary',
  genres: [],
  network: null,
  webChannel: null,
  imageUrl: '',
  weight: 40,
  episodes: [
    { season: 1, number: 1, name: 'Episodio 1', airdate: '2026-11-20', summary: '', runtime: 45 },
    { season: 1, number: 2, name: 'Episodio 2', airdate: '2026-11-27', summary: '', runtime: 45 },
  ],
});

// Fecha fija para que los resultados de las pruebas de fechas no dependan del
// día en que se ejecuten: 13 de noviembre de 2026 en hora local.
const TODAY = new Date(2026, 10, 13);


/* =============================================================================
   PRUEBAS
   Añadid aquí las llamadas necesarias para probar todas las etapas y ver los
   resultados por consola. Incluid también pruebas con datos no válidos y con
   los casos límite que indica el enunciado.
   ============================================================================= */

// =============================================================================
// PRUEBAS — ETAPA 1
// =============================================================================

console.log('****************************************************');
console.log('****        PRUEBAS ETAPA 1: CLASE SHOW        ****');
console.log('****************************************************');
console.log('');
console.log('');


console.log('===== Verificación de Propiedades y getters =====');
console.log('');
console.log('Breaking Bad - Nombre:', breakingBad.name);
console.log('Severance - ID:', severance.id);
console.log('GOT - Rating:', gameOfThrones.rating);
console.log('The last of us - Plataforma:', theLastOfUs.platform);
console.log('');


console.log('===== Verificación de distintas plataformas =====');
console.log('');
console.log('Stranger Things - Plataforma:', strangerThings.platform);
console.log('Proyecto Aurora - Plataforma:', proyectoAurora.platform);
console.log('');


console.log('===== Verificación de Rating =====');
console.log('');
const originalRating = breakingBad.rating;                          // Lo guardo para reestablecerlo al final
breakingBad.rating = 8.2;                                           // Cambio a 8.2
console.log('Rating tras setter válido:', breakingBad.rating);        // 8.2
breakingBad.rating = 15;                                            // Mayor de 10
console.log('Rating tras setter erroneo:', breakingBad.rating);      // 8.2
breakingBad.rating = -1;                                            // Menor de 0
console.log('Rating tras setter erroneo:', breakingBad.rating);      // 8.2
breakingBad.rating = '5';                                           // No es un número
console.log('Rating tras setter erroneo:', breakingBad.rating);      // 8.2
breakingBad.rating = null;                                          // NULL
console.log('Rating tras setter null:', breakingBad.rating);          // null
breakingBad.rating = originalRating;                                // se restaura el dato original

console.log('');
console.log('===== Verificación de Constructor con datos erroneos =====');
console.log('');
const invalidShow = new Show({
    id: -5,
    name: '   ',
    summary: '...',
    premiered: '2026-11-02',
    status: 'Ended',
    rating: 15,
    type: 'Scripted',
    genres: 'Drama',
    network: null,
    webChannel: null,
    imageUrl: '',
    weight: 1,
    episodes: 'no soy un array'
});

console.log('');
console.log('ID de serie en el Constructor:', invalidShow.id);
console.log('Nombre de serie invalido en el Constructor:', invalidShow.name);
console.log('Rating de serie invalido en el Constructor:', invalidShow.rating);
console.log('Géneros de serie invalido en el Constructor:', invalidShow.genres);
console.log('Episodios de serie invalido en el Constructor:', invalidShow.episodes);



// =============================================================================
// PRUEBAS — ETAPA 2
// =============================================================================

console.log('');
console.log('');
console.log('****************************************************');
console.log('****       PRUEBAS ETAPA 2: CLASE PROGRESS     ****');
console.log('****************************************************');
console.log('');
console.log('');


console.log('===== Verificación inicial =====');
console.log('');

const progressTest = new Progress(breakingBad.id);

console.log('ID de serie:', progressTest.showId);
console.log('Temporada inicial:', progressTest.currentSeason);
console.log('Episodio inicial:', progressTest.currentEpisode);
console.log('¿Ha comenzado?:', progressTest.hasStarted);

console.log('');
console.log('===== Avance válido =====');
console.log('');
console.log('Resultado:', progressTest.advance(1, 3));
console.log('Temporada:', progressTest.currentSeason);
console.log('Episodio:', progressTest.currentEpisode);
console.log('¿Ha comenzado?:', progressTest.hasStarted);

console.log('');
console.log('===== Avance erroneo =====');
console.log('');
console.log('Resultado:', progressTest.advance(0, 5));
console.log('Temporada:', progressTest.currentSeason);
console.log('Episodio:', progressTest.currentEpisode);

console.log('');
console.log('===== Avance erroneo =====');
console.log('');
console.log('Resultado:', progressTest.advance(5, -2));
console.log('Temporada:', progressTest.currentSeason);
console.log('Episodio:', progressTest.currentEpisode);
console.log('');

console.log('===== Reset =====');
console.log('');
progressTest.reset();
console.log('Temporada:', progressTest.currentSeason);
console.log('Episodio:', progressTest.currentEpisode);
console.log('¿Ha comenzado?:', progressTest.hasStarted);



// =============================================================================
// PRUEBAS — ETAPA 3
// =============================================================================

console.log('');
console.log('');
console.log('****************************************************');
console.log('****       PRUEBAS ETAPA 3: CLASE SHOWLIST     ****');
console.log('****************************************************');
console.log('');
console.log('');

const myShowList = new ShowList();

console.log('===== Verificación inicial =====');
console.log('');

console.log('Número de series inicial:', myShowList.entries.length);
console.log('Número de objetos Show:', myShowList.shows.length);

myShowList.showList();

console.log('');
console.log('===== Añadir series =====');
console.log('');

console.log('Añadir Breaking Bad:', myShowList.addShow(breakingBad));
console.log('Añadir Game of Thrones:', myShowList.addShow(gameOfThrones));
console.log('Añadir Stranger Things:', myShowList.addShow(strangerThings));

console.log('');
console.log('Número de series:', myShowList.entries.length);
console.log('Número de objetos Show:', myShowList.shows.length);

console.log('');
console.log('===== Añadir serie duplicada =====');
console.log('');

console.log('Añadir Breaking Bad otra vez:', myShowList.addShow(breakingBad));

console.log('');
console.log('Número de series:', myShowList.entries.length);

console.log('');
console.log('===== Añadir serie erronea =====');
console.log('');

console.log('Añadir objeto incorrecto:', myShowList.addShow({ name: 'Serie falsa' }));

console.log('');
console.log('Número de series:', myShowList.entries.length);

console.log('');
console.log('===== Mostrar lista de series =====');
console.log('');

myShowList.showList();

console.log('');
console.log('===== Actualizar progreso =====');
console.log('');

// Busca la serie Breaking Bad para modificar su progreso.
const breakingBadEntry = myShowList.entries.find(
  showEntry => showEntry.show.id === breakingBad.id
);

console.log('Avanzar Breaking Bad:', breakingBadEntry.progress.advance(2, 5));

console.log('');
myShowList.showList();

console.log('');
console.log('===== Reiniciar progreso =====');
console.log('');

console.log('Reiniciar Breaking Bad:', myShowList.resetProgress(breakingBad.id));

console.log('');
myShowList.showList();

console.log('');
console.log('===== Reiniciar serie inexistente =====');
console.log('');

console.log('Reiniciar serie inexistente:', myShowList.resetProgress(99999));

console.log('');
console.log('===== Eliminar serie =====');
console.log('');

console.log('Eliminar Game of Thrones:', myShowList.removeShow(gameOfThrones.id));

console.log('');
console.log('Número de series:', myShowList.entries.length);
myShowList.showList();

console.log('');
console.log('===== Eliminar serie inexistente =====');
console.log('');

console.log('Eliminar serie inexistente:', myShowList.removeShow(99999));

console.log('');
console.log('Número de series:', myShowList.entries.length);

console.log('');
console.log('===== Verificación lista vacía =====');
console.log('');

const emptyShowList = new ShowList();

emptyShowList.showList();

console.log('');
console.log('Número de series:', emptyShowList.entries.length);
console.log('Número de objetos Show:', emptyShowList.shows.length);



// =============================================================================
// PRUEBAS — ETAPA 4
// =============================================================================

console.log('');
console.log('');
console.log('****************************************************');
console.log('****      PRUEBAS ETAPA 4: MÉTODOS DE SHOWLIST ****');
console.log('****************************************************');
console.log('');
console.log('');

const showListTest = new ShowList();

showListTest.addMultipleShows(
  breakingBad,
  gameOfThrones,
  strangerThings,
  theLastOfUs,
  severance,
  proyectoAurora
);

console.log('===== Añadir varias series =====');
console.log('');

console.log(
  'Series añadidas:',
  showListTest.addMultipleShows(breakingBad, gameOfThrones)
);

console.log('Número total de series:', showListTest.entries.length);

console.log('');
console.log('===== Filtrar por valoración =====');
console.log('');

console.log('Series con valoración entre 8 y 10:');

const showsByRating = showListTest.getShowsByRatingRange(8, 10);

showsByRating.forEach(showEntry => {
  console.log(showEntry.show.name, '-', showEntry.show.rating);
});

console.log('');
console.log('Número de series encontradas:', showsByRating.length);

console.log('');
console.log('===== Filtrar con rango erroneo =====');
console.log('');

console.log(
  'Resultado con rango 9 - 5:',
  showListTest.getShowsByRatingRange(9, 5)
);

console.log(
  'Resultado con rango -1 - 5:',
  showListTest.getShowsByRatingRange(-1, 5)
);

console.log(
  'Resultado con rango 5 - 11:',
  showListTest.getShowsByRatingRange(5, 11)
);

console.log('');
console.log('===== Ordenar por popularidad =====');
console.log('');

console.log('Series ordenadas por popularidad:');

const showsByPopularity = showListTest.sortShowsByPopularity();

showsByPopularity.forEach(showEntry => {
  console.log(
    showEntry.show.name,
    '- Popularidad:',
    showEntry.show.weight
  );
});

console.log('');
console.log('===== Comprobar que la lista no cambia =====');
console.log('');

console.log('Orden original de la lista:');

showListTest.entries.forEach(showEntry => {
  console.log(showEntry.show.name);
});

console.log('');
console.log('Orden devuelto por popularidad:');

showsByPopularity.forEach(showEntry => {
  console.log(showEntry.show.name);
});



// =============================================================================
// PRUEBAS — ETAPA 5
// =============================================================================

console.log('');
console.log('');
console.log('****************************************************');
console.log('****         PRUEBAS ETAPA 5: RECURSIVIDAD     ****');
console.log('****************************************************');
console.log('');
console.log('');


console.log('===== Búsqueda de episodio existente =====');
console.log('');

const episodeFound = findEpisodeByNumber(breakingBad.episodes, 1, 2);

console.log('Episodio encontrado:', episodeFound);

console.log('');
console.log('===== Búsqueda de episodio inexistente =====');
console.log('');

const episodeNotFound = findEpisodeByNumber(breakingBad.episodes, 5, 1);

console.log('Episodio encontrado:', episodeNotFound);

console.log('');
console.log('===== Búsqueda con datos erroneos =====');
console.log('');

console.log(
  'Array erroneo:',
  findEpisodeByNumber('no es un array', 1, 1)
);

console.log(
  'Temporada erronea:',
  findEpisodeByNumber(breakingBad.episodes, 0, 1)
);

console.log(
  'Episodio erroneo:',
  findEpisodeByNumber(breakingBad.episodes, 1, -2)
);

console.log('');
console.log('===== Avance automático del progreso =====');
console.log('');

const episodeTestList = new ShowList();

episodeTestList.addShow(breakingBad);

// Primer avance: debe marcar T1E1.
let watchedEpisode = episodeTestList.markEpisodeWatched(breakingBad.id);

console.log('Episodio marcado:', watchedEpisode.name);
console.log('Temporada:', episodeTestList.entries[0].progress.currentSeason);
console.log('Episodio:', episodeTestList.entries[0].progress.currentEpisode);

console.log('');

// Segundo avance: debe marcar T1E2.
watchedEpisode = episodeTestList.markEpisodeWatched(breakingBad.id);

console.log('Episodio marcado:', watchedEpisode.name);
console.log('Temporada:', episodeTestList.entries[0].progress.currentSeason);
console.log('Episodio:', episodeTestList.entries[0].progress.currentEpisode);

console.log('');
console.log('===== Cambio de temporada =====');
console.log('');

// Avanza hasta completar T1E3.
episodeTestList.markEpisodeWatched(breakingBad.id);

// El siguiente episodio debe ser T2E1.
watchedEpisode = episodeTestList.markEpisodeWatched(breakingBad.id);

console.log('Episodio marcado:', watchedEpisode.name);
console.log('Temporada:', episodeTestList.entries[0].progress.currentSeason);
console.log('Episodio:', episodeTestList.entries[0].progress.currentEpisode);

console.log('');
console.log('===== Serie terminada =====');
console.log('');

// Avanza hasta completar T2E2.
episodeTestList.markEpisodeWatched(breakingBad.id);

// Ya no quedan episodios disponibles.
watchedEpisode = episodeTestList.markEpisodeWatched(breakingBad.id);

console.log('Resultado del último avance:', watchedEpisode);
console.log('Temporada:', episodeTestList.entries[0].progress.currentSeason);
console.log('Episodio:', episodeTestList.entries[0].progress.currentEpisode);

console.log('');
console.log('===== Serie inexistente =====');
console.log('');

console.log('Resultado:', episodeTestList.markEpisodeWatched(99999));

// =============================================================================
// PRUEBAS — ETAPA 6
// =============================================================================

console.log('');
console.log('');
console.log('****************************************************');
console.log('****         PRUEBAS ETAPA 6: REDUCE           ****');
console.log('****************************************************');
console.log('');
console.log('');


console.log('===== Género más frecuente =====');
console.log('');

const mostCommonGenre = getMostCommonGenre(showListTest.shows);

console.log('Género más frecuente:', mostCommonGenre);

console.log('');
console.log('===== Validación de datos =====');
console.log('');

console.log('Array erroneo:', getMostCommonGenre(null));
console.log('Array vacío:', getMostCommonGenre([]));
console.log('Series sin géneros:', getMostCommonGenre([invalidShow]));



console.log('');
console.log('');
console.log('****************************************************');
console.log('****   PRUEBAS ETAPA 7: DESTRUCTURING Y SPREAD  ****');
console.log('****************************************************');
console.log('');
console.log('');


const breakingBadInfo = getShowInfo(breakingBad);

console.log('');
console.log('===== Comprobación de la copia =====');
console.log('La original tiene following:', breakingBad.following !== undefined);
console.log('La copia tiene following:', breakingBadInfo.following);
console.log('La valoración se conserva:', breakingBadInfo.rating);
console.log('-------------------------------------');

console.log('');
const proyectoAuroraInfo = getShowInfo(proyectoAurora);
console.log('');
console.log('===== Comprobación de la copia =====');
console.log('La original tiene following:', proyectoAurora.following !== undefined);
console.log('La copia tiene following:', proyectoAuroraInfo.following);
console.log('La valoración se conserva:', proyectoAuroraInfo.rating);

console.log('');
console.log('===== Validación de datos =====');
console.log('');

console.log('Objeto erroneo (null):', getShowInfo(null));
console.log('Objeto erroneo (Number):', getShowInfo(Number));
console.log('');
console.log('Objeto válido (theLastOfUs):', getShowInfo(theLastOfUs) !== null);


console.log('');
console.log('');
console.log('****************************************************');
console.log('****      PRUEBAS ETAPA 8: MANEJO DE FECHAS     ****');
console.log('****************************************************');
console.log('');
console.log('');

console.log('===== Cálculo de días hasta una fecha =====');
console.log('');

console.log('Fecha futura:', daysUntil('2026-12-01', TODAY));
console.log('Fecha pasada:', daysUntil('2026-10-01', TODAY));
console.log('Fecha actual:', daysUntil('2026-11-13', TODAY));

console.log('');
console.log('===== Validación de fechas =====');
console.log('');

console.log('Formato incorrecto(20-11-2026):', daysUntil('20-11-2026', TODAY));
console.log('Mes incorrecto(2026-13-05):', daysUntil('2026-13-05', TODAY));
console.log('Día inexistente(2026-02-30):', daysUntil('2026-02-30', TODAY));

console.log('');
console.log('');
console.log('===== Búsqueda del siguiente episodio =====');
console.log('');

const newProgressTest = new Progress(breakingBad.id);

console.log('Primer episodio:', getNextPendingEpisode(breakingBad, newProgressTest));

newProgressTest.advance(1, 2);

console.log('Siguiente episodio:',getNextPendingEpisode(breakingBad, newProgressTest));

console.log('');
console.log('===== Validación de objetos =====');
console.log('');

console.log('Serie erronea:', getNextPendingEpisode(strangerThings, newProgressTest));
console.log('Progreso erroneo:', getNextPendingEpisode(breakingBad, null));

const wrongProgress = new Progress(strangerThings.id);

console.log('Progreso de serie confundida:', getNextPendingEpisode(breakingBad, wrongProgress));



console.log('');
console.log('');
console.log('****************************************************');
console.log('****    PRUEBAS ETAPA 9: SERIES POR PLATAFORMA ****');
console.log('****************************************************');
console.log('');
console.log('');

const showsTest = [breakingBad,gameOfThrones,strangerThings,theLastOfUs,severance,proyectoAurora];

console.log('===== Búsqueda por cadena o plataforma =====');
console.log('');

console.log('HBO:', getShowsByPlatform(showsTest, 'HBO'));
console.log('Netflix:', getShowsByPlatform(showsTest, 'Netflix'));
console.log('Apple TV+:', getShowsByPlatform(showsTest, 'Apple TV+'));

console.log('');
console.log('===== Validación de parámetros =====');
console.log('');

console.log('Array inválido:', getShowsByPlatform(null, 'HBO'));
console.log('Plataforma vacía:', getShowsByPlatform(showsTest, ''));
console.log('Plataforma no textual:', getShowsByPlatform(showsTest, 123));

console.log('');
console.log('===== Plataforma sin resultados =====');
console.log('');

console.log('Plataforma inexistente:', getShowsByPlatform(showsTest, 'Movistar+'));