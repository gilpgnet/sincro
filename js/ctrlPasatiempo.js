import { procesa, muestraError } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
import { con } from "./lib/conecta.js";
const dao = new DaoPasatiempo("Pasatiempo", con);
const parametros = new URLSearchParams(location.search);
const uuid = parametros.get("uuid");
const vista = document.vista;
vista.addEventListener("submit", guarda);
vista.elimina.addEventListener("click", elimina);
carga();
async function carga() {
  try {
    const modelo = await dao.buscaId(uuid);
    document.title = modelo.nombre;
    vista.titulo.value = modelo.nombre;
    vista.nombre.value = modelo.nombre;
  } catch (e) {
    muestraError(e);
  }
}
function guarda(evt) {
  evt.preventDefault();
  const nombre = vista.nombre.value.trim();
  const modelo = { uuid, nombre, eliminado: 0 };
  procesa(dao.modifica(modelo));
}
function elimina() {
  procesa(dao.elimina(uuid));
}