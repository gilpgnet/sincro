# sincro
Ejemplo de sincronización de bases de datos.

Puedes verlo funcionando en https://sincro.000webhostapp.com/.

Para entender mejor el código, se recomienda estudiar primero los proyectos https://github.com/gilpgnet/web1,
https://github.com/gilpgnet/web2 y https://github.com/gilpgnet/servicio.

Consta de dos partes:

- **Aplicación web progresiva (PWA)** que corre en un navegador web, pero se puede instalar en el dispositivo.
  Crea un acceso con ícono en la computadora. Usa la base de datos local del navegador web y puede trabajar sin conexión
  con el servidor.
- **Servicio de sincronización** al cual los clientes envían los datos que tienen almacenados en sus bases locales.
  Corre un algoritmo que permite igualar los datos locales con el servidor y devuelve al cliente la información que se debe
  almacenar en la base local.

## Ejecución
Para poder ejecutarse el código, primero han de crearse la base de datos, el usuario y la tabla con el script del archivo
[sql/create.sql](/sql/create.sql).

Modifica el archivo [servicio/conecta.php](/servicio/conecta.php) para usar la conexión de tu servidor.
