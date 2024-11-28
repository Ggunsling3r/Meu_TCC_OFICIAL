











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


    var sql = "CREATE TABLE proser (id INT AUTO_INCREMENT PRIMARY KEY, profissional_id INT NOT NULL,  servico_id INT NOT NULL,  FOREIGN KEY (profissional_id) REFERENCES profissional(id), FOREIGN KEY (servico_id) REFERENCES servico(id), UNIQUE KEY unique_profissional_servico (profissional_id, servico_id))";



    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela proser criada");
    
        });
    
        con.end();
    
       });
    


   