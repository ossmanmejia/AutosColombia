--SE CREA LA BASE DE DATOS
CREATE DATABASE parqueadero;
--SE USA LA BASE DE DATOS
USE parqueadero;

--SE CREA LA TABLA ADMINISTRADORES
CREATE TABLE admins (
    admin_id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

--SE MODIFICA LA TABLA ADMINS AGREGANDO UNA LLAVES PRIMARIA A ID
ALTER TABLE admins
    ADD PRIMARY KEY (admin_id);
--SE MODIFICA LA TABLA ADMINS AGREGANDO UN AUTOINCREMENTO A ID
ALTER TABLE admins
    MODIFY admin_id INT(11) NOT NULL AUTO_INCREMENT;

--SE CREA LA TABLA CELDAS DE PARQUEADERO
CREATE TABLE celdas (
    celda_id INT(11) NOT NULL,
    estado VARCHAR(1) NOT NULL
);

ALTER TABLE celdas
    ADD PRIMARY KEY (celda_id);

ALTER TABLE celdas
    MODIFY celda_id INT(11) NOT NULL AUTO_INCREMENT;

--SE CREA LA TABLA CLIENTES
CREATE TABLE clientes (
    cliente_id INT(11) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_afiliacion timestamp NOT NULL DEFAULT current_timestamp,
    celda_parqueo INT(11) NOT NULL,
    CONSTRAINT fk_celda_parqueo FOREIGN KEY (celda_parqueo) REFERENCES celdas(celda_id)
);

ALTER TABLE clientes
    ADD PRIMARY KEY (cliente_id);

ALTER TABLE clientes
    MODIFY cliente_id INT(11) NOT NULL AUTO_INCREMENT;

-- SE CREA LA TABLA DE VEHICULOS

CREATE TABLE vehiculos (
    license_plate VARCHAR(11) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    placa VARCHAR(255) NOT NULL,
    cliente_idV INT(11) NOT NULL,
    CONSTRAINT fk_cliente_id FOREIGN KEY (cliente_idV) REFERENCES clientes(cliente_id),
    fecha_afiliacion timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE vehiculos
    ADD vehiculos_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY;





--SE CREA LA TABLA Entrada_vehiculo
CREATE TABLE entrada_vehiculo (
    id INT(11) NOT NULL,
    license_plate_entrada VARCHAR(150) NOT NULL,
    novedades TEXT,
    fecha_entrada timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_license_plate_id FOREIGN KEY (license_plate_entrada) REFERENCES vehiculos(vehiculos_id)

);

ALTER TABLE entrada_vehiculo

    ADD PRIMARY KEY (id);

ALTER TABLE entrada_vehiculo
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

--SE CREA LA TABLA DE SALIDA DE VEHICULOS  

CREATE TABLE salida_vehiculo ( 
    salida_id INT(11) NOT NULL, 
    license_plate_salida INT(150) NOT NULL, 
    novedades_salida TEXT, 
    fecha_salida timestamp NOT NULL DEFAULT current_timestamp, 
    CONSTRAINT fk_license_plate_idS FOREIGN KEY (license_plate_salida) REFERENCES vehiculos(vehiculos_id) );

ALTER TABLE salida_vehiculos
    ADD PRIMARY KEY (salida_id);

ALTER TABLE salida_vehiculos
    MODIFY salida_id INT(11) NOT NULL AUTO_INCREMENT;

