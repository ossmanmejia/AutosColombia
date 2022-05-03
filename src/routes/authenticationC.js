const express = require('express');
const router = express.Router();
//Se importa el modulo passport para poder utilizarlo
const passportC = require('passport');
//Se importan los métodos para saber si el usuario está autenticado o no
const {isLoggedIn , isNotLoggedIn} = require('../lib/authC');

//Creo un enrutador para rendererizar la ruta /authentication
router.get('/signupC', isNotLoggedIn, (req, res) => {
    res.render('authC/signupC');
});

//Creo un enrutador para recibir los datos del formulario de registro

router.post('/signupC', isNotLoggedIn, passportC.authenticate('local.signupC', {
    successRedirect: '/profileC',
    failureRedirect: '/signupC',
    failureFlash: true
}))

//Creo un enrutador para autenticar el usuario
router.get('/signinC', isNotLoggedIn, (req, res) => {
    res.render('authC/signinC');
});

router.post('/signinC', isNotLoggedIn, (req, res, next) => {
    passportC.authenticate('local.signinC', {
        successRedirect: '/profileC',
        failureRedirect: '/signinC',
        failureFlash: true
    })(req, res, next);
});


router.get('/profileC', isLoggedIn, (req, res) => {
    res.render('profileC');
});

//Creo un enrutador para cerrar sesión
router.get('/logoutC', isLoggedIn, (req, res) => {  
    req.logout();
    res.redirect('/signinC');
});

    


module.exports = router;