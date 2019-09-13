//criando o meu objeto
const express = require('express')
const objeto = express()
const banco_de_dados = require('./banco_de_dados.js')
//porta do meu servidor
const porta_http = 8000

objeto.listen(porta_http, () => {
    console.log(`Servidor rodando na porta ${porta_http}`)
});

//definindo o endpoint root
objeto.get('/', (request, response, next) => {
    response.json({"message": "Primeiro teste!"})
});

//definindo o endpoint dos usuarios 
objeto.get('/api/usuarios', (request, response, next) => {
    const sql = 'SELECT * from usuario'
    const lista = []
    banco_de_dados.all(sql, lista, (err, rows) => {
        if(err){
            response.status(400).json({"error":err.message});
            return;
        }
        response.json({
            "message": "Sucesso!",
            "data": rows
        })
    });
});
//endpoint para exibir usuario pelo id
objeto.get("/api/usuarios/:id", (req, res, next) => {
    var sql = "select * from usuario where id = ?"
    var params = [req.params.id]
    banco_de_dados.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});



// objeto.get("/api/usuarios/:id", (req, res, next) => {
//     var sql = "select * from usuario where id = ?"
//     var params = [req.params.id]
//     banco_de_dados.get(sql, params, (err, row) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           return;
//         }
//         res.json({
//             "message":"success",
//             "data":row
//         })
//       });
// });