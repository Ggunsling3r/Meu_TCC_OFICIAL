















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

    var sql = "CREATE TABLE Notas (id_nota INT AUTO_INCREMENT PRIMARY KEY, fk_id_barbearia INT, fk_id_profissional INT, fk_id_usuario INT, comentario VARCHAR(255), nota_barbearia INT CHECK(nota_barbearia BETWEEN 0 AND 5), nota_profissional INT CHECK(nota_profissional BETWEEN 0 AND 5), FOREIGN KEY (fk_id_barbearia) REFERENCES barbearia(id), FOREIGN KEY (fk_id_profissional) REFERENCES profissional(id), FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id), UNIQUE (fk_id_barbearia, fk_id_usuario), UNIQUE (fk_id_profissional, fk_id_usuario) );";


    con.query(sql, function (err, result) {

        if (err) throw err;
        console.log("Tabela notas criada");
    
        });
    
        con.end();
    
       });
    


   