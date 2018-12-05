<?php
require_once "Conexion.php";
/* Adáptalo a tu servidor. Los parámetros son:
 * host, usuario, password, base de datos. */
$mysqli = new mysqli("localhost", "sincro", "sincro", "sincro");
$con = new Conexion($mysqli);