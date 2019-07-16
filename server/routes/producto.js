const express = require('express');
const { verificaToken } = require('../middleweres/autenticacion');
const app = express();

const Producto = require('../models/producto');

// mostrar todas las producto
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productos
            });

        });


})

// mostrar una producto por id
app.get('/producto:id', verificaToken, (req, res) => {

    let id = res.params.id;

    Categoria.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err , productoDB) => {
            
                if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            if( !productoDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
    });
    
})

// crear nueva producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: req.nombre,
        precioUni: req.precioUni,
        descripcion: req.descripcion,
        desponible: req.disponible,
        categoria: req.categoria._id
    });

    producto.save((err, productoDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
    
})

// actualiar producto
app.put('/producto:id', verificaToken, (req, res) => {

    let id = req.param.id;
    let body = req.body;

    Producto.findById(id, ( err, productoDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: 'El producto no existe'
            });
        }


        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;


        productoDB.save((err, productoGuardado) => {
            if( err ) {
                return res.status(500).json({

                });
            }
            
            res.json({
                ok: true,
                producto: productoGuardado
            });
    

        });
    });
    
})

// borrar producto
app.delete('/producto', [verificaToken], (req, res) => {

    let id = req.param.id;
    let body = req.body;

    let objProducto = { disponible: false }

    Producto.findByIdAndUpdate(id, objProducto, {new: true, runValidators: true}, ( err, productoDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });
    

})

module.exports = app;