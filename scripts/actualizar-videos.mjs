// Actualiza assets/data/latest-videos.json con los últimos videos del canal
// de YouTube de Andrés Rieznik, leyendo el feed RSS público del canal.
// Sin API de YouTube, sin claves, sin dependencias (solo Node 18+).
//
// Lo ejecuta el workflow .github/workflows/actualizar-videos.yml, pero se
// puede correr a mano:  node scripts/actualizar-videos.mjs

import { writeFile } from 'node:fs/promises';

const CHANNEL_ID = 'UCy4ZbwwhC5hnFH5QjXRnWZg'; // @AndresRieznikVideos
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUT = new URL('../assets/data/latest-videos.json', import.meta.url);

// El feed mezcla videos y Shorts. Poné true para incluir también los Shorts.
const INCLUIR_SHORTS = false;
// Cuántos videos se guardan (la página muestra los 3 primeros).
const MAXIMO = 6;

const decodificar = (s) => s
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'sitio-andres-rieznik-actualizador' } });
if (!res.ok) throw new Error(`El feed respondió ${res.status}`);
const xml = await res.text();

const videos = [...xml.matchAll(/<entry>[\s\S]*?<\/entry>/g)]
  .map(([e]) => ({
    id: e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1],
    title: decodificar(e.match(/<title>(.*?)<\/title>/)?.[1] ?? ''),
    published: e.match(/<published>(.*?)<\/published>/)?.[1],
    url: e.match(/<link rel="alternate" href="(.*?)"/)?.[1],
  }))
  .filter((v) => v.id && v.title && v.published && v.url)
  .filter((v) => INCLUIR_SHORTS || !v.url.includes('/shorts/'))
  .slice(0, MAXIMO);

// Si el feed viene vacío o roto, NO se pisa el JSON anterior.
if (videos.length < 3) throw new Error(`Solo se encontraron ${videos.length} videos; no se actualiza.`);

await writeFile(OUT, JSON.stringify({ channel: 'https://www.youtube.com/@AndresRieznikVideos', videos }, null, 2) + '\n');
console.log(`OK: ${videos.length} videos. Último: ${videos[0].title}`);
