




con = require("../config/db.js").pool;



module.exports = {



// ---------------------------------------------------

    
async buscaTodos() {

    var sql ="SELECT * FROM servico";

    return new Promise((resolve, reject) => {

    con.query(sql, (err, row) => {
    if (err) return reject(err);
    resolve(row);

    });
});

},



// ---------------------------------------------------


async busca(id) {
    var sql ="SELECT * FROM servico where id = ?";
    return new Promise((resolve, reject) => {
    con.query(sql, id, (err, row) => {
    if (err) return reject(err);
    resolve(row);
    });
    });
   
    },



// ---------------------------------------------------




 insere(fk_id, nome, tempo, preco, nomeimg) {
    
        const sql = "INSERT INTO servico (fk_id, nome, tempo, preco, imagem) VALUES ?";
        const values = [[fk_id, nome, tempo, preco, nomeimg]];
        
        return new Promise((resolve, reject) => {

            con.query(sql, [values], function (err, result) {
                if (err) return reject(err);
                console.log("Numero de registros inseridos: " + result.affectedRows);
                resolve(result);
                
            });
        });


},


// ---------------------------------------------------


        async buscaserbar(id) {

           

            const sql = "SELECT s.id AS id, s.fk_id AS fk_id, s.nome AS nome, s.tempo AS tempo, s.preco AS preco, s.imagem AS imagem, b.id AS bar_id, b.nome AS nome_bar FROM servico s JOIN barbearia b ON s.fk_id = b.id WHERE fk_id = ?"; 
            
            return new Promise((resolve, reject) => {
                con.query(sql, [id], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });

            

        },


       
    
// ---------------------------------------------------







    deleta(id) {

        var sql = "DELETE FROM servico WHERE id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros Apagados: " + result.affectedRows);
                resolve(result);
            });
        });
    },



// ---------------------------------------------------


    atualiza(nome, tempo, preco, imagem, id){

        var sql = "UPDATE servico SET nome = ?, tempo = ?, preco = ?, imagem = ? WHERE id = ?";
        var values = [ [nome], [tempo],[preco], [imagem], [id]];
        con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Numero de registros atualizados: " + result.affectedRows);
        });
        },



// ---------------------------------------------------


    atualizaSemIMG(nome, tempo, preco, id){
        var sql = "UPDATE servico SET nome = ?, tempo = ?, preco = ? WHERE id = ?";
        var values = [ [nome], [tempo],[preco], [id]];
        con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Numero de registros atualizados: " + result.affectedRows);
        });
            
    
    
        },
    


// ---------------------------------------------------



        async buscaServicosAssociados(profissionalId) {
            const sql = "SELECT servico_id FROM proser WHERE profissional_id = ?";
            return new Promise((resolve, reject) => {
                con.query(sql, [profissionalId], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        },
 

    // ---------------------------------------------------
    


    deletaProserPorServico(servicoId) {
        const sql = "DELETE FROM proser WHERE servico_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [servicoId], function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros Apagados de proser: " + result.affectedRows);
                resolve(result);
            });
        });
    
    },
    
    
    
    deletaAgendamentoPorServico(servicoId) {
        const sql = "DELETE FROM agendamento WHERE fk_id_servico = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [servicoId], function (err, result) {
                if (err) return reject(err);
                console.log("Número de registros Apagados de agendamento: " + result.affectedRows);
                resolve(result);
            });
        });
    },



}







