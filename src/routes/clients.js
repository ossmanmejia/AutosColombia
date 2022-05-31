const express = require('express');
const res = require('express/lib/response');
const router = express.Router();


//importa conexión a la base de datos a través de pool
const pool = require('../database');

//Se importa el método para saber si el usuario está autenticado
const {isLoggedIn} = require('../lib/auth');


//Ruta a la página add 
router.get('/addclient', isLoggedIn, (req, res) => {
    //Devuelve lo siguiente:
    res.render('clients/addclient');
});

router.post('/addclient', isLoggedIn, async (req, res) => {
    //Recoge los datos del formulario y guarda en un objeto nuevo
    const {fullname, telefono, direccion, email} = req.body;
    //El objeto nuevo se llama newLink
    const newClient = {
        fullname,
        telefono,
        direccion,
        email
    };
    let nuevoCliente = await pool.query('INSERT INTO clientes set ?', [newClient]);
    const {license_plate, marca, modelo, color} = req.body;
    const newVehicle = {
        license_plate,
        marca,
        modelo,
        color, 
        cliente_idV: nuevoCliente.insertId
    };

    await pool.query('INSERT INTO vehiculos set ?', [newVehicle]);
    //Utilizo flash para enviar mensaje, flash tiene dos parámetros (nombre y valor)
    req.flash('success', 'Usuario registrado correctamente');
    res.redirect('/clients');
    console.log(nuevoCliente);

});

router.get('/', isLoggedIn, async (req, res) => {
    const clientes = await pool.query('SELECT * FROM clientes INNER JOIN vehiculos ON cliente_id = vehiculos.cliente_idV');

    //Renderiza la página 
    res.render('clients/listclient', {clientes});
});  


router.get('/delete/:cliente_id', isLoggedIn, async (req, res) => {
    const { cliente_id } = req.params;
    await pool.query('DELETE FROM clientes WHERE cliente_id = ?', [cliente_id]);
    req.flash('success','Se eliminó el cliente correctamente'); 
    res.redirect('/clients');
});


//Creo una ruta para editar cada link
router.post('/edit/:cliente_id', isLoggedIn, async (req, res) => {
    const { cliente_id } = req.params;
    const { fullname, telefono, direccion, email } = req.body;
    const newClient = {
        fullname,
        telefono,
        direccion,
        email
    };
    let edicionCliente = await pool.query('UPDATE clientes set ? WHERE cliente_id = ?', [newClient, cliente_id]);
    const {license_plate, marca, modelo, color} = req.body;
    const EditVehicles = {
        license_plate,
        marca,
        modelo,
        color, 
        cliente_idV: edicionCliente.updateId
    };
    await pool.query('UPDATE vehiculos set ? WHERE cliente_idV = ?', [EditVehicles, cliente_id]);
    req.flash('success','Vehículo actualizado correctamente'); 
    res.redirect('/clients');
});

//Ruta de editar link
router.get('/edit/:cliente_id', isLoggedIn, async(req,res) =>{
    const { cliente_id } = req.params;
    const EditClients = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [cliente_id]);
    const EditVehicles = await pool.query('SELECT * FROM vehiculos WHERE cliente_idV = ?', [cliente_id]);
    res.render('clients/editclient', {client: EditClients[0]}); 

});





module.exports = router;