CREATE DATABASE sincro;
GRANT ALL PRIVILEGES
  ON sincro.*
  TO 'sincro'@'localhost'
  IDENTIFIED BY 'sincro';
FLUSH PRIVILEGES;
USE sincro;
CREATE TABLE PASATIEMPO (
  PAS_UUID VARCHAR(255) PRIMARY KEY,
  PAS_NOMBRE VARCHAR(255) NOT NULL,
  PAS_MODIFICACION BIGINT NOT NULL,
  PAS_ELIMINADO SMALLINT NOT NULL
);