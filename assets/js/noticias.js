/* ==========================================================================
   NOTICIAS — lee la tabla "andres_noticias" de Supabase vía REST (PostgREST)
   y renderiza el tablón (acá y en la preview de la home: misma tabla, mismo
   query, solo cambia data-news-limit). No usa el SDK de supabase-js (evita
   una dependencia extra sólo para un GET de lectura pública): un fetch
   simple con la anon key alcanza porque RLS permite lectura pública de
   filas con active = true.

   Requiere que assets/js/supabase-config.js defina SUPABASE_URL y
   SUPABASE_ANON_KEY reales (constantes globales, cargado antes que este
   script). Mientras no estén definidas, se muestra un estado explícito en
   vez de intentar pegarle a una URL inexistente.
   ========================================================================== */

(function () {
  var listEl = document.querySelector('[data-news-list]');
  var filtersEl = document.querySelector('[data-news-filters]');
  if (!listEl) return;

  var isConfigured =
    typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined' &&
    SUPABASE_URL && SUPABASE_ANON_KEY &&
    SUPABASE_URL.indexOf('TU-PROYECTO') === -1 &&
    SUPABASE_ANON_KEY.indexOf('TU-ANON-KEY') === -1;

  if (!isConfigured) {
    listEl.innerHTML =
      '<div class="news-empty">Esta sección todavía no está conectada a Supabase. ' +
      'Completá <code>assets/js/supabase-config.js</code> con la URL y la anon key ' +
      'del proyecto (la tabla <code>andres_noticias</code> ya existe en Supabase) ' +
      'para que el tablón se muestre acá.</div>';
    return;
  }

  var endpoint =
    SUPABASE_URL.replace(/\/$/, '') +
    '/rest/v1/andres_noticias?select=*&active=eq.true&order=pinned.desc,date.desc,sort_order.asc';

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
      return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
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
      listEl.innerHTML = '<div class="news-empty">No hay novedades en esta categoría por ahora.</div>';
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
      var pinnedBadge = item.pinned ? '<span class="tag tag--pinned">Destacado</span>' : '';
      var top = (meta || pinnedBadge) ? '<span class="news-card__top">' + meta + pinnedBadge + '</span>' : '';

      // La imagen es opcional: si no hay image_url, no se genera ningún
      // elemento .news-card__media (ni placeholder ni espacio reservado).
      var media = hasMedia
        ? '<span class="news-card__media"><img src="' + escapeHtml(item.image_url) + '" alt="" loading="lazy"></span>'
        : '';

      // El CTA solo aparece si hay url; si no, la tarjeta no es un link.
      var cta = hasUrl
        ? '<span class="arrow-link news-card__cta">Ver más <span class="arrow-link__arrow">&#8599;</span></span>'
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
        escapeHtml(cat === 'todas' ? 'Todas' : cat) + '</button>'
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

  listEl.innerHTML = '<div class="news-empty">Cargando novedades…</div>';

  fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
    },
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Supabase respondió ' + res.status);
      return res.json();
    })
    .then(function (data) {
      allItems = Array.isArray(data) ? data : [];
      renderFilters();
      render();
    })
    .catch(function (err) {
      console.error('Error cargando noticias (' + endpoint + '):', err);
      listEl.innerHTML =
        '<div class="news-error">No se pudieron cargar las novedades. Intentá más tarde.</div>';
    });
})();
