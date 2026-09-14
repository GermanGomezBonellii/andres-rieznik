/* ==========================================================================
   PAPERS — renderiza window.PAPERS_DATA (definido en
   assets/data/papers-data.js, que debe cargarse ANTES que este script)
   dentro de [data-papers-list].

   Antes usaba fetch() a assets/data/papers.json, pero eso falla al abrir
   el sitio con file:// (sin servidor HTTP) -- mismo problema y misma
   solución que articles.js y books.js. Agregar una publicación nueva es
   editar assets/data/papers-data.js, sin tocar HTML ni este archivo.
   ========================================================================== */

(function () {
  var listEl = document.querySelector('[data-papers-list]');
  if (!listEl) return;

  // Mismo switch mínimo por <html lang> que noticias.js/articles.js/books.js.
  var isEN = document.documentElement.lang === 'en';
  var L = isEN ? {
    empty: 'No publications yet.',
    error: 'The list of publications could not be loaded.',
    viewDoi: 'View DOI'
  } : {
    empty: 'Todavía no hay publicaciones cargadas.',
    error: 'No se pudo cargar el listado de publicaciones.',
    viewDoi: 'Ver DOI'
  };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  try {
    var papers = window.PAPERS_DATA;

    if (!Array.isArray(papers) || !papers.length) {
      listEl.innerHTML = '<div class="news-empty">' + L.empty + '</div>';
      return;
    }

    listEl.innerHTML = papers.map(function (p) {
      return (
        '<article class="paper-card">' +
          '<div>' +
            '<h3 class="paper-card__title">' + escapeHtml(p.title) + '</h3>' +
            '<p class="paper-card__meta">' + escapeHtml(p.authors) + '</p>' +
            '<p class="paper-card__meta">' + escapeHtml(p.journal) + (p.year ? ' · ' + p.year : '') + '</p>' +
          '</div>' +
          '<a class="arrow-link paper-card__doi" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener noreferrer">' +
            L.viewDoi + ' <span class="arrow-link__arrow">&#8599;</span>' +
          '</a>' +
        '</article>'
      );
    }).join('');
  } catch (error) {
    console.error('Error cargando papers (window.PAPERS_DATA):', error);
    listEl.innerHTML = '<div class="news-error">' + L.error + '</div>';
  }
})();
