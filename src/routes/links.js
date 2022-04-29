const express = require('express');
const router = express.Router();

//importa conexión a la base de datos a través de pool
const pool = require('../database');

//Ruta a la página add 
router.get('/add', (req, res) => {
    //Devuelve lo siguiente:
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    //Recoge los datos del formulario y guarda en un objeto nuevo
    const {title,  url, description} = req.body;
    //El objeto nuevo se llama newLink
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    res.send('received');
});

module.exports = router;