/* Últimas novedades de YouTube: pinta los 3 videos más recientes a partir de
   assets/data/latest-videos.json (lo actualiza solo el workflow
   .github/workflows/actualizar-videos.yml leyendo el feed RSS del canal).
   Uso: <div data-latest-videos data-src="../assets/data/latest-videos.json"
        data-limit="3" data-locale="es-AR" data-cta="Ver en YouTube"></div> */
(function () {
  var cont = document.querySelector('[data-latest-videos]');
  if (!cont) return;

  var limite = parseInt(cont.getAttribute('data-limit'), 10) || 3;
  var locale = cont.getAttribute('data-locale') || 'es-AR';
  var cta = cont.getAttribute('data-cta') || 'Ver en YouTube';

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto) n.textContent = texto;
    return n;
  }

  function fecha(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function tarjeta(v) {
    var a = el('a', 'video-featured video-thumb');
    a.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    var media = el('div', 'media media--16-9 project-feature__media');
    var img = el('img', 'project-feature__thumb');
    img.src = 'https://img.youtube.com/vi/' + encodeURIComponent(v.id) + '/maxresdefault.jpg';
    img.alt = 'Miniatura de YouTube — ' + v.title;
    img.loading = 'lazy';
    img.onerror = function () {
      img.onerror = null;
      img.src = 'https://img.youtube.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg';
    };
    media.appendChild(img);
    media.appendChild(el('span', 'project-feature__play'));
    media.lastChild.setAttribute('aria-hidden', 'true');
    a.appendChild(media);

    a.appendChild(el('span', 'video-featured__title', v.title));
    var f = fecha(v.published);
    if (f) a.appendChild(el('span', 'video-featured__meta', f));
    var link = el('span', 'arrow-link', cta + ' ');
    var flecha = el('span', 'arrow-link__arrow', '↗');
    flecha.setAttribute('aria-hidden', 'true');
    link.appendChild(flecha);
    a.appendChild(link);
    return a;
  }

  fetch(cont.getAttribute('data-src'), { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var videos = (data.videos || []).slice(0, limite);
      if (!videos.length) throw new Error('sin videos');
      cont.textContent = '';
      videos.forEach(function (v) { cont.appendChild(tarjeta(v)); });
    })
    .catch(function () {
      // Si falla la carga se oculta la sección entera: nada de huecos vacíos.
      var seccion = cont.closest('section');
      if (seccion) seccion.hidden = true;
    });
})();
