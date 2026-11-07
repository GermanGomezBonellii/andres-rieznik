/* Cartel "Último video" de la home: toma el video más reciente de
   assets/data/latest-videos.js (window.LATEST_VIDEOS, que actualiza solo el
   workflow .github/workflows/actualizar-videos.yml) y arma un cartel igual al
   del libro. Si no hay datos, el cartel queda oculto. */
(function () {
  var cont = document.querySelector('[data-latest-video]');
  var data = window.LATEST_VIDEOS;
  var v = data && data.videos && data.videos[0];
  if (!cont || !v) return;

  var locale = cont.getAttribute('data-locale') || 'es-AR';
  var eyebrow = cont.getAttribute('data-eyebrow') || 'Último video';
  var cta = cont.getAttribute('data-cta') || 'Ver en YouTube';
  var id = encodeURIComponent(v.id);

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto) n.textContent = texto;
    return n;
  }

  // Miniatura clickeable (16:9) con botón de play.
  var media = el('div', 'feature__media');
  var enlace = el('a', 'media media--16-9 project-feature__media video-thumb');
  enlace.href = 'https://www.youtube.com/watch?v=' + id;
  enlace.target = '_blank';
  enlace.rel = 'noopener noreferrer';
  enlace.setAttribute('aria-label', cta + ': ' + v.title);
  var img = el('img', 'project-feature__thumb');
  img.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
  img.alt = '';
  img.loading = 'lazy';
  img.onerror = function () {
    img.onerror = null;
    img.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
  };
  var play = el('span', 'project-feature__play');
  play.setAttribute('aria-hidden', 'true');
  enlace.appendChild(img);
  enlace.appendChild(play);
  media.appendChild(enlace);

  // Texto.
  var content = el('div', 'feature__content');
  content.appendChild(el('span', 'eyebrow', eyebrow));
  content.appendChild(el('h2', 'feature__title', v.title));
  var d = new Date(v.published);
  if (!isNaN(d)) {
    content.appendChild(el('p', 'feature__excerpt', d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })));
  }
  var link = el('a', 'arrow-link', cta + ' ');
  link.href = enlace.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  var flecha = el('span', 'arrow-link__arrow', '↗');
  flecha.setAttribute('aria-hidden', 'true');
  link.appendChild(flecha);
  content.appendChild(link);

  cont.textContent = '';
  cont.appendChild(media);
  cont.appendChild(content);
  cont.hidden = false;
})();
