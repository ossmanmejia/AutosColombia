const { request } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router = express.Router();


//importa conexión a la base de datos a través de pool
const pool = require('../database');

//Se importa el método para saber si el usuario está autenticado
const {isLoggedIn} = require('../lib/auth');
const { timeago } = require('../lib/handlebars');


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
    const {estado_pago} = req.body;
    var newPayment;
    if (estado_pago == 'Si') {
        newPayment = 'Pago aprobado';
        const newPaymentStatus = {
            estado_pago: newPayment,
            cliente_idP: nuevoCliente.insertId,  
        };
        await pool.query('INSERT INTO pagos set ?', [newPaymentStatus]);
        const fechafinpago = await pool.query('SELECT fecha_pago FROM pagos WHERE cliente_idP = ?', [nuevoCliente.insertId]);
        let fechafinpago2 = (fechafinpago[0].fecha_pago);
        await pool.query('UPDATE pagos SET fin_pago = ? WHERE cliente_idP = ?', [fechafinpago2, nuevoCliente.insertId]);
        await pool.query('UPDATE pagos SET fin_pago = Date_add(fin_pago, INTERVAL 1 MONTH) WHERE cliente_idP = ?', [nuevoCliente.insertId]);
        console.log(fechafinpago);
        console.log(fechafinpago2);
       //Utilizo flash para enviar mensaje, flash tiene dos parámetros (nombre y valor)
        req.flash('success', 'Cliente registrado correctamente');
        res.redirect('/clients');
    } else {
        newPayment = 'Pago no aprobado';
        req.flash('success', 'Cliente no puede ser registrado sin pagar mensualidad');
        res.redirect('/clients/addclient');
    };
  
});

router.get('/', isLoggedIn, async (req, res) => {
    const clientes = await pool.query('SELECT * FROM clientes INNER JOIN vehiculos ON cliente_id = vehiculos.cliente_idV INNER JOIN pagos ON cliente_id = pagos.cliente_idP');
    //Renderiza la página 
    res.render('clients/listclient', {clientes});
});  



router.get('/delete/:cliente_id', isLoggedIn, async (req, res) => {
    const { cliente_id } = req.params;
    await pool.query('DELETE FROM clientes WHERE cliente_id = ?', [cliente_id]);
    req.flash('success','Se eliminó el cliente correctamente'); 
    res.redirect('/clients');
});

//Ruta de editar link
router.get('/edit/:cliente_id', isLoggedIn, async(req,res) =>{
    const { cliente_id } = req.params;
    var result = null, result2 = null;
    const EditClients= await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [cliente_id], function(err, rows, fields) {
        if (err) throw err;
        result = rows;
        const EditVehicles = pool.query('SELECT * FROM vehiculos WHERE cliente_idV = ?', [cliente_id], function(err, rows, fields) {
            if (err) throw err;
            result2 = rows;
            res.render('clients/editclient', {client: result[0], vehicle: result2[0]});
        });
    });
});


//Creo una ruta para editar cada link
router.post('/edit/:cliente_id', isLoggedIn, async (req, res) => {
    const { cliente_id } = req.params;
    const { fullname, telefono, direccion, email } = req.body;
    const EditClients = {
        fullname,
        telefono,
        direccion,
        email
    };
    await pool.query('UPDATE clientes set ? WHERE cliente_id = ?', [EditClients, cliente_id]);
    console.log(EditClients);
    const {license_plate, marca, modelo, color} = req.body;
    const EditVehicles = {
        license_plate,
        marca,
        modelo,
        color
    };
    await pool.query('UPDATE vehiculos set ? WHERE cliente_idV = ?', [EditVehicles, cliente_id]);
    console.log(EditVehicles);
    req.flash('success','Cliente actualizado correctamente'); 
    res.redirect('/clients');
});


//Ruta para ver pagos

router.get('/pagos', isLoggedIn, async (req, res) => {
    const pagos = await pool.query('SELECT * FROM clientes INNER JOIN vehiculos ON cliente_id = vehiculos.cliente_idV INNER JOIN pagos ON cliente_id = pagos.cliente_idP');
    //Renderiza la página 
    res.render('clients/pagos', {pagos});
});  

module.exports = router;