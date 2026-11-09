/* ==========================================================================
   EVENTOS DE ANALÍTICA (Umami) — un único listener de clicks que clasifica
   cada click y lo registra con nombre y propiedades, sin tocar el HTML de
   cada botón. Qué mide (verlo en Umami → Events):
     contacto_email, contacto_linkedin, red_social {red}
     libro_ver {libro}, libro_comprar {libro}
     video_click {video, seccion}
     articulo_click {articulo}, paper_doi {paper}
     noticia_click {noticia, categoria}
     kalulu_click {destino, texto}
     descarga {archivo}
     cta_hero {boton}, cambio_idioma {idioma}
     enlace_externo {destino}   (cualquier otro link que salga del sitio)
   Si Umami no cargó (bloqueador, sin red) no hace nada.
   ========================================================================== */
(function () {
  function send(name, data) {
    try { if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, data || {}); } catch (e) { /* ignorar */ }
  }
  function txt(el) { return (el && (el.getAttribute('aria-label') || el.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 100); }
  function host(a) { try { return new URL(a.href, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function inside(el, sel) { return el.closest(sel); }
  function titleOf(box, sels) {
    if (!box) return '';
    for (var i = 0; i < sels.length; i++) { var t = box.querySelector(sels[i]); if (t) return txt(t); }
    return '';
  }

  document.addEventListener('click', function (e) {
    // Click en la tapa de un libro (abre el detalle): interés por libro.
    var cover = e.target.closest('.book-card__cover');
    if (cover && !e.target.closest('.book-card__cta')) {
      var bk = cover.closest('.book-card');
      if (bk) send('libro_ver', { libro: bk.getAttribute('data-book') || '' });
      return;
    }

    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var h = host(a);
    var external = h && h !== location.hostname;

    if (/^mailto:/i.test(href)) return send('contacto_email');
    if (/linkedin\.com/i.test(h)) return send('contacto_linkedin');

    if (inside(a, '.book-card__cta')) {
      var book = a.closest('.book-card');
      return send('libro_comprar', { libro: book ? book.getAttribute('data-book') || '' : '' });
    }
    if (inside(a, '.paper-card__doi')) {
      return send('paper_doi', { paper: titleOf(a.closest('.paper-card'), ['.paper-card__title']) });
    }
    if (inside(a, '.article-row, .article-preview')) {
      return send('articulo_click', { articulo: titleOf(a, ['.article-row__title', '.article-preview__title']) });
    }
    if (inside(a, '.news-card')) {
      return send('noticia_click', { noticia: titleOf(a, ['.news-card__title']), categoria: titleOf(a, ['.news-card__category']) });
    }
    if (/youtube\.com|youtu\.be/i.test(h) || inside(a, '.video-thumb, .video-featured, .feature--video')) {
      var seccion = inside(a, '.videos-latest, .feature--video') ? 'ultimos' : inside(a, '.videos-featured') ? 'destacados' : inside(a, '.videos-series') ? 'serie' : 'otro';
      var t = titleOf(a, ['.video-featured__title', '.video-card__title']) || (a.querySelector('img') ? a.querySelector('img').alt : '') || txt(a);
      return send('video_click', { video: t.replace(/^(Miniatura|YouTube thumbnail|Miniatura do YouTube)[^—]*—\s*/i, ''), seccion: seccion });
    }
    if (/\.pdf($|\?)/i.test(href)) return send('descarga', { archivo: href.split('/').pop().split('?')[0] });
    if (/kalulu/i.test(h) || /kalulu/i.test(href) || inside(a, '.kalulu-action, .kalulu-band')) {
      return send('kalulu_click', { destino: h || 'interno', texto: txt(a) });
    }
    if (inside(a, '.language-switcher')) return send('cambio_idioma', { idioma: txt(a) });
    if (inside(a, '.hero__actions')) return send('cta_hero', { boton: txt(a) });
    if (inside(a, '#contacto, .contact-columns') && external) {
      return send('red_social', { red: h.replace(/\.(com|io)$/, '') });
    }
    if (external) send('enlace_externo', { destino: h });
  }, true);
})();
