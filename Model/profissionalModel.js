



con = require("../config/db.js").pool;



module.exports = {



// ---------------------------------------------------

    

    async buscaTodos() {
        var sql = "SELECT * FROM profissional";
        return new Promise((resolve, reject) => {
            con.query(sql, async (err, rows) => {
                if (err) return reject(err);
                

                for (const row of rows) {
                    row.media = await this.calculaMedia(row.id);
                }
                resolve(rows);
            });
        });

    },




// ---------------------------------------------------




async busca(id) {
    var sql ="SELECT * FROM profissional where id = ?";
    return new Promise((resolve, reject) => {
    con.query(sql, id, (err, row) => {
    if (err) return reject(err);
    resolve(row);
    });
    });
   
    },



// ---------------------------------------------------




 insere(fk_id, nome, email, horaComeca, horaTermina, nomeimg) {
    
        const sql = "INSERT INTO profissional (fk_id, nome, email, horaComeca, horaTermina, imagem) VALUES ?";
        const values = [[fk_id, nome, email, horaComeca, horaTermina, nomeimg]];
        
        return new Promise((resolve, reject) => {

            con.query(sql, [values], function (err, result) {
                if (err) return reject(err);
                console.log("Numero de registros inseridos: " + result.affectedRows);
                resolve(result);
                
            });
        });


},



// ---------------------------------------------------



insereServico(profissionalId, servicoId) {
    const sql = "INSERT INTO proser (profissional_id, servico_id) VALUES (?, ?)";
    
    return new Promise((resolve, reject) => {
        con.query(sql, [profissionalId, servicoId], function (err, result) {
            if (err) return reject(err);
            console.log("Número de registros inseridos na tabela proser: " + result.affectedRows);
            resolve(result);
        });
    });
},



// ---------------------------------------------------


async buscaprobar(id) {
    const sql = `
    SELECT 
        b.id AS bar_id, b.nome AS nome_bar, p.id, p.nome, p.email, p.horaComeca, p.horaTermina, p.imagem, p.fk_id, 
        GROUP_CONCAT(s.nome SEPARATOR ', ') AS servico,
        COALESCE((SELECT AVG(nota_profissional) FROM notas WHERE fk_id_profissional = p.id), 0) AS media
    FROM 
        profissional p 
    JOIN 
        barbearia b ON p.fk_id = b.id
    LEFT JOIN 
        proser ps ON p.id = ps.profissional_id  -- Mudança para LEFT JOIN
    LEFT JOIN 
        servico s ON ps.servico_id = s.id     -- Mudança para LEFT JOIN
    WHERE 
        p.fk_id = ? 
    GROUP BY 
        p.id
`;

    return new Promise((resolve, reject) => {
        con.query(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
},




// ---------------------------------------------------



async buscapro(id) {
    const sql = `
        SELECT 
            p.id, 
            p.nome, 
            p.email, 
            p.horaComeca, 
            p.horaTermina, 
            p.imagem, 
            p.fk_id, 
            GROUP_CONCAT(CONCAT(s.id) SEPARATOR ', ') AS servicoId, 
            GROUP_CONCAT(CONCAT(s.nome, ' (R$', s.preco, ')') SEPARATOR ', ') AS servico,
            (SELECT GROUP_CONCAT(CONCAT(data, ' ', horario)) FROM agendamento WHERE fk_id_profissional = p.id) AS agendamentos
        FROM 
            profissional p  
        JOIN 
            proser ps ON p.id = ps.profissional_id  
        JOIN 
            servico s ON ps.servico_id = s.id  
        WHERE 
            p.id = ?  
        GROUP BY 
            p.id
    `;

    console.log('ID do profissional:', id);
   
    return new Promise((resolve, reject) => {
        con.query(sql, [id], (err, row) => {
            if (err) return reject(err);
           
            resolve(row);
        });
    });
},



// ---------------------------------------------------




        deleta(id) {

            var sql = "DELETE FROM profissional WHERE id = ?";
            return new Promise((resolve, reject) => {
                con.query(sql, id, function (err, result) {
                    if (err) return reject(err);
                    console.log("Número de registros Apagados: " + result.affectedRows);
                    resolve(result);
                });
            });
        },


// ---------------------------------------------------
      
    
    
        atualiza(nome, email, horaComeca, horaTermina, imagem, id){
    
            var sql = "UPDATE profissional SET nome = ?, email = ?, horaComeca = ?, horaTermina = ?, imagem = ? WHERE id = ?";
            var values = [ [nome], [email],[horaComeca], [horaTermina], [imagem], [id]];
            con.query(sql, values, function (err, result) {
            if (err) throw err;
            console.log("Numero de registros atualizados: " + result.affectedRows);
            });
            },
    


// ---------------------------------------------------


        
    
        atualizaSemIMG(nome, email, horaComeca, horaTermina, id){
            var sql = "UPDATE profissional SET nome = ?, email = ?, horaComeca = ?, horaTermina = ? WHERE id = ?";
            var values = [ [nome] ,[email],[horaComeca], [horaTermina], [id]];
            con.query(sql, values, function (err, result) {
            if (err) throw err;
            console.log("Numero de registros atualizados: " + result.affectedRows);
            });
                
        
        
            },



// ---------------------------------------------------
        

            async buscaprofissionalPorServico(barbeariaId, servicoId) {
                const sql = `
                    SELECT 
                        p.*, 
                        AVG(n.nota_profissional) AS media, 
                        GROUP_CONCAT(s.nome SEPARATOR ', ') AS servico  
                    FROM 
                        profissional p 
                    LEFT JOIN 
                        proser ps ON p.id = ps.profissional_id 
                    LEFT JOIN 
                        servico s ON ps.servico_id = s.id 
                    LEFT JOIN 
                        Notas n ON p.id = n.fk_id_profissional 
                    WHERE 
                        p.fk_id = ? AND ps.servico_id = ? 
                    GROUP BY 
                        p.id`;

                return new Promise((resolve, reject) => {
                    con.query(sql, [barbeariaId, servicoId], (err, row) => {
                        if (err) return reject(err);
                        resolve(row);
                    });
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



removeServicos(profissionalId) {
    const sql = "DELETE FROM proser WHERE profissional_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [profissionalId], (err, result) => {
            if (err) return reject(err);
            console.log("Serviços removidos: " + result.affectedRows);
            resolve(result);
        });
    });
},

// ---------------------------------------------------


async calculaMedia(fk_id_profissional) {
    const sql = "SELECT AVG(nota_profissional) as media FROM notas WHERE fk_id_profissional = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [fk_id_profissional], (err, result) => {
            if (err) return reject(err);
            const media = result[0].media || 0; // Garantir que a média não seja null
            console.log(`Média para profissional ${fk_id_profissional}: ${media}`); // Log para depuração
            resolve(media); 
        });
    });
},




deletaProser(profissionalId) {
    const sql = "DELETE FROM proser WHERE profissional_id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [profissionalId], function(err, result) {
            if (err) return reject(err);
            console.log("Número de registros apagados de proser: " + result.affectedRows);
            resolve(result);
        });
    });
},

deletaAgendamento(profissionalId) {
    const sql = "DELETE FROM agendamento WHERE fk_id_profissional = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [profissionalId], function(err, result) {
            if (err) return reject(err);
            console.log("Número de registros apagados de agendamento: " + result.affectedRows);
            resolve(result);
        });
    });
},

deletaNotas(profissionalId) {
    const sql = "DELETE FROM Notas WHERE fk_id_profissional = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [profissionalId], function(err, result) {
            if (err) return reject(err);
            console.log("Número de registros apagados de Notas: " + result.affectedRows);
            resolve(result);
        });
    });
},


async buscaPorDataEProfissional(data, id_profissional) {
    const sql = "SELECT horario FROM agendamento WHERE data = ? AND fk_id_profissional = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [data, id_profissional], (err, rows) => {
            if (err) return reject(err);
            console.log("Horários retornados:", rows); // Adicionado para depuração
            resolve(rows);
        });
    });
},





}




