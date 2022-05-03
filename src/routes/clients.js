const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

//importa conexión a la base de datos a través de pool
const pool = require('../database');

//Se importa el método para saber si el usuario está autenticado
const {isLoggedIn} = require('../lib/authC');

//Ruta a la página signupC
router.get('/signupC', (req, res) => {
    //Devuelve lo siguiente:
    res.render('authC/signupC');
});

router.post('/signupC', async (req, res) => {
    //Recoge los datos del formulario y guarda en un objeto nuevo
    const {fullname, license_plate, brand, model, year} = req.body;
    //El objeto nuevo se llama newLink
    const newClient = {
        fullname,
        license_plate,
        brand,
        model,
        year
    };
    await pool.query('INSERT INTO clients set ?', [newClient]);
    //Utilizo flash para enviar mensaje, flash tiene dos parámetros (nombre y valor)
    req.flash('success', 'Te has registrado correctamente');
    /* res.redirect('/clients'); */
    console.log(newClient);
    res.redirect('/authC/signupC');
});


module.exports = router;