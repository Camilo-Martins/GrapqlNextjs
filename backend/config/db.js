const moongose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async () =>{
    try {
        await moongose.connect(process.env.DB_MONGO,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          
        });

        console.log("DB contectada");

    } catch (error) {
        console.log("Error al conectarse en la db");
        console.log(error);
        process.exit(); //Detiene la app
    };
};

module.exports = conectarDB;