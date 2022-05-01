//importa modulo mysql
const mysql = require('mysql');
//Modulo para soportar callbacks a promesas
const { promisify } = require('util');

//importa modulo de configuración de la base de datos
const { database } = require('./keys');
//Se crea el pool para que no se cree una conexión por cada petición como en producción
const pool = mysql.createPool(database);
//Se usa el pool para que se pueda usar la conexión de la base de datos
pool.getConnection((err, connection) => {
    //Si hay un error se muestra el error
    if (err) {
        //conexión fallida con la base de datos
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        //cuantas conexiones se han creado
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        //cuando la conexión se rechaza
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release();
    console.log('DB is Connected');  
    return;  
});

//Cada vez que se hace consulta se hacen promesas
pool.query = promisify(pool.query);

//Exporta el pool para que se pueda usar en otros archivos
module.exports = pool;
