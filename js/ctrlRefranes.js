import { muestraError } from "./lib/util.js";
import { Dao } from "./lib/dao.js";
const ul = document.querySelector("ul");
const template = document.querySelector("template");
Dao.observa("Refran",
  lista => {
    ul.innerHTML = "";
    for (const modelo of lista) {
      const copia = document.importNode(template.content, true);
      const a = copia.querySelector("a");
      a.href = "refran.html?id=" + encodeURIComponent(modelo.id);
      a.textContent = modelo.texto;
      ul.appendChild(copia);
    }
  },
  muestraError);