<?php
class DaoPasatiempo {
  private $con;
  public function __construct($con) {
    $this->con = $con;
  }
  public function lista() {
    $this->con->query(
      "SELECT PAS_UUID AS uuid, PAS_NOMBRE AS nombre,
      PAS_MODIFICACION AS modificacion, PAS_ELIMINADO AS eliminado
    FROM PASATIEMPO
    WHERE PAS_ELIMINADO = 0");
    return $this->con->fetch_all();
  }
  public function buscaId($uuid) {
    $this->con->query(
      "SELECT PAS_UUID AS uuid, PAS_NOMBRE AS nombre,
          PAS_MODIFICACION AS modificacion, PAS_ELIMINADO AS eliminado
        FROM PASATIEMPO
        WHERE PAS_UUID = ?",
      "s", $uuid);
    if ($obj = $this->con->fetch_object()) {
      return $obj;
    } else {
      return null;
    }
  }
  public function agrega($modelo) {
    $this->con->execute(
      "INSERT INTO PASATIEMPO
        (PAS_UUID, PAS_NOMBRE, PAS_MODIFICACION, PAS_ELIMINADO)
      VALUES (?,?,?,?)",
      "ssii", $modelo->uuid, $modelo->nombre, $modelo->modificacion,
      $modelo->eliminado);
  }
  public function modifica($modelo) {
    $this->con->execute(
      "UPDATE PASATIEMPO
      SET PAS_NOMBRE = ?,
        PAS_MODIFICACION = ?,
        PAS_ELIMINADO = ?
      WHERE PAS_UUID = ?",
      "siis", $modelo->nombre, $modelo->modificacion, $modelo->eliminado,
      $modelo->uuid);
  }
}