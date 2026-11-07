/* ==========================================================================
   LIVROS (PT) — mesma estrutura e mesmos dados de catálogo que
   assets/data/books-data.js (título, ano, editora, capa, link de compra:
   não se traduzem — são os livros reais, publicados em espanhol, com seus
   links oficiais de compra). Só se traduz "description" (o texto breve do
   overlay interativo). Cada página carrega um único arquivo de dados
   conforme o idioma; todos escrevem o mesmo window.BOOKS_DATA.
   ========================================================================== */
window.BOOKS_DATA = [
  {
    "title": "Neuromagia",
    "subtitle": "Qué pueden enseñarnos los magos (y la ciencia) sobre el funcionamiento del cerebro",
    "year": 2015,
    "publisher": "Siglo XXI Editores",
    "coauthors": "con Mariano Sigman y Marcelo Insúa",
    "cover": "img/neuromagia.jpg",
    "description": "Uma viagem pelos truques de mágica e pelo que eles revelam sobre a percepção, a atenção e o funcionamento do nosso cérebro.",
    "buy_url": "https://sigloxxieditores.com.ar/libro/neuromagia/"
  },
  {
    "title": "Atletismo mental",
    "subtitle": "Técnicas para entrenar el cerebro y mejorar la memoria",
    "year": 2016,
    "publisher": "Sudamericana",
    "coauthors": "",
    "cover": "img/atletismo_mental.jpg",
    "description": "Memória, atenção e cálculo mental também podem ser treinados. Um guia para entender como o cérebro aprende e para desenvolver nossas capacidades cognitivas.",
    "buy_url": "https://www.penguinlibros.com/ar/autoayuda/636958-libro-atletismo-mental-9789877806205"
  },
  {
    "title": "Retos asombrosos",
    "subtitle": "",
    "year": 2018,
    "publisher": "Sudamericana",
    "coauthors": "con T. Rieznik",
    "cover": "img/retos_asombrosos.webp",
    "description": "Curiosidades e jogos para descobrir a física em situações cotidianas, mostrando que a ciência também pode ser divertida.",
    "buy_url": "https://www.penguinlibros.com/ar/a-partir-de-9-anos/146041-ebook-retos-asombrosos-9789500760560"
  },
  {
    "title": "Tabú",
    "subtitle": "",
    "year": 2020,
    "publisher": "El Gato y La Caja",
    "coauthors": "",
    "cover": "img/tabu.webp",
    "description": "Uma viagem pela neurociência e pela genética que explora como os novos conhecimentos científicos desafiam nossas ideias sobre a moral e sobre os limites do que significa ser humano.",
    "buy_url": "https://tienda.elgatoylacaja.com/us/productos/tabu/"
  },
  {
    "title": "Enseñar",
    "subtitle": "El ABC de la alfabetización (o por qué la ciencia de la lectura puede revolucionar la educación)",
    "year": 2026,
    "publisher": "Ediciones B",
    "coauthors": "",
    "cover": "img/enseñar.jpg",
    "description": "Por que tantas crianças não aprendem a ler nem a resolver operações básicas, e como a evidência científica pode transformar a educação em alfabetização.",
    "buy_url": "https://www.penguinlibros.com/ar/economia-politica-y-actualidad/618581-libro-ensenar-9789877805802"
  }
];
