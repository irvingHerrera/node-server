require('./config/config')

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, res) => {
    if( err ) {
        throw err;
        //console.log(err);
    }

    console.log('base de datos online');

});
mongoose.set('useCreateIndex', true);
app.listen(process.env.PORT, () => {
    console.log('escuhando puerto '+process.env.PORT);
});
