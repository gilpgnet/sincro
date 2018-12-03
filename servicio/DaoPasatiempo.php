<?php
require_once "conecta.php";
require_once "conexion.php";
class DaoPasatiempo {
  public static function lista() {
    $con->query(
      "SELECT PAS_UUID AS uuid, PAS_NOMBRE AS nombre,
      PAS_MODIFICACION AS modificacion, REF_ELIMINADO AS eliminado
    FROM PASATIEMPO
    WHERE REF_ELIMINADO = 0");
    return $con->fetch_all();
  }
  public static function buscaId($uuid) {
    $con->query(
      "SELECT PAS_UUID AS uuid, PAS_NOMBRE AS nombre,
          PAS_MODIFICACION AS modificacion, PAS_ELIMINADO AS eliminado
        FROM PASATIEMPO
        WHERE PAS_UUID = ?",
      "s", $uuid);
    if ($obj = $con->fetch_object()) {
      return $obj;
    } else {
      return null;
    }
  }
  public static function agrega($modelo) {
    $con->execute(
      "INSERT INTO PASATIEMPO
        (PAS_UUID, PAS_NOMBRE, PAS_MODIFICACION, PAS_ELIMINADO)
      VALUES (?,?,?,?)",
      "ssii", $modelo->uuid, $modelo->nombre, $modelo->modificacion,
      $modelo->eliminado);
  }
  public static function modifica($modelo) {
    $con->execute(
      "UPDATE PASATIEMPO
      SET PAS_NOMBRE = ?,
        PAS_MODIFICACION = ?,
        PAS_ELIMINADO = ?
      WHERE PAS_UUID = ?",
      "siis", $modelo->nombre, $modelo->modificacion, $modelo->eliminado,
      $modelo->uuid);
  }
}