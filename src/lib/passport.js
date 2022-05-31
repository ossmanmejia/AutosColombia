//El modulo passport-local es una libreria que permite autenticar usuarios
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Importo la base de datos
const pool = require('../database');

//Se trae el medoto de encriptación de contraseñas
const helpers = require('../lib/helpers');


//Se crea una estrategia de autenticación para login de usuarios
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //Se busca el usuario en la base de datos
    const rows = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        //Se valida la contraseña
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario no encontrado'));
    }
}));

//Se crea una estrategia de autenticación para registrar usuarios
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    //passReqToCallback para que el callback reciba toda la informacion del request
    passReqToCallback: true
}, async (req, username, password, done) => {
    //En este callback recibo los datos del formulario de registro
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    //Se cifra la contraseña
    newUser.password = await helpers.encryptPassword(password);
    //Almaceno el usuario en la base de datos
    const result = await pool.query('INSERT INTO admins SET ?', [newUser]);
    //Se retorna el id del usuario
    newUser.admin_id = result.insertId;
    //Retorna el newUser para usar en una sesion
    return done(null, newUser);
}));

//Serializar el usuario para almacenarlo en la sesion
passport.serializeUser((user, done) => {
    done(null, user.admin_id);
});

//Deserializar el usuario para recuperarlo de la sesion
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM admins WHERE admin_id = ?', [id]);
    done(null, rows[0]);
});
