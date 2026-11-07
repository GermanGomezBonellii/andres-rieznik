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

  // Mismo switch mínimo por <html lang> que noticias.js/papers.js/books.js:
  // solo los textos de interfaz de este archivo, sin duplicarlo para /en/.
  var isEN = document.documentElement.lang === 'en';
  var isPT = document.documentElement.lang.indexOf('pt') === 0;
  var L = isEN ? {
    empty: 'No articles published yet.',
    error: 'The list of articles could not be loaded.',
    readArticle: 'Read article'
  } : isPT ? {
    empty: 'Ainda não há artigos publicados.',
    error: 'Não foi possível carregar a lista de artigos.',
    readArticle: 'Ler artigo'
  } : {
    empty: 'Todavía no hay artículos publicados.',
    error: 'No se pudo cargar el listado de artículos.',
    readArticle: 'Leer artículo'
  };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var me = document.querySelector('script[src*="articles.js"]');
  var siteRoot = new URL('../../', me ? me.src : location.href).href;
  var dataUrl = new URL('data/articulos.json', siteRoot).href;

  // Destino de cada artículo: link externo (url), PDF subido desde el panel
  // (pdf, ruta desde la raíz del sitio) o página propia (href, relativa a articulos/).
  function linkOf(a) {
    if (a.url) return { href: a.url, ext: true };
    if (a.pdf) return { href: siteRoot + a.pdf, ext: true };
    return { href: base + a.href, ext: false };
  }
  function attrs(l) { return 'href="' + escapeHtml(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener noreferrer"' : ''); }

  fetch(dataUrl, { cache: 'no-cache' }).then(function (res) {
    if (!res.ok) throw new Error('Respuesta ' + res.status);
    return res.json();
  }).then(function (articles) {
    articles = (Array.isArray(articles) ? articles : [])
      .filter(function (a) { return a.active !== false; })
      .sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });

    if (!Array.isArray(articles) || !articles.length) {
      listEl.innerHTML = '<div class="news-empty">' + L.empty + '</div>';
      return;
    }

    var items = limit ? articles.slice(0, limit) : articles;

    if (variant === 'preview') {
      listEl.innerHTML = items.map(function (a) {
        return (
          '<a class="article-preview" ' + attrs(linkOf(a)) + '>' +
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
          '<a class="article-row" ' + attrs(linkOf(a)) + '>' +
            '<span class="article-row__meta">' + escapeHtml(a.category) + '</span>' +
            '<span class="article-row__body">' +
              '<span class="article-row__title">' + escapeHtml(a.title) + '</span>' +
              '<span class="article-row__excerpt">' + escapeHtml(a.excerpt) + '</span>' +
            '</span>' +
            '<span class="arrow-link article-row__cta">' + L.readArticle + ' <span class="arrow-link__arrow">&#8594;</span></span>' +
          '</a>'
        );
      }).join('');
    }
  }).catch(function (error) {
    console.error('Error cargando artículos (' + dataUrl + '):', error);
    listEl.innerHTML = '<div class="news-error">' + L.error + '</div>';
  });
})();
