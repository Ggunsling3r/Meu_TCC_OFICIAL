




con = require("../config/db.js").pool;



module.exports = {

   

// ---------------------------------------------------

    async atualizaStatus(idAgendamento, novoStatus) {

        return new Promise((resolve, reject) => {

            const query = 'UPDATE agendamento SET status = ? WHERE id = ?';

            con.query(query, [novoStatus, idAgendamento], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },



// ---------------------------------------------------



    async insere(fk_id_usuario, fk_id_profissional, fk_id_servico, data, horario) {


        return new Promise((resolve, reject) => {


            const sql = "INSERT INTO agendamento (fk_id_usuario, fk_id_profissional, fk_id_servico, data, horario) VALUES ?";
            const values = [[fk_id_usuario, fk_id_profissional, fk_id_servico, data, horario]];
    
            con.query(sql, [values], (err, result) => {

                if (err) {
                    return reject(err); 
                }

                console.log("Número de registros inseridos: " + result.affectedRows);
                resolve(result); 

            });
        });

    },



// ---------------------------------------------------
    

        async busca(id) {
            var sql = `
                SELECT 
                    a.id AS id_agendamento,

                    u.nome AS nome_cliente,
                    u.telefone AS telefone_cliente,

                    p.nome AS nome_profissional,

                    s.nome AS nome_servico,
                    s.preco AS preco_servico,
                    s.tempo AS duracao_servico,

                    a.data AS data_agendamento,
                    a.horario AS horario_agendamento,
                    a.status AS status_agendamento

                FROM 
                    agendamento a
                    JOIN usuario u ON a.fk_id_usuario = u.id
                    JOIN profissional p ON a.fk_id_profissional = p.id
                    JOIN servico s ON a.fk_id_servico = s.id
                WHERE 
                    a.fk_id_usuario = ?
                ORDER BY 
                    data_agendamento ASC
            `;
            return new Promise((resolve, reject) => {
                con.query(sql, id, (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });

        },



        

        async busca2(id) {
            var sql ="SELECT * FROM agendamento where id = ?";
            return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
            if (err) return reject(err);
            resolve(row);
            });
            });
        
            },





// ---------------------------------------------------



        async buscadetalhes(id) {


            var sql = `

            SELECT 
                u.nome AS nome_cliente, 
                u.telefone AS telefone_cliente,
                
                
                p.nome AS nome_profissional, 
                p.imagem AS imagem_profissional, 
                
                
                s.nome AS nome_servico, 
                s.tempo AS tempo_servico, 
                s.preco AS preco_servico, 
                
                b.nome AS nome_barbearia, 
                b.telefone AS telefone_barbearia,
                b.estado, 
                b.cidade, 
                b.bairro, 
                b.rua, 
                b.numero, 
                b.imagem AS imagem_barbearia,
                
                a.id,
                a.data, 
                a.horario,
                a.status,
                a.fk_id_usuario
                
            FROM 
                agendamento a
            JOIN 
                usuario u ON a.fk_id_usuario = u.id
            JOIN 
                profissional p ON a.fk_id_profissional = p.id 
            JOIN 
                servico s ON a.fk_id_servico = s.id
            JOIN 
                barbearia b ON p.fk_id = b.id
            WHERE 
                a.id = ?;
                    
        `;
        return new Promise((resolve, reject) => {
            con.query(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });



        },


// ---------------------------------------------------



deleta(id) {

    var sql = "DELETE FROM agendamento WHERE id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, function (err, result) {
            if (err) return reject(err);
            console.log("Número de registros Apagados: " + result.affectedRows);
            resolve(result);
        });
    });
},


async buscaPorStatus(idUsuario, status) {
    let sql = `
        SELECT 
            a.id AS id_agendamento,
            u.nome AS nome_cliente,
            u.telefone AS telefone_cliente,
            p.nome AS nome_profissional,
            s.nome AS nome_servico,
            s.preco AS preco_servico,
            s.tempo AS duracao_servico,
            a.data AS data_agendamento,
            a.horario AS horario_agendamento,
            a.status AS status_agendamento
        FROM 
            agendamento a
            JOIN usuario u ON a.fk_id_usuario = u.id
            JOIN profissional p ON a.fk_id_profissional = p.id
            JOIN servico s ON a.fk_id_servico = s.id
        WHERE 
            a.fk_id_usuario = ?`;

    if (status !== '') {
        sql += ' AND a.status = ?';
    }

    sql += ' ORDER BY data_agendamento ASC;';

    return new Promise((resolve, reject) => {
        const params = [idUsuario];
        if (status !== '') {
            params.push(parseInt(status, 10)); // Certifique-se de que o status é um número
        }

        con.query(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
},




async buscaPorStatusBarbearia(idBarbearia, status) {
    let sql = `
        SELECT 
            a.id AS id_agendamento,
            u.nome AS nome_cliente,
            u.telefone AS telefone_cliente,
            p.nome AS nome_profissional,
            s.nome AS nome_servico,
            s.preco AS preco_servico,
            s.tempo AS duracao_servico,
            a.data AS data_agendamento,
            a.horario AS horario_agendamento,
            a.status AS status_agendamento
        FROM 
            agendamento a
            JOIN usuario u ON a.fk_id_usuario = u.id
            JOIN profissional p ON a.fk_id_profissional = p.id
            JOIN servico s ON a.fk_id_servico = s.id
        WHERE 
            p.fk_id = ?`;

    if (status !== '') {
        sql += ' AND a.status = ?';
    }

    sql += ' ORDER BY a.data ASC;';

    return new Promise((resolve, reject) => {
        const params = [idBarbearia];
        if (status !== '') {
            params.push(parseInt(status, 10)); // Certifique-se de que o status é um número
        }

        con.query(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
},



}



