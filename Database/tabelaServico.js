











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

    var sql = "CREATE TABLE servico (id INT AUTO_INCREMENT PRIMARY KEY, fk_id INT, nome VARCHAR(255), tempo VARCHAR(255), preco DECIMAL(7,2), imagem VARCHAR(255), FOREIGN KEY (fk_id) REFERENCES barbearia(id))";


    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela servico criada");
    
        });
    
        con.end();
    
       });
    


   