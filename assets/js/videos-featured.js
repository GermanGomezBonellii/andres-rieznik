/* VIDEOS DESTACADOS — renderiza data/videos-destacados.json (editable desde
   /admin/). Si no se puede cargar, queda el HTML estático de la página. */
(function () {
  var grid = document.querySelector('[data-featured-videos]');
  if (!grid) return;
  var me = document.querySelector('script[src*="videos-featured.js"]');
  var url = new URL('../../data/videos-destacados.json', me ? me.src : location.href).href;
  var cta = grid.getAttribute('data-cta') || 'YouTube';
  var altPrefix = grid.getAttribute('data-alt') || 'YouTube';
  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ytId(u) {
    var m = /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/.exec(u || '');
    return m ? m[1] : '';
  }
  fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    var items = (Array.isArray(d) ? d : []).filter(function (v) { return v.active !== false && ytId(v.url); })
      .sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
    if (!items.length) return;
    grid.innerHTML = items.map(function (v) {
      var id = ytId(v.url);
      return '<a class="video-featured video-thumb" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="media media--16-9 project-feature__media">' +
        '<img class="project-feature__thumb" src="https://img.youtube.com/vi/' + id + '/maxresdefault.jpg" alt="' + esc(altPrefix + ' — ' + v.title) + '" loading="lazy" onerror="this.onerror=null;this.src=\'https://img.youtube.com/vi/' + id + '/hqdefault.jpg\'">' +
        '<span class="project-feature__play" aria-hidden="true"></span></div>' +
        '<span class="video-featured__title">' + esc(v.title) + '</span>' +
        '<span class="arrow-link">' + esc(cta) + ' <span class="arrow-link__arrow">&#8599;</span></span></a>';
    }).join('');
  }).catch(function (e) { console.error('Videos destacados:', e); });
})();
