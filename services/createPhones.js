const Phone = require('../models/phonebook')
const fs = require('fs')
const connectToDatabase = require('../mongo')
const mongoose = require('mongoose')


// let phones
// fs.readFile('D:/Dev/phonebookdeploy/phonebook.json', 'utf8', (error,data)=>{
//     if(error){
//         console.error('Cannot read file');
//         return
//     }
//     try {
//         phones=JSON.parse(data)
//         console.log('JSON file read sucessfully');
//         //Como se tarda en leer todo el archivo (Es asyncrono), no se está guardando bien los datos en la variable phones
//         createPhones() //Creo una función que haga que cuando esté listo de guardarse los datos en phones, pueda trabajar con la variable
//     } catch (parseError) {
//         console.error('Error parsing JSON');
        
//     }
// })

// // Función para crear teléfonos después de guardarse los teléfonos que tengo en el JSON en la variable phones
// const createPhones = async () => {
//     await connectToDatabase();

//     try {
//         // Map sobre el arreglo de teléfonos y guardar cada uno
//         const promises = phones.map(async element => {
//             const phone = new Phone({
//                 "name": element.name,
//                 "number": element.number
//             });

//             try {
//                 await phone.save();
//                 console.log('Phone saved');
//             } catch (err) {
//                 console.error('Cannot save phone', err);
//             }
//         });

//         // Esperar a que todas las promesas se resuelvan
//         await Promise.all(promises);

//         // Cerrar la conexión a la base de datos después de que todas las notas se hayan guardado correctamente
//         mongoose.connection.close();
//     } catch (error) {
//         console.error('Error creating phones:', error);
//         // En caso de error, también es buena práctica cerrar la conexión a la base de datos
//         mongoose.connection.close();
//     }
// };




