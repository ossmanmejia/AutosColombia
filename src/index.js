//Se usan los módulos de express para crear el servidor
const express = require('express');
//Se usa morgan para mostrar los logs en consola
const morgan = require('morgan');
//Se importa handlebars para crear el motor de plantillas
const { engine } = require('express-handlebars');
//Se importa el modulo partial para crear los partials
const path = require('path');
//Se importa el modulo connect flash para mandar mensajes en vistas

// Initialize the app
const app = express();

//configuración de la app

    //Si existe un puerto en el archivo .env se usa ese, si no se usa el 4000
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
    //Se configura engine de plantillas handlebars
app.engine('.hbs', engine({
    //El defaultLayout es el layout que se usará por defecto en todas las páginas llamado main
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//middlewares
    //funciones que se ejecutan cuando se hace una petición al servidor

    //Se usa morgan para mostrar los logs en consola con el parámetro dev
app.use(morgan('dev'));
    //Se importa el modulo url-encoded para usar datos de formularios
app.use(express.urlencoded({extended: false}));
    //Se importa el modulo json para usar datos de formularios
app.use(express.json());

// Variables globales
    // Variables que toda la app va a tener y se usan en todas las rutas
    //esta función toma la información del usuario y continua con la ejecución
    app.use((req, res, next) => {
    next();
});


//Rutas
    // se definen las urls que se van a usar en la app
app.use (require('./routes/index.js'));
app.use (require('./routes/authentication.js'));
app.use ('/links',require('./routes/links.js'));

//Archivos públicos
    // se definen los archivos que se van a usar en la app
app.use(express.static(path.join(__dirname, 'public')));


// Initialize el servidor
//Se usa el método listen para iniciar el servidor
app.listen(app.get('port'), () => {
    //Se muestra el puerto en el que se esta escuchando
    console.log('Server on port', app.get('port'));
});