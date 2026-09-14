#requires -version 5
<#
  Purga del portfolio personal heredado dentro de "pagina andres".
  Generado por Claude tras revisar referencias reales en HTML/CSS/JS/JSON.
  Cada carpeta/archivo de esta lista fue verificado como NO utilizado por
  la web actual de Andrés antes de incluirlo acá.

  Este proyecto es un repo git: si algo se borra por error, se recupera con
  "git checkout -- <ruta>" (antes de hacer commit) o desde el historial.

  Uso: hacer doble clic con botón derecho -> "Ejecutar con PowerShell",
  o abrir PowerShell en esta carpeta y correr:  .\purgar_portfolio_anterior.ps1
#>

$root = $PSScriptRoot

$dirs = @(
    "de",
    "en",
    "proyectos",
    "traducciones",
    "articulos\autocensura-y-nueva-lengua",
    "img\proyectos\abuelas",
    "img\proyectos\camila-perochena"
)

$files = @(
    "img\proyectos\andres-rieznik\tiktok.png",
    "img\proyectos\andres-rieznik\youtube.png",
    "img\andy.png",
    "img\fondo.webp",
    "img\hero.webp",
    "img\favicon.png",
    "img\enseñar.webp",
    "assets\css\proyecto.css",
    "assets\css\articulo.css"
)

Write-Host "Este script se va a ejecutar dentro de: $root" -ForegroundColor Cyan
Write-Host ""
Write-Host "Carpetas a eliminar:" -ForegroundColor Yellow
$dirs | ForEach-Object { Write-Host "  - $_" }
Write-Host ""
Write-Host "Archivos a eliminar:" -ForegroundColor Yellow
$files | ForEach-Object { Write-Host "  - $_" }
Write-Host ""
$confirm = Read-Host "Escribi SI para confirmar la eliminacion"
if ($confirm -ne "SI") {
    Write-Host "Cancelado. No se borro nada." -ForegroundColor Red
    exit
}

Write-Host ""
foreach ($d in $dirs) {
    $full = Join-Path $root $d
    if (Test-Path $full) {
        try {
            Remove-Item -LiteralPath $full -Recurse -Force -ErrorAction Stop
            Write-Host "OK   carpeta eliminada: $d" -ForegroundColor Green
        } catch {
            Write-Host "ERROR eliminando carpeta $d : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "SKIP (no existe): $d" -ForegroundColor DarkGray
    }
}

foreach ($f in $files) {
    $full = Join-Path $root $f
    if (Test-Path $full) {
        try {
            Remove-Item -LiteralPath $full -Force -ErrorAction Stop
            Write-Host "OK   archivo eliminado: $f" -ForegroundColor Green
        } catch {
            Write-Host "ERROR eliminando archivo $f : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "SKIP (no existe): $f" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Listo. Revisa arriba si hubo algun ERROR." -ForegroundColor Cyan
Read-Host "Presiona Enter para cerrar"
