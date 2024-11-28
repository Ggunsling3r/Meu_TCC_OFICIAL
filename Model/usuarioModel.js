const { deletaAgendamento } = require("./profissionalModel.js");


con = require("../config/db.js").pool;



module.exports = {


// ---------------------------------------------------

    
async buscaTodos() {

    var sql ="SELECT * FROM usuario WHERE email != 'contato@BarberPro.com'";

    return new Promise((resolve, reject) => {

    con.query(sql, (err, row) => {
    if (err) return reject(err);
    resolve(row);

    });
});

},



// ---------------------------------------------------




async busca(id) {
    var sql ="SELECT * FROM usuario where id = ?";
    return new Promise((resolve, reject) => {
    con.query(sql, id, (err, row) => {
    if (err) return reject(err);
    resolve(row);
    });
    });
   
    },


// ---------------------------------------------------


insere(nome, telefone, email, senha, nomeimg){

    var sql = "INSERT INTO usuario (nome, telefone, email, senha, imagem) VALUES ?";
    var values = [[nome, telefone, email, senha, nomeimg]];
    
    con.query(sql, [values], function (err, result) {

    if (err) throw err;
    console.log("Numero de registros inseridos: " + result.affectedRows);

    });
},


// ---------------------------------------------------


deleta(id) {

    var sql = "DELETE FROM usuario WHERE id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, function (err, result) {
            if (err) return reject(err);
            console.log("Número de registros Apagados: " + result.affectedRows);
            resolve(result);
        });
    });
},


// ---------------------------------------------------


atualiza(nome, telefone, imagem, id){

    var sql = "UPDATE usuario SET nome = ?, telefone = ?, imagem = ? WHERE id = ?";
    var values = [ [nome], [telefone], [imagem], [id]];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("Numero de registros atualizados: " + result.affectedRows);
    });
    },



// ---------------------------------------------------




atualizaSemIMG(nome, telefone, id){
    var sql = "UPDATE usuario SET nome = ?, telefone = ? WHERE id = ?";
    var values = [ [nome], [telefone], [id]];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("Numero de registros atualizados: " + result.affectedRows);
    });
        


    },


// ---------------------------------------------------



    filtrarusuarios(filtro1) {

        let sql = "SELECT * FROM usuario WHERE 1=1 and email != 'contato@BarberPro.com' " ;

        let params = [];

        if (filtro1.nome) {
            sql += " AND nome = ?";
            params.push(filtro1.nome);
        }
       

        return new Promise((resolve, reject) => {

            con.query(sql, params, (err, rows) => {

                if (err) return reject(err);
                resolve(rows);

            });
        });
    },

    
    
// ---------------------------------------------------


deletaAgendamento: function(userId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM agendamento WHERE fk_id_usuario = ?";
        con.query(sql, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });

},


deletafk: function(userId) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Notas SET fk_id_usuario = NULL WHERE fk_id_usuario = ?";
        con.query(sql, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},




}




