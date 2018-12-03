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
import { query, execute } from "./util.js";
export class DaoPasatiempo {
  constructor(entidad, con) {
    this.entidad = entidad;
    this.con = con;
  }
  /** Lista todos los objetos que no tienen borrado lógico. */
  async lista() {
    return query(this.con, [this.entidad], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(this.entidad).openCursor().onsuccess = evt => {
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
  async listaTodos() {
    return query(this.con, [this.entidad], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(this.entidad).openCursor().onsuccess = evt => {
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
  async buscaId(uuid) {
    return query(this.con, [this.entidad], (tx, resolve) =>
      tx.objectStore(this.entidad).get(uuid).onsuccess =
      evt => resolve(evt.target.result));
  }
  /** Agrega un objeto a una entidad de la base de datos.
   * @param {*} modelo objeto que se agrega a la base de datos.
   * @returns {Promise<void>} que indica cuando termina de agregar a la
   *  base de datos. */
  async agrega(modelo) {
    return execute(this.con, [this.entidad], tx => {
      modelo.modificacion = Date.now();
      modelo.eliminado = 0;
      tx.objectStore(this.entidad).add(modelo);
    });
  }
  async modifica(modelo) {
    return execute(this.con, [this.entidad], tx => {
      modelo.modificacion = Date.now();
      tx.objectStore(this.entidad).put(modelo);
    });
  }
  async elimina(id) {
    const modelo = await this.buscaId(id);
    if (modelo !== null) {
      modelo.eliminado = 1;
      return this.modifica(modelo);
    } else {
      return null;
    }
  }
  /** Borra el contenido del almacén y guarda el contenido del listado.
   * @param {Array<any>} lista nuevos datos. */
  async reemplaza(lista) {
    return execute(this.con, [this.entidad], tx => {
      const store = tx.objectStore(this.entidad);
      store.clear();
      for (const modelo of lista) {
        store.add(modelo);
      }
    });
  }
}