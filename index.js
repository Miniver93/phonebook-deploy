const express=require('express'); //Importamos el modulo express

require('dotenv').config()
require('./services/createPhones')
const connectToDatabase = require('./mongo')
connectToDatabase()

const fs = require('fs');
const morgan = require('morgan')
const app = express(); //Creamos el servidor
const Phone = require('./models/phonebook')

    //Creamos un token que luego le añadiremos a nuestro middleware, que contenga un mensaje personalizado según el código que nos de
    morgan.token('message', (request,response)=>{
        if(response.statusCode===400){
            return JSON.stringify({
                "error": "The name already exist in the phonebook"
              })
        }
        return JSON.stringify(request.body)
    })

app.use(morgan((tokens, request, response)=>{
    return[
        tokens.method(request,response),
        tokens.url(request,response),
        tokens.status(request,response),
        tokens.res(request,response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        //Aquí añado mi token personalizado y le digo que se ejecute estoy haciendo una llamada POST, si no existe escribeme ''
        request.method==='POST' ? tokens.message(request,response) : '',
    ].join(' ')
}))

app.use(express.static('dist'))
app.use(express.json()) //Le decimos que mi app use el middleware para parsear JSON



app.get('/api/persons', (request,response)=>{
    Phone.find({})
    .then(phones=>{
        response.json(phones).end()
    })
    .catch(err=>{
        response.status(404)
    })
})

app.get('/info', async (request,response)=>{
    let entries
    const saveEntries = async () =>{
        entries=await Phone.countDocuments({}) //Me devuelve todos los documentos que tengo en mi colección Phone
    }
    await saveEntries()

    const date=new Date()
    response.send(`<p>Phonebook has info for ${entries} people</p><br>${date}`)
})

app.get('/api/persons/:id', (request, response, next)=>{
    

    Phone.findById(request.params.id)
    .then(phone=>{
        return phone ? response.json(phone) : response.status(404).end()
    })
    .catch(err=>next(err))
 
    
})

app.delete('/api/persons/:id', (request,response, next)=>{
    

    Phone.findByIdAndDelete(request.params.id)
    .then(result=>{
        response.status(200).send({ message: 'Phone has been deleted'}).end()
    })
    .catch(err=>next(err))
})

app.post('/api/persons', async (request,response)=>{
    const person = request.body

    const existingPerson = await Phone.findOne({ name: person.name }) //Aquí guardo el nombre de la persona que tenga el mismo nombre del que quiero añadir

    const newPerson = new Phone({
        name: person.name,
        number: person.number
    })

    if (!person || !person.name || !person.number) {
        return response.status(400).json({
            error: "No name or phone"
        })
    }

    //Si existe ya una persona con el mismo nombre
    if(existingPerson){
        return response.status(400).json({
            error: "The name already exist in the phonebook"
        })
    }else{
        newPerson.save()
        .then(savedNote=>{
            response.json(savedNote)
        })
        .catch(err=>console.error(err))
    }
    
})

app.put('/api/persons/:id', (request, response, next)=>{
    const {id}=request.params

    //Como las validaciones no funcionan al actualizar una nota, solo al postear una nueva nota, tenemos que pasar aquí directamente los parámetros que queremos que valide
    const { name, number } = request.body

    //'new true' nos devuelve el objeto actualizado, 'runValidators: true' Indica a mongoose que debe ejecutar las validaciones definidas al actualizar, 'context: query' me aseguro que la validación se adapte al contexto específico de la consulta de actualización
    Phone.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(result=>{
            response.json(result)
        })
        .catch(err=>next(err))
})

app.use(require('./middleware/errorHandle'))

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})