//=====================================
//              Puerto
//=====================================

process.env.PORT = process.env.PORT || 3000;


//=====================================
//              Entorno
//=====================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=====================================
//              Base de Datos
//=====================================
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;

//=====================================
//        Vencimiento Token
//=====================================
// 60 Segundos
// 60 Minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';


//=====================================
//            Seed de Auth
//=====================================

process.env.SEED = process.env.SEED || 'Secret'


//=====================================
//          Google client
//=====================================


process.env.CLIENT_ID = process.env.CLIENT_ID || '861008491653-iimsoae5tfv9dm818ungor6on6thq72k.apps.googleusercontent.com'