







con = require("../config/db.js").pool;



module.exports = {

   

    async buscaavabar(id) {
        const sql = `
           SELECT 
            n.id_nota,
            n.fk_id_barbearia,
            n.fk_id_usuario,
            n.comentario,
            n.nota_barbearia,
            u.nome AS nome_usuario,
            u.imagem AS imagem_usuario,
            b.nome AS nome_barbearia,
            b.imagem AS imagem_barbearia
        FROM 
            notas n
        JOIN 
            barbearia b ON n.fk_id_barbearia = b.id
        LEFT JOIN 
            usuario u ON n.fk_id_usuario = u.id
        WHERE 
            n.fk_id_barbearia = ?;
        `; 
        
        return new Promise((resolve, reject) => {
            con.query(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },


    

            async busca(id) {
                var sql ="SELECT * FROM notas where id_nota = ?";
                return new Promise((resolve, reject) => {
                con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
                });
                });
            
                },





    async buscaavapro(id) {

           

        const sql = `

       SELECT 
        n.id_nota,
        n.fk_id_profissional,
        n.fk_id_usuario,
        n.comentario,
        n.nota_profissional,
        u.nome AS nome_usuario,
        u.imagem AS imagem_usuario,
        p.nome AS nome_profissional,
        p.imagem AS imagem_profissional
    FROM 
        notas n
    JOIN 
        profissional p ON n.fk_id_profissional = p.id
    LEFT JOIN 
        usuario u ON n.fk_id_usuario = u.id
    WHERE 
        n.fk_id_profissional = ?;
        `; 
        
        return new Promise((resolve, reject) => {
            con.query(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        
    },





    insere( fk_id_usuario, fk_id_barbearia, comentario, nota) {
        const sql = "INSERT INTO notas ( fk_id_usuario, fk_id_barbearia, comentario, nota_barbearia) VALUES ( ?, ?, ?, ?)";
        const values = [ fk_id_usuario, fk_id_barbearia, comentario, nota];
    
        return new Promise((resolve, reject) => {
            con.query(sql, values, function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros inseridos: " + result.affectedRows);
                resolve(result);
            });
        });
    },




    insere2( fk_id_usuario, fk_id_profissional, comentario, nota) {
        const sql = "INSERT INTO notas ( fk_id_usuario, fk_id_profissional, comentario, nota_profissional) VALUES ( ?, ?, ?, ?)";
        const values = [ fk_id_usuario, fk_id_profissional, comentario, nota];
    
        return new Promise((resolve, reject) => {
            con.query(sql, values, function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros inseridos: " + result.affectedRows);
                resolve(result);
            });
        });
    },



    
    deleta(id) {

        var sql = "DELETE FROM notas WHERE id_nota = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros Apagados: " + result.affectedRows);
                resolve(result);
            });
        });
    },



    async buscaavabarja(fk_id_barbearia, fk_id_usuario) {
        const sql = "SELECT * FROM notas WHERE fk_id_barbearia = ? AND fk_id_usuario = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [fk_id_barbearia, fk_id_usuario], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },
    
    async buscaavaproja(fk_id_profissional, fk_id_usuario) {
        const sql = "SELECT * FROM notas WHERE fk_id_profissional = ? AND fk_id_usuario = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [fk_id_profissional, fk_id_usuario], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },





}



