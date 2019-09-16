//criando o meu objeto
const express = require('express')
const objeto = express()
const banco_de_dados = require('./banco_de_dados.js')
const md5 = require("md5")
//porta do meu servidor
const porta_http = 8000

objeto.listen(porta_http, () => {
    console.log(`Servidor rodando na porta ${porta_http}`)
});

//GET
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
            //"message":"Exibindo usuário pelo id",
            "data":row
        })
      });
});
//POST
//postando valores

var bodyParser = require("body-parser");
objeto.use(bodyParser.urlencoded({ extended: false }));
objeto.use(bodyParser.json());

objeto.post("/api/usuarios/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("Nenhum password especificado");
    }
    if (!req.body.email){
        errors.push("Nenhum email especificado");
    }
    if (errors.length){
        res.status(400).json({"Os erros cometidos foram:":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO usuario (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    banco_de_dados.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "Novo usuário postado com sucesso",
            "data": data,
            "id" : this.lastID
        })
    });
})

//PATCH
//atualizando valores
objeto.patch("/api/usuarios/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    banco_de_dados.run(
        `UPDATE usuario set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        //aqui usar o método coalesce para manter o valor atual caso ele não seja nulo
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "Usuário atualizado com Sucesso",
                data: data,
                changes: this.changes
            })
    });
})

//DELETE
objeto.delete("/api/usuarios/:id", (req, res, next) => {
    banco_de_dados.run(
        'DELETE FROM usuario WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"Usuário deletado com sucesso!", changes: this.changes})
    });
})