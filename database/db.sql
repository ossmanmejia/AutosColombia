--SE CREA LA BASE DE DATOS
CREATE DATABASE database_links;
--SE USA LA BASE DE DATOS
USE database_links;

--SE CREA LA TABLA USUARIOS
CREATE TABLE users (
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

--SE MODIFICA LA TABLA USUARIOS AGREGANDO UNA LLAVES PRIMARIA A ID
ALTER TABLE users
    ADD PRIMARY KEY (id);
--SE MODIFICA LA TABLA USUARIOS AGREGANDO UN AUTOINCREMENTO A ID
ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;




--SE CREA LA TABLA LINKS
CREATE TABLE links (
    id INT(11) NOT NULL,
    license_plate VARCHAR(150) NOT NULL,
    propietario VARCHAR(255) NOT NULL,
    novedades TEXT,
      --Campos creados para guardar la fecha de ingreso del vehiculo de forma automatica
    create_at timestamp NOT NULL DEFAULT current_timestamp,
    fecha_entrada timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP    
);

ALTER TABLE links
    ADD PRIMARY KEY (id);

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;


