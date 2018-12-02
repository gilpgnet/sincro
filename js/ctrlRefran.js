import { muestraError } from "./lib/util.js";
import { Dao } from "./lib/dao.js";
const parametros = new URLSearchParams(location.search);
const id = parametros.get("id");
const vista = document.vista;
vista.addEventListener("submit", guarda);
vista.elimina.addEventListener("click", elimina);
Dao.busca("Refran", id)
  .then(modelo => {
    document.title = modelo.texto;
    vista.titulo.value = modelo.texto;
    vista.texto.value = modelo.texto;
  })
  .catch(muestraError);
function guarda() {
  const texto = vista.texto.value.trim();
  const modelo = { id: id, texto: texto };
  ej(Dao.modifica("Refran", modelo));
}
function elimina() {
  ej(Dao.elimina("Refran", id));
}
function ej(promise) {
  promise
    .then(() => window.location = "index.html")
    .catch(muestraError);
}