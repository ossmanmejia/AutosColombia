//Se usan los modulos de express para crear el servidor
const express = require('express');
//Se usa morgan para mostrar los logs en consola
const morgan = require('morgan');

// Inicializa the app
const app = express();

//configuracion de la app

    //Si existe un puerto en el archivo .env se usa ese, si no se usa el 4000
app.set('port', process.env.PORT || 4000);


//middlewares
    //funciones que se ejecutan cuando se hace una peticion al servidor

    //Se usa morgan para mostrar los logs en consola con el parametro dev
app.use(morgan('dev'));

// Variables globales

    // Variables que toda la app va a tener y se usan en todas las rutas



//Rutas
    // se definen las urls que se van a usar en la app
app.use (require('./routes/index.js'));

//Archivos publicos
    // se definen los archivos que se van a usar en la app



// Inicializa el servidor
//Se usa el metodo listen para iniciar el servidor
app.listen(app.get('port'), () => {
    //Se muestra el puerto en el que se esta escuchando
    console.log('Server on port', app.get('port'));
});