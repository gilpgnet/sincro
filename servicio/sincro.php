<?php
mb_internal_encoding("UTF-8");
require_once "util.php";
require_once "DaoPasatiempo.php";
require_once "conecta.php";
$respuesta = new stdClass();
try {
  $con->verifica();
  $dao = new DaoPasatiempo($con);
  $lista = \json_decode(file_get_contents('php://input'));
  if (!$lista) {
    $lista = [];
  }
  foreach ($lista as $modelo_cliente) {
    $modelo_servidor = $dao->buscaId($modelo_cliente->uuid);
    if ($modelo_servidor) {
      if (!$modelo_servidor->eliminado && $modelo_cliente->eliminado) {
        /* CONFLICTO. El registro está en el servidor, donde no se ha eliminado,
         * pero ha sido eliminado en el cliente. Gana el cliente, porque optamos
         * por no revivir lo que se ha borrado. */
        $dao->modifica($modelo_cliente);
      } else if (!$modelo_cliente->eliminado && !$modelo_servidor->eliminado) {
        /* CONFLICTO. El registro está tanto en el servidor como en el
         * cliente. Los datos pueden ser diferentes. PREVALECE LA FECHA MÁS
         * GRANDE. Cuando gana el servidor no se hace nada. */
        if ($modelo_cliente->modificacion > $modelo_servidor->modificacion) {
          // La versión del cliente es más nueva y prevalece.
          $dao->modifica($modelo_cliente);
        }
      }
    } else {
      /* CONFLICTO. El objeto no ha estado en el servidor. AGREGARLO solamente
       * si no está eliminado. */
      if (!$modelo_cliente->eliminado) {
        $dao->agrega($modelo_cliente);
      }
    }
  }
  $respuesta->lista = $dao->lista();
} catch (Exception $e) {
  $respuesta->error = $e->getMessage();
}
devuelve($respuesta);