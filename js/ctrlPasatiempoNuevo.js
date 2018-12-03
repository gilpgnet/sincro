import { muestraError } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
const vista = document.vista;
vista.addEventListener("submit", guarda);
async function guarda() {
  try {
    const nombre = vista.nombre.value.trim();
    const modelo = { nombre };
    await DaoPasatiempo.agrega(modelo);
    document.location = "index.html";
  } catch (e) {
    muestraError(e)
  }
}