module.exports=errorHandle = (error, request, response, next) => {
    console.error(error)

    if(error.name === 'CastError'){
        return response.status(400).send( {error: 'Malformated ID'} )
    }else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}