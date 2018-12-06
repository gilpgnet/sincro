export function muestraError(e) {
  console.error(e);
  alert(e.message);
}
export function eh(texto) {
  let div = document.createElement('div');
  div.innerText = texto;
  return div.innerHTML;
}
export async function procesa(promise) {
  try {
    await promise;
    document.location = "index.html";
  } catch (e) {
    muestraError(e)
  }
}
export async function fetchJson(url, datos) {
  const respuestaHttp = await fetch(url, datos);
  if (respuestaHttp.ok) {
    const respuesta = await respuestaHttp.json();
    if (respuesta.error) {
      throw new Error(respuesta.error);
    } else {
      return respuesta;
    }
  } else {
    throw new Error(respuestaHttp.statusText);
  }
}
export async function execute(conexionBd, entidades, funcion) {
  const conexion = await conexionBd;
  return new Promise((resolve, reject) => {
    // Inicia una transacción de lectura y escritura sobre el store.
    const tx = conexion.transaction(entidades, "readwrite");
    // Al terminar exitosamente hace resolve.
    tx.oncomplete = resolve;
    // Al terminar con error hace reject.
    tx.onerror = evt => reject(evt.target.error);
    // Estas son las operaciones de la transacción.
    funcion(tx);
  });
}
export async function query(conexionBd, entidades, funcion) {
  const conexion = await conexionBd;
  return new Promise((resolve, reject) => {
    // Inicia una transacción de solo lectura.
    const tx = conexion.transaction(entidades, "readonly");
    // Al terminar con error hace reject.
    tx.onerror = evt => reject(evt.target.error);
    // Estas son las operaciones de la transacción.
    funcion(tx, resolve);
  });
}
export async function registraServiceWorker() {
  /* Registra un service worker para instalar la aplicación en el caché del navegador. */
  if ("serviceWorker" in navigator) {
    try {
      const registro = await navigator.serviceWorker.register("sw.js");
      console.log("Service Worker registrado.");
      console.log(registro);
    } catch (e) {
      muestraError(e);
    }
  }
}