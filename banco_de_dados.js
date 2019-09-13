const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const dbsource = 'db.sqlite'

let banco_de_dados = new sqlite3.Database(dbsource, (err) => {
    if(err){
        console.error('Falha na criação de um novo banco de dados!', err.message)
        throw err
    }else{
        console.log('Conectado ao banco de dados!')
        banco_de_dados.run(`CREATE TABLE usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        //console.log('Tabela usuario criada com sucesso!')
        (err) => {
            if (err) {
                console.log('Tabela já está criada!')
                // var insert = 'INSERT or REPLACE INTO usuario (name, email, password) VALUES (?,?,?)'
                // banco_de_dados.run(insert, ["victor","victor@santos.com",md5("minhasenhasecreta")])
                // banco_de_dados.run(insert, ["suelen","suelen@simoes.com",md5("swordfish")])
            }
        });  
    }
});

module.exports = banco_de_dados //exportando o módulo