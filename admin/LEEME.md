# Panel de administración (sin Supabase)

Abrir `https://<sitio>/admin/`. No hay servidor ni base de datos: el panel edita `data/*.json`
y sube imágenes a `img/uploads/` usando la API de GitHub. Cada guardado es un commit y
GitHub Pages republica en 1–2 minutos.

## Token
GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens:
- Repositorio: solo `GermanGomezBonellii/andres-rieznik`
- Permisos: Contents → Read and write, y Actions → Read and write (para el botón "Actualizar últimos videos")
- Se pega al ingresar; queda solo en la pestaña (sessionStorage).

## Agregar otra sección
Secciones actuales: Noticias, Artículos, Papers y Videos destacados. Sumar un objeto a `SECCIONES` en `admin/panel.js` y crear `data/<archivo>.json`.
