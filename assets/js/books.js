/* ==========================================================================
   LIBROS — renderiza window.BOOKS_DATA (definido en
   assets/data/books-data.js, que debe cargarse ANTES que este script)
   dentro de [data-books-grid].

   Antes usaba fetch() a assets/data/books.json, pero eso falla al abrir el
   sitio con file:// (sin servidor HTTP). Ahora lee los datos ya presentes
   en memoria vía window.BOOKS_DATA -- funciona en los tres contextos
   (file://, http://localhost, GitHub Pages).
   ========================================================================== */

(function () {
  var gridEl = document.querySelector('[data-books-grid]');
  if (!gridEl) return;

  // Mismo switch mínimo por <html lang> que noticias.js/articles.js/papers.js
  // -- la descripción de cada libro ya viene traducida en window.BOOKS_DATA
  // (books-data.en.js en /en/), acá solo el CTA y el alt de la tapa.
  var isEN = document.documentElement.lang === 'en';
  var L = isEN ? {
    cta: 'Get the book',
    coverAlt: 'Cover of '
  } : {
    cta: 'Conseguilo acá',
    coverAlt: 'Portada de '
  };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  try {
    var books = window.BOOKS_DATA;
    if (!Array.isArray(books) || !books.length) return;

    // Las portadas en books-data.js están escritas en formato "img/archivo.ext",
    // pensado para páginas en la raíz (como index.html). En páginas dentro de
    // una subcarpeta (como sobre-mi/index.html) hay que anteponer el mismo
    // prefijo relativo que ya usa data-books-src para llegar a assets/data/.
    var srcAttr = gridEl.getAttribute('data-books-src') || '';
    var base = srcAttr.replace(/assets\/data\/books\.json$/, '');

    gridEl.innerHTML = books.map(function (b) {
      var cover = b.cover
        ? '<img src="' + escapeHtml(base + b.cover) + '" alt="' + L.coverAlt + escapeHtml(b.title) + '" loading="lazy">'
        : escapeHtml(b.title);

      // Overlay con descripción breve + CTA opcional (solo si hay buy_url).
      // El markup se genera siempre (misma fuente de datos en home y
      // sobre-mi), pero solo se activa visualmente donde el contenedor
      // tiene la clase .book-grid--interactive (ver home.css) -- en
      // sobre-mi queda inerte y la tapa se ve exactamente igual que antes.
      var cta = b.buy_url
        ? '<a class="book-card__cta" href="' + escapeHtml(b.buy_url) + '" target="_blank" rel="noopener noreferrer">' + L.cta + ' <span aria-hidden="true">↗</span></a>'
        : '';
      var overlay = b.description
        ? '<div class="book-card__overlay">' +
            '<p class="book-card__overlay-desc">' + escapeHtml(b.description) + '</p>' +
            cta +
          '</div>'
        : '';

      return (
        '<div class="book-card">' +
          // tabindex hace la tapa enfocable por teclado (revela el overlay
          // vía :focus-within en CSS) y es lo que permite que, en touch,
          // el primer tap también la enfoque y muestre la descripción sin
          // JS extra para eso.
          '<div class="book-card__cover' + (b.cover ? ' book-card__cover--photo' : '') + '" tabindex="0">' +
            cover +
            overlay +
          '</div>' +
          '<div>' +
            '<span class="book-card__year">' + escapeHtml(b.year) +
              (b.publisher ? ' · ' + escapeHtml(b.publisher) : '') +
            '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Click/tap "fija" el overlay abierto (adicional a :hover/:focus-within),
    // sin interceptar el click cuando es sobre el CTA -- ese debe navegar.
    // Inerte en grids sin .book-grid--interactive (p. ej. sobre-mi).
    gridEl.querySelectorAll('.book-card__cover').forEach(function (cover) {
      cover.addEventListener('click', function (e) {
        if (e.target.closest('.book-card__cta')) return;
        var wasActive = cover.classList.contains('is-active');
        gridEl.querySelectorAll('.book-card__cover.is-active').forEach(function (c) {
          c.classList.remove('is-active');
        });
        if (!wasActive) cover.classList.add('is-active');
      });
    });
  } catch (error) {
    // Antes era silencioso y ocultaba la causa real; ahora queda registrado
    // en consola para poder diagnosticar sin adivinar. La sección sigue sin
    // romperse: simplemente no se rellena.
    console.error('Error cargando libros (window.BOOKS_DATA):', error);
  }
})();
