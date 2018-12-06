import { registraServiceWorker, muestraError } from "./lib/util.js";
import { DaoPasatiempo } from "./lib/DaoPasatiempo.js";
import { con } from "./lib/conecta.js";
registraServiceWorker();
const dao = new DaoPasatiempo("Pasatiempo", con);
const vista = document.vista;
let uuid = 0;
vista.addEventListener("submit", guarda);
async function guarda(evt) {
  try {
    evt.preventDefault();
    const nombre = vista.nombre.value.trim();
    const modelo = {
      uuid: Date.now().toString() + Math.random() + uuid++,
      nombre
    };
    await dao.agrega(modelo);
    document.location = "index.html";
  } catch (e) {
    muestraError(e)
  }
}