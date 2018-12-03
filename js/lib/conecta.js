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
 * limitations under the License. */
export const con = new Promise((resolve, reject) => {
  const BD_NOMBRE = "sincro";
  const BD_VERSION = 1;
  const ENTIDAD = "Pasatiempo";
  const solicitud = indexedDB.open(BD_NOMBRE, BD_VERSION);
  solicitud.onerror = evt => reject(evt.target.error);
  // Al crear la base o hacerle cambios hay que crear las tablas.
  solicitud.onupgradeneeded = evt => {
    const conexion = evt.target.result;
    /* Automáticamente se inicia una transacción para el cambio de versión.
     * Como hay cambio de versión, borra el almacén si  existe. */
    if (conexion.objectStoreNames.contains(ENTIDAD)) {
      conexion.deleteObjectStore(ENTIDAD);
    }
    // Crea el almacén "Pasatiempo" con el campo llave "uuid".
    conexion.createObjectStore(ENTIDAD, { keyPath: "uuid" });
  };
  // Función al abrir la base.
  solicitud.onsuccess = evt => resolve(evt.target.result);
});