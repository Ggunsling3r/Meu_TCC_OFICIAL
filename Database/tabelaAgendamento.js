





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

    var sql = "CREATE TABLE agendamento ( id INT AUTO_INCREMENT PRIMARY KEY, fk_id_usuario INT , fk_id_profissional INT, fk_id_servico INT, data DATE, horario TIME, status BOOLEAN NOT NULL DEFAULT false, FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id), FOREIGN KEY (fk_id_profissional) REFERENCES profissional(id),   FOREIGN KEY (fk_id_servico) REFERENCES servico(id))";


    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela agendamento criada");
    
        });
    
        con.end();
    
       });
    


   