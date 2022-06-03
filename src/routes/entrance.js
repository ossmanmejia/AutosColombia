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
    const {license_plate_entrada, novedades} = req.body;
    const nuevoEntrada = await pool.query('SELECT vehiculos_id FROM vehiculos WHERE license_plate = ?', [license_plate_entrada]);
    //El objeto nuevo se llama newLink
    const newLink = null;
    const newCelda = null;
    if(nuevoEntrada.length > 0){
        const newLink = {
            license_plate_entrada,
            novedades,
            id_vehiculo_entrada: nuevoEntrada[0].vehiculos_id
        };  
        let entradaVehiculo = pool.query('INSERT INTO entrada_vehiculo set ?' , [newLink]);
        const newCelda = {
            estado: 'Ocupado',
            vehiculo_celda: nuevoEntrada[0].vehiculos_id

        }
        await pool.query('INSERT INTO celdas set ?', [newCelda]);
        req.flash('success', 'Entrada registrada correctamente');
        res.redirect('/entrance');
    }else{
        req.flash('success', 'Vehículo no registrado');
        res.redirect('/entrance');
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM entrada_vehiculo INNER JOIN vehiculos ON entrada_vehiculo.id_vehiculo_entrada = vehiculos.vehiculos_id INNER JOIN clientes ON vehiculos.cliente_idV = clientes.cliente_id INNER JOIN celdas ON entrada_vehiculo.id_vehiculo_entrada = celdas.vehiculo_celda');
    const cantidadceldas = await pool.query('SELECT COUNT(estado) FROM celdas WHERE estado = "Ocupado"');
    //Renderiza la página links/list con el objeto links
    let cantidad = cantidadceldas[0]['COUNT(estado)'];
    let celdastotales = 30;
    let celdasdisponibles = celdastotales - cantidad;
    res.render('entrance/list', {links, cantidad, celdasdisponibles});
});  

//Ruta de registrar salida vehículos
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id }    = req.params;
    const licenseEntrada = await pool.query ('SELECT * FROM entrada_vehiculo INNER JOIN vehiculos ON entrada_vehiculo.id_vehiculo_entrada = vehiculos.vehiculos_id');       
    const salida = {
        novedades_salida: 'Salida',
        license_plate_salida: licenseEntrada[0].vehiculos_id
    }
    await pool.query('INSERT INTO salida_vehiculo set ?', [salida]);
    await pool.query('DELETE FROM entrada_vehiculo WHERE ID = ?', [id]);
    req.flash('success','Se registró correctamente la salida del vehículo'); 
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
    const { novedades } = req.body;
    const newLink = {
        novedades
    };
    await pool.query('UPDATE entrada_vehiculo set ? WHERE id = ?', [newLink, id]);
    req.flash('success','Novedad registrada correctamente'); 
    res.redirect('/entrance');
});



module.exports = router;