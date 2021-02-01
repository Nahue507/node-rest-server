const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path')
require('./config/config')

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

//carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));




mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, resp) => {

    if (err) throw err;

    console.log("Base de datos ON");

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto 3000`);
});