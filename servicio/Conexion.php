<?php
class Conexion {
  private $mysqli;
  private $stmt;
  private $res;
  public function __construct($mysqli) {
    $this->mysqli = $mysqli;
  }
  public function verifica() {
    if ($this->mysqli->connect_errno) {
      throw new Exception($this->mysqli->connect_error);
    }
  }
  public function begin_transaction($modo) {
    $this->ej($this->mysqli->begin_transaction($modo));
  }
  public function prepare($query) {
    $this->stmt = $this->ej($this->mysqli->prepare($query));
  }
  public function bind_execute() {
    $args = func_get_args();
    for ($i = 1, $count = count($args); $i < $count; $i++) {
      $args[$i] = &$args[$i];
    }
    $this->ej(call_user_func_array([$this->stmt, "bind_param"], $args));
    $this->stmt->execute();
  }
  public function execute() {
    $this->prepare(func_get_arg(0));
    if (func_num_args() > 1) {
      $args = func_get_args();
      array_shift($args);
      call_user_func_array([$this, "bind_execute"], $args);
    } else {
      $this->stmt->execute();
    }
  }
  public function query($query) {
    switch (func_num_args()) {
    case 0:
      throw new Exception("Query sin parámetros.");
    case 1:
      $this->res = $this->ej($this->mysqli->query(func_get_arg(0)));
      return;
    default:
      call_user_func_array([$this, "execute"], func_get_args());
      $this->res = $this->ej($this->stmt->get_result());
    }
  }
  public function fetch_object() {
    return $this->ej($this->res->fetch_object());
  }
  public function fetch_all() {
    return $this->ej($this->res->fetch_all(MYSQLI_ASSOC));
  }
  public function commit() {
    $this->ej($this->mysqli->commit());
  }
  public function ej($resultado) {
    if ($resultado === false) {
      throw new Exception($this->mysqli->error);
    }
    return $resultado;
  }
}