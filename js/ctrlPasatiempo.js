import { procesa, muestraError } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
const parametros = new URLSearchParams(location.search);
const uuid = parametros.get("uuid");
const vista = document.vista;
vista.addEventListener("submit", guarda);
vista.elimina.addEventListener("click", elimina);
carga();
async function carga() {
  try {
    const modelo = await DaoPasatiempo.buscaId(uuid);
    document.title = modelo.nombre;
    vista.titulo.value = modelo.nombre;
    vista.nombre.value = modelo.nombre;
  } catch (e) {
    muestraError(e);
  }
}
function guarda() {
  const nombre = vista.nombre.value.trim();
  const modelo = { uuid, nombre };
  procesa(DaoPasatiempo.modifica(modelo));
}
function elimina() {
  procesa(DaoPasatiempo.elimina(uuid));
}