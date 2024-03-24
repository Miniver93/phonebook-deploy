const mongoose = require('mongoose')



//se utiliza para cambiar la configuración de Mongoose relacionada con la estricta validación de consultas.
mongoose.set('strictQuery', false)

//Cambiamos la configuración de lo que nos devuelve el JSON
mongoose.set('toJSON', {
    transform: (document,returnedObject)=>{
        returnedObject.id=returnedObject._id
        delete returnedObject.__v
        delete returnedObject._id
    }
})

//Creamos un schema
const phoneBookSchema = new mongoose.Schema({
    "name": String,
    "number": String
})

//Creamos una colección en la base de datos
const Phone = mongoose.model('Phonebook', phoneBookSchema)


module.exports = Phone