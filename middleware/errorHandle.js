module.exports=errorHandle = (error, request, response, next) => {
    console.error(error)

    if(error.name === 'CastError'){
        return response.status(400).send( {error: 'Malformated ID'} )
    }

    next(error)
}