<?php
function devuelve($respuesta) {
  header('Content-type: application/json');
  echo \json_encode($respuesta);
}