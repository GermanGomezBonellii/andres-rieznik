/* ==========================================================================
   ARTÍCULOS — renderiza window.ARTICLES_DATA (definido en
   assets/data/articles-data.js, que debe cargarse ANTES que este script)
   dentro de [data-articles-list]. Misma fuente de datos para dos vistas
   distintas:

   - variant "row" (default): listado completo de articulos/index.html,
     una fila editorial ancha por artículo (.article-row).
   - variant "preview": previsualización compacta en la home
     (.article-preview), opcionalmente acotada con data-articles-limit.

   Antes usaba fetch() a assets/data/articles.json, pero eso falla al abrir
   el sitio con file:// (sin servidor HTTP). Ahora lee los datos ya
   presentes en memoria vía window.ARTICLES_DATA -- misma fuente de datos,
   sin duplicar título/bajada en más de un lugar, y funciona en los tres
   contextos (file://, http://localhost, GitHub Pages).
   ========================================================================== */

(function () {
  var listEl = document.querySelector('[data-articles-list]');
  if (!listEl) return;

  var base = listEl.getAttribute('data-articles-base') || '';
  var variant = listEl.getAttribute('data-articles-variant') || 'row';
  var limit = parseInt(listEl.getAttribute('data-articles-limit'), 10);

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  try {
    var articles = window.ARTICLES_DATA;

    if (!Array.isArray(articles) || !articles.length) {
      listEl.innerHTML = '<div class="news-empty">Todavía no hay artículos publicados.</div>';
      return;
    }

    var items = limit ? articles.slice(0, limit) : articles;

    if (variant === 'preview') {
      listEl.innerHTML = items.map(function (a) {
        return (
          '<a class="article-preview" href="' + base + escapeHtml(a.href) + '">' +
            '<span class="article-preview__body">' +
              '<span class="article-preview__title">' + escapeHtml(a.title) + '</span>' +
              '<span class="article-preview__excerpt">' + escapeHtml(a.excerpt) + '</span>' +
            '</span>' +
            '<span class="arrow-link__arrow article-preview__arrow" aria-hidden="true">&#8594;</span>' +
          '</a>'
        );
      }).join('');
    } else {
      listEl.innerHTML = items.map(function (a) {
        return (
          '<a class="article-row" href="' + base + escapeHtml(a.href) + '">' +
            '<span class="article-row__meta">' + escapeHtml(a.category) + '</span>' +
            '<span class="article-row__body">' +
              '<span class="article-row__title">' + escapeHtml(a.title) + '</span>' +
              '<span class="article-row__excerpt">' + escapeHtml(a.excerpt) + '</span>' +
            '</span>' +
            '<span class="arrow-link article-row__cta">Leer artículo <span class="arrow-link__arrow">&#8594;</span></span>' +
          '</a>'
        );
      }).join('');
    }
  } catch (error) {
    console.error('Error cargando artículos (window.ARTICLES_DATA):', error);
    listEl.innerHTML = '<div class="news-error">No se pudo cargar el listado de artículos.</div>';
  }
})();
