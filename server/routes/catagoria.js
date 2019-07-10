const express = require('express');
const { verificaToken, verificaAdminRol } = require('../middleweres/autenticacion');
const app = express();

const Categoria = require('../models/categoria');

// mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {


});

// mostrar una categoria por id
app.get('/categoria:id', verificaToken, (req, res) => {


});

// crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// actualiar categoria
app.put('/categoria', verificaToken, (req, res) => {

});

// borrar categoria
app.delete('/categoria', [verificaToken, verificaAdminRol], (req, res) => {

});

module.exports = app;