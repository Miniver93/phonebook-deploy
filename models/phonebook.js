const mongoose = require('mongoose')



//se utiliza para cambiar la configuración de Mongoose relacionada con la estricta validación de consultas.
mongoose.set('strictQuery', false)



//Creamos un schema
const phoneBookSchema = new mongoose.Schema({
    "name": {
        type: String,
        minLength: 3,
        required: true
    },
    "number": {
        type: String,
        minLength: 6,
        required: true
    }
})

//Cambiamos la configuración de lo que nos devuelve el JSON
phoneBookSchema.set('toJSON', {
    transform: (document,returnedObject)=>{
        returnedObject.id=returnedObject._id
        delete returnedObject.__v
        delete returnedObject._id
    }
})


//Creamos una colección en la base de datos
module.exports = mongoose.model('Phonebook', phoneBookSchema)