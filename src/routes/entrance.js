const express = require('express');
const res = require('express/lib/response');
const router = express.Router();


//importa conexión a la base de datos a través de pool
const pool = require('../database');

//Se importa el método para saber si el usuario está autenticado
const {isLoggedIn} = require('../lib/auth');

//Ruta a la página add 
router.get('/add', isLoggedIn, (req, res) => {
    //Devuelve lo siguiente:
    res.render('entrance/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    //Recoge los datos del formulario y guarda en un objeto nuevo
    const {license_plate_id} = req.body;
    //El objeto nuevo se llama newLink
    const newLink = {
        license_plate_id
    };
    await pool.query('INSERT INTO entrada_vehiculo set ?', [newLink]);
    //Utilizo flash para enviar mensaje, flash tiene dos parámetros (nombre y valor)
    req.flash('success', 'Vehículo ingresado correctamente');
    res.redirect('/entrance');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM entrada_vehiculo');
    //Renderiza la página links/list con el objeto links
    res.render('entrance/list', {links});
});  

//Ruta de eliminar link
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM entrada_vehiculo WHERE ID = ?', [id]);
    req.flash('success','Se registró la salida del vehículo correctamente'); 
    res.redirect('/entrance');
});

//Ruta de editar link
router.get('/edit/:id', isLoggedIn, async(req,res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM entrada_vehiculo WHERE id = ?', [id]);
    res.render('entrance/edit', {link: links[0]});  
});

//Creo una ruta para editar cada link
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { license_plate, propietario, novedades } = req.body;
    const newLink = {
        license_plate,
        propietario,
        novedades
    };
    await pool.query('UPDATE entrada_vehiculo set ? WHERE id = ?', [newLink, id]);
    req.flash('success','Vehículo actualizado correctamente'); 
    res.redirect('/entrance');
});



module.exports = router;