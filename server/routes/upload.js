const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
      }

      // validar tipo
      let tiposValidos = ['producto', 'usuario'];

      if( tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son' + tiposValidos.join(', ')
            }
          });
      }



      let archivo = req.files.archivo;

      let nombreCortando = archivo.name.split('.');
      let extension = nombreCortando[nombreCortando.length - 1];

      // extensiones permitidas
      let extencionesValidas = ['png', 'jpg', 'gif', 'jpge'];

      if( extencionesValidas.indexOf(extension) < 0 ) {
          return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + extencionesValidas.join(', ')
            }
          });
      }


      // cambiar nombre al archivo
      let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

      // Use the mv() method to place the file somewhere on your server
      archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        
            switch (tipo) {
                case 'usuarios':
                    imagenUsuario(id, res, nombreArchivo);
                break;
                case 'productos':
                    imagenProducto(id, res, nombreArchivo);
                    break;
            }
    });

});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, ( err, usuarioDB) => {

        if ( err ){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if ( err )
            return res.status(500).json({
                ok: false,
                err
            });

            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        });

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, ( err, productoDB) => {

        if ( err ){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if ( err )
            return res.status(500).json({
                ok: false,
                err
            });

            res.json({
                ok: true,
                usuario: productoGuardado
            })
        });

    });

}

function borraArchivo(nombreImagen, tipo) {

    let pathUrl = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

        if( fs.existsSync(pathUrl) ) {
            fs.unlinkSync(pathUrl);
        }

    
}

module.exports = app;