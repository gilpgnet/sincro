import {muestraError} from "./lib/util.js";
import { Dao } from "./lib/dao.js";
const vista = document.vista;
vista.addEventListener("submit", guarda);
function guarda() {
  try {
    const texto = vista.texto.value.trim();
    const modelo = {texto: texto};
    Dao.agrega("Refran", modelo)
        .then(() => window.location = "index.html")
        .catch(muestraError);
  } catch (e) {
    muestraError(e)
  }
}