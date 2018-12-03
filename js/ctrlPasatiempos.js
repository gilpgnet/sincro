import { fetchJson, muestraError, eh } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
const ul = document.querySelector("ul");
carga();
// Sincroniza cada 20 segundos.
setInterval(() => this.sincroniza(), 20000);
async function carga() {
  try {
    const lista = await DaoPasatiempo.lista();
    muestraLista(lista);
  } catch (e) {
    muestraError(e);
  }
}
async function sincroniza() {
  try {
    const sincro = await fetchJson("servicio/sincro.php",
      {
        method: "POST",
        body: JSON.stringify(await DaoPasatiempo.listaTodos())
      });
    const listaSincronizada = sincro.lista || [];
    await DaoPasatiempo.reemplaza(listaSincronizada);
    muestraLista(listaSincronizada);
  } catch (e) {
    muestraError(e);
  }
}
function muestraLista(lista) {
  ul.innerHTML = "";
  for (const modelo of lista) {
    ul.innerHTML +=
      `<li>
          <a href="pasatiempo.html?uuid=${encodeURIComponent(modelo.uuid)}">
            ${eh(modelo.nombre)}
          </a>
        </li>`;
  }
}