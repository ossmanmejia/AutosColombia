//El modulo passport-local es una libreria que permite autenticar usuarios
const passportC = require('passport');
const LocalStrategyC = require('passport-local').Strategy;

//Importo la base de datos
const pool = require('../database');

//Se trae el medoto de encriptación de contraseñas
const helpers = require('../lib/helpers');


//Se crea una estrategia de autenticación para login de usuarios
passportC.use('local.signinC', new LocalStrategyC({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //Se busca el usuario en la base de datos
    const rows = await pool.query('SELECT * FROM clients WHERE username = ?', [username]);
    if (rows.length > 0) {
        const client = rows[0];
        //Se valida la contraseña
        const validPassword = await helpers.matchPassword(password, client.password);
        if (validPassword) {
            done(null, client, req.flash('success', 'Bienvenido ' + client.username));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario no encontrado'));
    }
}));

//Se crea una estrategia de autenticación para registrar usuarios
passportC.use('local.signupC', new LocalStrategyC({
    usernameField: 'username',
    passwordField: 'password',
    //passReqToCallback para que el callback reciba toda la informacion del request
    passReqToCallback: true
}, async (req, username, password, done) => {
    //En este callback recibo los datos del formulario de registro
    const {fullname} = req.body;
    const newClient = {
        username,
        password,
        fullname
    };
    //Se cifra la contraseña
    newClient.password = await helpers.encryptPassword(password);
    //Almaceno el usuario en la base de datos
    const result = await pool.query('INSERT INTO clients SET ?', [newClient]);
    //Se retorna el id del usuario
    newClient.id = result.insertId;
    //Retorna el newUser para usar en una sesion
    return done(null, newClient);
}));

//Serializar el usuario para almacenarlo en la sesion
passportC.serializeUser((client, done) => {
    done(null, client.id);
});

//Deserializar el usuario para recuperarlo de la sesion
passportC.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    done(null, rows[0]);
});