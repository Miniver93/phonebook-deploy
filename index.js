const express=require('express'); //Importamos el modulo express


const fs=require('fs');


const morgan=require('morgan')


const app=express(); //Creamos el servidor

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

let persons
//Aquí leo mi archivo json, le paso por parámetros la ruta, el códificador, si no lo asigno devolverá números y un callback
fs.readFile('./phonebook.json', 'utf8' ,(error,data)=>{
    
    if (error) { //Como el archivo lo que me devuelve es un string, tengo que parsear este string en un objeto json
        console.error("Cannot read JSON file",error);
        return;
    }
    try {
        persons=JSON.parse(data) //Como el archivo lo que me devuelve es un string, tengo que parsear este string en un objeto json y después de parsearlo lo almaceno en persons, donde contendrá mi agenda
        console.log("JSON file read successfully");

    } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
    }
})


app.get('/api/persons', (request,response)=>{
    response.send(persons)
})

app.get('/info', (request,response)=>{
    const entries=persons.length
    const date=new Date()
    response.send(`<p>Phonebook has info for ${entries} people</p><br>${date}`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id)
    console.log("id:",id);

    const person=persons.find(pid=> pid.id === id)


    if(person){
        response.json(person).end()
    }{
        response.status(404).end()
    }

    
})

app.delete('/api/persons/:id', (request,response)=>{
    const id=Number(request.params.id)
    persons=persons.filter(pid=> pid.id !== id) //Sobreescribeme todos los elementos de mis phonebook, excepto el que no quiero
    response.status(204).end()
})

app.post('/api/persons', (request,response)=>{
    const person=request.body
    const personNames=persons.map(person=>person.name)


    
    if (!person || !person.name || !person.number) {
        return response.status(400).json({
            error: "No name or phone"
        })
    }

    const ids=persons.map(person=>person.id)
    const maxIds=Math.max(...ids)

    const newPhone={
        id: maxIds + 1,
        name: person.name,
        number: person.number
    }


    if(personNames.includes(person.name)){
        return response.status(400).json({
            error: "The name already exist in the phonebook"
        })
    }else{
        response.status(201).json(newPhone)
        persons=[...persons, newPhone]

        //Una vez añadido a personas el nuevo numero, tengo que escribir todos los numeros que tengo ahora mismo en mi agenda
        fs.writeFile('./phonebook.json', JSON.stringify(persons), (error)=>{
            if (error) {
                console.log("Cannot write file");
            }
        })
    }
    
})



const PORT=3001
app.listen(PORT,()=>{
    console.log("Server running on port 3001");
})