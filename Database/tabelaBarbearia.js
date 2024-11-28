





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

    var sql = "CREATE TABLE barbearia (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), telefone VARCHAR(30), cep VARCHAR(255), estado VARCHAR(2), cidade VARCHAR(255), bairro VARCHAR(255), rua VARCHAR(255), numero VARCHAR(10), horaAbre TIME, horaFecha TIME, adicional VARCHAR(255), email VARCHAR(255), senha VARCHAR(255), imagem TEXT, imagem_interior TEXT)";


    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela barbearia criada");
    
        });


        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        const senha = "12345";

    
        bcrypt.hash(senha, saltRounds, function(err, hash) {

        var sql = "INSERT INTO barbearia (nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, email, senha, imagem, imagem_interior) VALUES ?";
    
        var values = [['Chico Barbearia', '(22) 98127-6789', '20010-020', 'RJ', 'Rio de Janeiro', 'Centro', 'Rua São José', '340', '12:00:00', '22:00:00', 'chico@gmail.com', hash, 'capa(1).png', JSON.stringify(['interio.jpeg']) ]];
    
        con.query(sql, [values], function (err, result) {
    
        if (err) throw err;
        console.log("Numero de registros inseridos: " + result.affectedRows);
    
        });



        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        const senha = "12345";

        bcrypt.hash(senha, saltRounds, function(err, hash) {

        var sql = "INSERT INTO barbearia (nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, email, senha, imagem, imagem_interior) VALUES ?";
        
        var values = [['Barbearia do Zé', '(11) 95437-6689', '05407-002', 'SP', 'São Paulo', 'Pinheiros', 'Rua Cardeal Arcoverde', '500', '14:00:00', '19:00:00', 'ze@gmail.com', hash, 'capa(2).png', JSON.stringify(['interiormente(1).jpg']) ]];
        
        con.query(sql, [values], function (err, result) {
        
        if (err) throw err;
        console.log("Numero de registros inseridos: " + result.affectedRows);
        
        });



        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        const senha = "12345";

        bcrypt.hash(senha, saltRounds, function(err, hash) {

        var sql = "INSERT INTO barbearia (nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, email, senha, imagem, imagem_interior) VALUES ?";
        
        var values = [['Rei da navalha', '(11) 98437-5748', '08774-080', 'SP', 'Mogi das Cruzes', 'Jardim Piatã A', 'Rua Água Doce', '232', '10:00:00', '17:30:00', 'navalha@gmail.com', hash, 'capa(3).png', JSON.stringify(['interiormente(2).jpg']) ]];
        
        con.query(sql, [values], function (err, result) {
        
        if (err) throw err;
        console.log("Numero de registros inseridos: " + result.affectedRows);
        
        });





    
        con.end();
    
    });

       });

    });

});