const express = require('express')

let { verificarToken, verificarRole } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria')

app.get('/categoria', verificarToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
            })

        })

})
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id,
        (err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                categoria,
            })

        })

})

app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
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

app.put('/categoria/:id', [verificarToken, verificarRole], (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['descripcion']);
    let body = req.body;

    let desc = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, desc, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.json({
                ok: false,
                error: {
                    message: 'El preoducto no existe'
                }
            })
        }



        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

app.delete('/categoria/:id', [verificarToken, verificarRole], (req, res) => {
    console.log('Llego');
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        console.log('Entro aca');
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    })

})



module.exports = app;