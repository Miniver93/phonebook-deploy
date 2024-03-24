const mongoose = require('mongoose')

require('dotenv').config()
//Con esto estoy diciendole a mi script, osea este programa, que cuando lo ejecute, cuando ponga node mongo.js, como estoy pasando solo 2 argumentos, me saldrá un console log diciendome que ponga la contraseña
// if(process.argv.length < 3){
//     console.log('give password as argument');
//     process.exit(1) //Con esto salimos de la ejecución del script si no he añadido un 3 parámetro
// }

// const password = process.argv[2] //Esto sería el argumento 3 que le paso a la terminal


const url = process.env.MONGO_DB_URI

//Para esperar a hacer cosas, como guardar una nota etc.., tenemos que esperar a que se conecte a nuestra base de datos, por eso tenemos que crear una función y ponerla como async, para que cuando termine de conectarse ya podamos ejecutar el código que queramos

const connnectToDatabase= async () => {
    try {
        //Conectamos con la base de datos, le decimos que espere a conectase antes de hacer nada en otro archivo o algo
        await mongoose.connect(url)
        console.log('Database connected');
    } catch (error) {
        console.error('Cant connect to db', error);
    }


}

module.exports=connnectToDatabase