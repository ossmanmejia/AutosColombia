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
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    //Recoge los datos del formulario y guarda en un objeto nuevo
    const {title,  url, description} = req.body;
    //El objeto nuevo se llama newLink
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    //Utilizo flash para enviar mensaje, flash tiene dos parámetros (nombre y valor)
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //Renderiza la página links/list con el objeto links
    res.render('links/list', {links});
});  

//Ruta de eliminar link
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success','Link Removed successfully');
    res.redirect('/links');
});

//Ruta de editar link
router.get('/edit/:id', isLoggedIn, async(req,res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});  
});

//Creo una ruta para editar cada link
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success','Link Updated Successfully'); 
    res.redirect('/links');
});

module.exports = router;