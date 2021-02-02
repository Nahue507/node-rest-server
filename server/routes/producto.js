const express = require('express')
const { verificarToken } = require('../middlewares/autenticacion');
const producto = require('../models/producto');
const app = express();
let Producto = require('../models/producto')


app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0
    Producto.find({ disponible: true })
        .skip(desde)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
            })
        })

})
app.get('/productos/:id', verificarToken, (req, res) => {

        let id = req.params.id;

        Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Producto no encontrado'
                        }
                    });
                }

                res.json({
                    ok: true,
                    productoDB,
                })

            })

    })
    /* 

           nombre: { type: String, required: [true, 'El nombre es necesario'] },
           precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
           descripcion: { type: String, required: false },
           disponible: { type: Boolean, required: true, default: true },
           categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
           usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

       */
app.post('/productos', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});
app.put('/productos/:id', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });


});

app.delete('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['descripcion']);
    let body = req.body;

    let estado = {
        disponible: false
    }


    Producto.findByIdAndUpdate(id, estado, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria: productoDB,
            message: 'Borrado con exito'
        });

    })
})

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, prod) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: prod
            })

        })

})


module.exports = app;