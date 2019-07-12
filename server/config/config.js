// puerto
process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// base de datos
let urlDB;
if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else  {
    urlDB = '';
}

// vencimiento de token
process.env.CADUCIDAD_TOKEN = '48h'; //por mes

// seEd de autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

process.env.URLDB = urlDB;

// google cliend id
process.env.CLIENT_ID = process.env.CLIENT_ID || '528785555372-snuk8iih0i46jlf5tnk7h0i87a0fa6l3.apps.googleusercontent.com';