//criando o meu objeto
const express = require('express')
const objeto = express()

//porta do meu servidor
const porta_http = 8000

objeto.listen(porta_http, () => {
    console.log(`Servidor rodando na porta ${porta_http}`)
});

//definindo um endpoint
objeto.get('/', (request, response, next) => {
    response.json({"message": "Primeiro teste!"})
});