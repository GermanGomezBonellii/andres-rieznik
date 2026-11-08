/* NOTICIAS — lee data/noticias.json (administrado desde /admin/) y renderiza
   el tablón y la preview de la home (cambia solo data-news-limit). */

(function () {
  var listEl = document.querySelector('[data-news-list]');
  var filtersEl = document.querySelector('[data-news-filters]');
  if (!listEl) return;

  // Textos de interfaz (no el contenido de Supabase, que sigue mostrándose
  // tal cual venga): switch mínimo por idioma según <html lang>, agregado
  // para la versión /en/ sin duplicar este archivo ni tocar la lógica de
  // fetch/filtrado. Con lang="es" el comportamiento es idéntico al de antes.
  var isEN = document.documentElement.lang === 'en';
  var isPT = document.documentElement.lang.indexOf('pt') === 0;
  var L = isEN ? {
    notConfigured: 'This section is not connected to Supabase yet. Fill in <code>assets/js/supabase-config.js</code> with the project URL and anon key (the <code>andres_noticias</code> table already exists in Supabase) so the board shows up here.',
    empty: 'No updates in this category yet.',
    loading: 'Loading updates…',
    error: 'Updates could not be loaded. Please try again later.',
    pinned: 'Featured',
    viewMore: 'View more',
    all: 'All'
  } : isPT ? {
    notConfigured: 'Esta seção ainda não está conectada ao Supabase. Preencha <code>assets/js/supabase-config.js</code> com a URL e a anon key do projeto (a tabela <code>andres_noticias</code> já existe no Supabase) para que o mural apareça aqui.',
    empty: 'Não há novidades nesta categoria por enquanto.',
    loading: 'Carregando novidades…',
    error: 'Não foi possível carregar as novidades. Tente novamente mais tarde.',
    pinned: 'Destaque',
    viewMore: 'Ver mais',
    all: 'Todas'
  } : {
    notConfigured: 'Esta sección todavía no está conectada a Supabase. Completá <code>assets/js/supabase-config.js</code> con la URL y la anon key del proyecto (la tabla <code>andres_noticias</code> ya existe en Supabase) para que el tablón se muestre acá.',
    empty: 'No hay novedades en esta categoría por ahora.',
    loading: 'Cargando novedades…',
    error: 'No se pudieron cargar las novedades. Intentá más tarde.',
    pinned: 'Destacado',
    viewMore: 'Ver más',
    all: 'Todas'
  };

  // Los datos viven en data/noticias.json (se editan desde /admin/, sin base
  // de datos). La ruta se resuelve a partir de este mismo script para que
  // funcione igual desde /, /en/ y /pt/.
  var me = document.querySelector('script[src*="noticias.js"]');
  var endpoint = new URL('../../data/noticias.json', me ? me.src : location.href).href;

  // En la home (preview con data-news-limit) la sección entera queda oculta
  // hasta que haya noticias publicadas; si no hay ninguna, no se muestra.
  var previewSection = listEl.hasAttribute('data-news-limit') ? listEl.closest('section') : null;
  if (previewSection) previewSection.hidden = true;

  var allItems = [];
  var activeCategory = 'todas';

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      var d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString(isEN ? 'en-US' : isPT ? 'pt-BR' : 'es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function render() {
    var items = allItems.filter(function (item) {
      return activeCategory === 'todas' || item.category === activeCategory;
    });

    var limit = parseInt(listEl.getAttribute('data-news-limit'), 10);
    if (limit) items = items.slice(0, limit);

    if (!items.length) {
      listEl.innerHTML = '<div class="news-empty">' + L.empty + '</div>';
      return;
    }

    listEl.innerHTML = items.map(function (item) {
      var hasMedia = !!item.image_url;
      var hasUrl = !!item.url;

      // Categoría y fecha van juntas arriba (metadata discreta); "Destacado"
      // es un badge aparte, no reemplaza a la categoría como antes.
      var metaParts = [];
      if (item.category) {
        metaParts.push('<span class="news-card__category">' + escapeHtml(item.category) + '</span>');
      }
      var dateStr = formatDate(item.date);
      if (dateStr) {
        metaParts.push('<span class="news-card__date">' + escapeHtml(dateStr) + '</span>');
      }
      var meta = metaParts.length
        ? '<span class="news-card__meta">' + metaParts.join('<span class="news-card__meta-sep" aria-hidden="true">·</span>') + '</span>'
        : '';
      var pinnedBadge = item.pinned ? '<span class="tag tag--pinned">' + L.pinned + '</span>' : '';
      var top = (meta || pinnedBadge) ? '<span class="news-card__top">' + meta + pinnedBadge + '</span>' : '';

      // La imagen es opcional: si no hay image_url, no se genera ningún
      // elemento .news-card__media (ni placeholder ni espacio reservado).
      var media = hasMedia
        ? '<span class="news-card__media"><img src="' + escapeHtml(item.image_url) + '" alt="" loading="lazy"></span>'
        : '';

      // El CTA solo aparece si hay url; si no, la tarjeta no es un link.
      var cta = hasUrl
        ? '<span class="arrow-link news-card__cta">' + L.viewMore + ' <span class="arrow-link__arrow">&#8599;</span></span>'
        : '';

      var body =
        '<span class="news-card__body">' +
          top +
          '<span class="news-card__title">' + escapeHtml(item.title) + '</span>' +
          (item.description ? '<span class="news-card__desc">' + escapeHtml(item.description) + '</span>' : '') +
          cta +
        '</span>';

      var cardClass = 'news-card ' + (hasMedia ? 'news-card--media' : 'news-card--no-media');
      var inner = body + media;

      return hasUrl
        ? '<a class="' + cardClass + '" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>'
        : '<article class="' + cardClass + '">' + inner + '</article>';
    }).join('');
  }

  function renderFilters() {
    if (!filtersEl) return;
    var categories = ['todas'];
    allItems.forEach(function (item) {
      if (item.category && categories.indexOf(item.category) === -1) categories.push(item.category);
    });
    if (categories.length <= 1) return;

    filtersEl.innerHTML = categories.map(function (cat) {
      return (
        '<button type="button" class="news-filter" data-category="' + escapeHtml(cat) + '" ' +
        'aria-pressed="' + (cat === activeCategory ? 'true' : 'false') + '">' +
        escapeHtml(cat === 'todas' ? L.all : cat) + '</button>'
      );
    }).join('');

    filtersEl.querySelectorAll('[data-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.getAttribute('data-category');
        filtersEl.querySelectorAll('[data-category]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        render();
      });
    });
  }

  listEl.innerHTML = '<div class="news-empty">' + L.loading + '</div>';

  fetch(endpoint, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('Respuesta ' + res.status);
      return res.json();
    })
    .then(function (data) {
      allItems = (Array.isArray(data) ? data : [])
        .filter(function (i) { return i.active !== false; })
        .sort(function (a, b) {
          if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
          return String(b.date || '').localeCompare(String(a.date || ''));
        });
      renderFilters();
      render();
      if (previewSection && allItems.length) previewSection.hidden = false;
    })
    .catch(function (err) {
      console.error('Error cargando noticias (' + endpoint + '):', err);
      listEl.innerHTML = '<div class="news-error">' + L.error + '</div>';
    });
})();
