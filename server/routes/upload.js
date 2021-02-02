const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs')
const path = require('path')
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Los archivos no se pudieron subir correctamente' }
        })



    }
    // Validar tipo

    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        })
    }

    //Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    let sampleFile = req.files.archivo;
    let nombreArchivo = sampleFile.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    //Cambiar nombre al archivo

    let nombreArc = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;;



    sampleFile.mv(`uploads/${tipo}/${ nombreArc}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArc);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArc);
        }

    });



    function imagenUsuario(id, res, nombreArc) {

        Usuario.findById(id, (err, userBD) => {
            if (err) {
                borraArchivo(nombreArc, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!userBD) {
                borraArchivo(nombreArc, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no existe'
                })
            }

            borraArchivo(userBD.img, 'usuarios');
            userBD.img = nombreArc;
            userBD.save((err, usuarioGuardado) => {
                if (err) {
                    console.log(err);
                }

                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArc
                });


            })

        })

    }

    function imagenProducto(id, res, nombreArc) {
        Producto.findById(id, (err, productoBD) => {
            if (err) {
                borraArchivo(nombreArc, 'productos');
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoBD) {
                borraArchivo(nombreArc, 'productos');
                return res.status(400).json({
                    ok: false,
                    message: 'Producto no existe'
                })
            }
            console.log(productoBD.img);
            borraArchivo(productoBD.img, 'productos');
            productoBD.img = nombreArc;
            productoBD.save((err, productoGuardad) => {
                if (err) {
                    console.log(err);
                }

                res.json({
                    ok: true,
                    prod: productoGuardad,
                    img: nombreArc
                });


            })

        })
    }

    function borraArchivo(nombreImagen, tipo) {
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
        console.log(pathImagen);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        } else {
            console.log('entre aca');
        }

    }
})


module.exports = app;