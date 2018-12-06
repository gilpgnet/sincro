/* ESTE ARCHIVO SIEMPRE DEBE ESTAR EN LA RAÍZ DE LA APLICACIÓN.
 * Cuando modifiques algún archivo, ponle un valor siempre diferente a
 * CACHE_SINCRO. */
"use strict";
const CACHE_SINCRO = "Sincro-1";
// Archivos requeridos para que la aplicación funcione fuera de línea.
const ARCHIVOS = [
  "css/estilos.css",
  "img/sincro_2048.png",
  "js/lib/conecta.js",
  "js/lib/DaoPasatiempo.js",
  "js/lib/util.js",
  "js/ctrlPasatiempo.js",
  "js/ctrlPasatiempoNuevo.js",
  "js/ctrlPasatiempos.js",
  "favicon.ico",
  'index.html',
  "manifest.json",
  'pasatiempo.html',
  'pasatiempoNuevo.html',
  '/'
];
self.addEventListener("install", evt => {
  console.log("Service Worker instalado.");
  // Realiza la instalación: carga los archivos requeridos en la caché.
  evt.waitUntil(
      // Añade todas las dependencias fuera de línea al caché.
      caches.open(CACHE_SINCRO)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(console.log("Cache cargado: " + CACHE_SINCRO))
      .catch(console.error));
});
// Toma de la caché archivos solicitados. Los otros son descargados.
self.addEventListener("fetch", evt => {
  if (evt.request.method === "GET") {
    evt.respondWith(caches.open(CACHE_SINCRO)
        .then(cache => cache.match(evt.request))
        .then(response => response || fetch(evt.request))
        .catch(console.error));
  }
});
self.addEventListener("activate", () => console.log("Service Worker activo."));