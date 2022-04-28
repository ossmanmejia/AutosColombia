//En este archivo se encuentran las rutas principales de la aplicación

// requiere express para crear las rutas
const express = require('express');
// requiere el router de express para crear las rutas
const router = express.Router();
//Al router le define una ruta inicial '/'
router.get('/', (req, res) => {
    res.send('Hola mundo'); 
});

// Exporta el router
module.exports = router;