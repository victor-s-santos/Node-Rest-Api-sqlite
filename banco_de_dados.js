const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const dbsource = 'db.sqlite'

const banco_de_dados = new sqlite3.Database(dbsource, (err) => {
    if(err){
        console.error('Falha na criação de um novo banco de dados!', err.message)
        throw err
    }else{
        console.log('Conectado ao banco de dados!')
        banco_de_dados.run(`CREATE TABLE usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome text, 
            email text UNIQUE, 
            senha text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                console.log('Tabela já está criada!')
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO usuario (nome, email, senha) VALUES (?,?,?)'
                banco_de_dados.run(insert, ["admin","admin@example.com",md5("admin123456")])
                banco_de_dados.run(insert, ["user","user@example.com",md5("user123456")])
            }
        });  
    }
});

module.exports = banco_de_dados //exportando o módulo