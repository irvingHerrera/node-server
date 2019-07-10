const jwt = require('jsonwebtoken');

// verificar token

let verificaToken = ( req, res, next ) => {

    let token = req.get('token'); // nombre del header

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if( err ) {
            return res.status(401),json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// verifica admin rol
let verificaAdminRol = ( req, res, next ) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }0
};



module.exports = {
    verificaToken,
    verificaAdminRol
};