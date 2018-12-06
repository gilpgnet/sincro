import { registraServiceWorker, fetchJson, muestraError, eh } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
import { con } from "./lib/conecta.js";
registraServiceWorker();
const dao = new DaoPasatiempo("Pasatiempo", con);
const ul = document.querySelector("ul");
carga();
// Sincroniza cada 20 segundos.
setInterval(() => sincroniza(), 20000);
async function carga() {
  try {
    const lista = await dao.lista();
    muestraLista(lista);
    sincroniza();
  } catch (e) {
    muestraError(e);
  }
}
async function sincroniza() {
  try {
    const sincro = await fetchJson(
      "servicio/sincro.php?XDEBUG_SESSION_START=name",
      {
        method: "POST",
        body: JSON.stringify(await dao.listaTodos())
      });
    const listaSincronizada = sincro.lista || [];
    await dao.reemplaza(listaSincronizada);
    muestraLista(listaSincronizada);
  } catch (e) {
    muestraError(e);
  }
}
function muestraLista(lista) {
  let contenido = "";
  for (const modelo of lista) {
    contenido +=
      `<li>
          <a href="pasatiempo.html?uuid=${encodeURIComponent(modelo.uuid)}">
            ${eh(modelo.nombre)}
          </a>
        </li>`;
  }
  ul.innerHTML = contenido;
}