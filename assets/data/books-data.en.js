/* ==========================================================================
   LIBROS (EN) — misma estructura y mismos datos "de catálogo" que
   assets/data/books-data.js (title, year, publisher, cover, buy_url: no
   se traducen -- son los libros reales, publicados en español, con sus
   links de compra oficiales sin cambios). Lo único traducido es
   "description" (el texto breve del overlay interactivo), pedido
   explícitamente para la versión en inglés. Se mantiene como archivo
   paralelo -- no como campos extra dentro de books-data.js -- para no
   tocar books.js ni la página ES: cada página carga un solo archivo de
   datos según su idioma, ambos escriben el mismo window.BOOKS_DATA.
   ========================================================================== */
window.BOOKS_DATA = [
  {
    "title": "Neuromagia",
    "subtitle": "Qué pueden enseñarnos los magos (y la ciencia) sobre el funcionamiento del cerebro",
    "year": 2015,
    "publisher": "Siglo XXI Editores",
    "coauthors": "con Mariano Sigman y Marcelo Insúa",
    "cover": "img/neuromagia.jpg",
    "description": "A journey through magic tricks and what they reveal about perception, attention, and how our brain works.",
    "buy_url": "https://sigloxxieditores.com.ar/libro/neuromagia/"
  },
  {
    "title": "Atletismo mental",
    "subtitle": "Técnicas para entrenar el cerebro y mejorar la memoria",
    "year": 2016,
    "publisher": "Sudamericana",
    "coauthors": "",
    "cover": "img/atletismo_mental.jpg",
    "description": "Memory, attention and mental math can be trained too. A guide to understanding how the brain learns and to developing our cognitive abilities.",
    "buy_url": "https://www.penguinlibros.com/ar/autoayuda/636958-libro-atletismo-mental-9789877806205"
  },
  {
    "title": "Retos asombrosos",
    "subtitle": "",
    "year": 2018,
    "publisher": "Sudamericana",
    "coauthors": "con T. Rieznik",
    "cover": "img/retos_asombrosos.webp",
    "description": "Trivia and games to discover physics in everyday situations, proving that science can be fun too.",
    "buy_url": "https://www.penguinlibros.com/ar/a-partir-de-9-anos/146041-ebook-retos-asombrosos-9789500760560"
  },
  {
    "title": "Tabú",
    "subtitle": "",
    "year": 2020,
    "publisher": "El Gato y La Caja",
    "coauthors": "",
    "cover": "img/tabu.webp",
    "description": "A journey through neuroscience and genetics exploring how new scientific knowledge challenges our ideas about morality and the limits of what it means to be human.",
    "buy_url": "https://tienda.elgatoylacaja.com/us/productos/tabu/"
  },
  {
    "title": "Enseñar",
    "subtitle": "El ABC de la alfabetización (o por qué la ciencia de la lectura puede revolucionar la educación)",
    "year": 2026,
    "publisher": "Ediciones B",
    "coauthors": "",
    "cover": "img/enseñar.jpg",
    "description": "Why so many children fail to learn to read and do basic arithmetic, and how scientific evidence can transform literacy education.",
    "buy_url": "https://www.penguinlibros.com/ar/economia-politica-y-actualidad/618581-libro-ensenar-9789877805802"
  }
];
