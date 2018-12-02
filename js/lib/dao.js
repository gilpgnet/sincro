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
import bdSincroAbre from "./bdSincroAbre";
export class Dao {
  /** Lista todos los objetos que no tienen borrado lógico.
   * @param {String} entidad nombre de la entidad donde busca. */
  static async lista(entidad) {
    return txreadonly([entidad], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(entidad).openCursor().onsuccess = evt => {
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
  /** Lista todos los objetos, incluyendo los que tienen borrado lógico.
   * @param {String} entidad nombre de la entidad donde busca. */
  static async listaTodos(entidad) {
    return txreadonly([entidad], (tx, resolve) => {
      const modelos = [];
      tx.objectStore(entidad).openCursor().onsuccess = evt => {
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
  static async buscaId(entidad, id) {
    return txreadonly([entidad], (tx, resolve) => {
      tx.objectStore(entidad).get(id).onsuccess = evt => {
        const modelo = evt.target.result;
        if (modelo) {
          resolve(modelo);
        } else {
          resolve(null);
        }
      };
    });
  }
  /** Agrega un objeto a una entidad de la base de datos.
   * @param {String} entidad nombre de la entidad a la que se agrega el
   *  modelo. 
   * @param {*} modelo objeto que se agrega a la base de datos.
   * @returns {Promise<void>} que indica cuando termina de agregar a la
   *  base de datos. */
  static async agrega(entidad, modelo) {
    return txreadwrite([entidad], tx => {
      modelo.modificacion = Date.now();
      modelo.eliminado = 0;
      tx.objectStore(entidad).add(modelo);
    });
  }
  static async modifica(entidad, modelo) {
    return txreadwrite([entidad], tx => {
      modelo.modificacion = Date.now();
      tx.objectStore(entidad).put(modelo);
    });
  }
  static async elimina(entidad, id) {
    const modelo = await Dao.busca(entidad, id);
    if (modelo !== null) {
      modelo.eliminado = true;
      return Dao.modifica(entidad, modelo);
    } else {
      return null;
    }
  }
  /** Borra el contenido del almacén y guarda el contenido del listado.
   * @param {String} entidad nombre de la entidad a que se reemplaza. 
   * @param {Array<any>} lista nuevos datos. */
  static async reemplaza(entidad, lista) {
    return txreadwrite([entidad], tx => {
      const store = tx.objectStore(entidad);
      store.clear();
      for (const c of lista) {
        store.add(c);
      }
    });
  }
}
function txreadwrite(entidades, funcion) {
  const conexion = await bdSincroAbre;
  modelo.modificacion = Date.now();
  modelo.eliminado = 0;
  return new Promise((resolve, reject) => {
    // Inicia una transacción de lectura y escritura sobre el store.
    const tx = conexion.transaction(entidades, "readwrite");
    // Al terminar exitosamente hace resolve.
    tx.oncomplete = resolve;
    // Al terminar con error hace reject.
    tx.onerror = reject(evt.target.error);
    // Estas son las operaciones de la transacción.
    funcion(tx);
  });
}
function txreadonly(entidades, funcion) {
  const conexion = await bdSincroAbre;
  modelo.modificacion = Date.now();
  modelo.eliminado = 0;
  return new Promise((resolve, reject) => {
    // Inicia una transacción de solo lectura.
    const tx = conexion.transaction(entidades, "readonly");
    // Al terminar con error hace reject.
    tx.onerror = reject(evt.target.error);
    // Estas son las operaciones de la transacción.
    funcion(tx, resolve);
  });
}