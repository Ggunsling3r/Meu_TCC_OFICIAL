








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

    var sql = "CREATE TABLE profissional (id INT AUTO_INCREMENT PRIMARY KEY, fk_id INT, nome VARCHAR(255), email VARCHAR(255), horaComeca TIME, horaTermina TIME, imagem VARCHAR(255), FOREIGN KEY (fk_id) REFERENCES barbearia(id))";


    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela profissional criada");
    
        });
    
        con.end();
    
       });
    


   