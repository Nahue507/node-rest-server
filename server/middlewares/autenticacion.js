//=====================================
//        Verificar Token
//=====================================

const { response } = require('express')
const jwt = require('jsonwebtoken')

let verificarToken = (req, res, next) => {

        let token = req.get('token')

        jwt.verify(token, process.env.SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        name: 'Jason web token',
                        message: 'Invalid Token'
                    }
                })
            }
            req.usuario = decoded.usuario;
            next();
        })



    }
    //=====================================
    //        Verificar Role
    //=====================================

let verificarRole = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            erro: {
                name: 'Wrong role',
                message: 'This user has not the permissons for this action'
            }
        })
    }


}


module.exports = {

    verificarToken,
    verificarRole

}