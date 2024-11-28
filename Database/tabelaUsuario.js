



var mysql = require('mysql');

var con = mysql.createConnection({

 host: "localhost",
 user: "root",
 password: "",
 database: "Tccbarber"
 
});


con.connect(function(err) {

    if (err) throw err;
    console.log("Conectado!");

    var sql = "CREATE TABLE usuario (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), telefone varchar(255), email VARCHAR(255), senha VARCHAR(255), imagem VARCHAR(255), isAdmin BOOLEAN NOT NULL DEFAULT false)";

    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela usuario criada");
    
        });


        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        const senha = "123adm";

    
        bcrypt.hash(senha, saltRounds, function(err, hash) {
        var sql = "INSERT INTO usuario (nome, telefone, email, senha, imagem, isAdmin) VALUES ?";
    
        var values = [['Administração', '(51) 91234-0129', 'contatoBarberPro@gmail.com', hash, 'adm.jpg', true]];
    
        con.query(sql, [values], function (err, result) {
    
        if (err) throw err;
        console.log("Numero de registros inseridos: " + result.affectedRows);
    
        });



    
        con.end();
        
            }); 

       });
    