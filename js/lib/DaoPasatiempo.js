/* Copyright 2018 Gilberto Pacheco Gallegos.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Se encarga de la comunicación con la base de datos. Esconde los
 * detalles de implementación y realiza tareas repetitivas. */
import { con } from "./conecta.js";
import { query, update } from "./util.js";
const ENTIDAD = "Pasatiempo";
export class DaoPasatiempo {
  /** Lista todos los objetos que no tienen borrado lógico. */
  static async lista() {
    return query(con, [ENTIDAD], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(ENTIDAD).openCursor().onsuccess = evt => {
        const cursor = evt.target.result;
        if (cursor) {
          let modelo = cursor.value;
          if (!modelo.eliminado) {
            modelos.push(modelo);
          }
          cursor.continue();
        } else {
          resolve(modelos);
        }
      };
    });
  }
  /** Lista todos los objetos, incluyendo los que tienen borrado lógico. */
  static async listaTodos() {
    return query(con, [ENTIDAD], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(ENTIDAD).openCursor().onsuccess = evt => {
        const cursor = evt.target.result;
        if (cursor) {
          modelos.push(cursor.value);
          cursor.continue();
        } else {
          resolve(modelos);
        }
      };
    });
  }
  static async buscaId(uuid) {
    return query(con, [ENTIDAD], (tx, resolve) =>
      tx.objectStore(ENTIDAD).get(uuid).onsuccess =
      evt => resolve(evt.target.result));
  }
  /** Agrega un objeto a una entidad de la base de datos.
   * @param {*} modelo objeto que se agrega a la base de datos.
   * @returns {Promise<void>} que indica cuando termina de agregar a la
   *  base de datos. */
  static async agrega(modelo) {
    return execute(con, [ENTIDAD], tx => {
      modelo.modificacion = Date.now();
      modelo.eliminado = 0;
      tx.objectStore(ENTIDAD).add(modelo);
    });
  }
  static async modifica(modelo) {
    return execute(con, [ENTIDAD], tx => {
      modelo.modificacion = Date.now();
      tx.objectStore(ENTIDAD).put(modelo);
    });
  }
  static async elimina(id) {
    const modelo = await DaoPasatiempo.buscaId(id);
    if (modelo !== null) {
      modelo.eliminado = 1;
      return DaoPasatiempo.modifica(modelo);
    } else {
      return null;
    }
  }
  /** Borra el contenido del almacén y guarda el contenido del listado.
   * @param {Array<any>} lista nuevos datos. */
  static async reemplaza(lista) {
    return execute(con, [ENTIDAD], tx => {
      const store = tx.objectStore(entidad);
      store.clear();
      for (const modelo of lista) {
        store.add(modelo);
      }
    });
  }
}