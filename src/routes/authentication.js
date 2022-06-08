const express = require('express');
const router = express.Router();
//Se importa el modulo passport para poder utilizarlo
const passport = require('passport');
//Se importan los métodos para saber si el usuario está autenticado o no
const {isLoggedIn , isNotLoggedIn} = require('../lib/auth');

//Creo un enrutador para rendererizar la ruta /authentication
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

//Creo un enrutador para recibir los datos del formulario de registro

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

//Creo un enrutador para autenticar el usuario
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

//Creo un enrutador para cerrar sesión
router.get('/logout', isLoggedIn, (req, res) => {  
    req.logout();
    res.redirect('/signin');
});

    



module.exports = router;