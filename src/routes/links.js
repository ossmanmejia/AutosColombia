const express = require('express');
const res = require('express/lib/response');
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
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links')
    //Renderiza la página links/list con el objeto links
    res.render('links/list', {links});
});  

//Ruta de eliminar link
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    res.redirect('/links');
});

//Ruta de editar link
router.get('/edit/:id', async(req,res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});  
});

//Creo una ruta para editar cada link
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]); 
    res.redirect('/links');
});

module.exports = router;