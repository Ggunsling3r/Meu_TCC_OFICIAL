

con = require("../config/db.js").pool;



module.exports = {



// ---------------------------------------------------
 
                
        async buscaTodos() {
            var sql = "SELECT * FROM barbearia";
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
                var sql ="SELECT * FROM barbearia where id = ?";
                return new Promise((resolve, reject) => {
                con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
                });
                });
            
                },


// ---------------------------------------------------





async buscaNOME(id) {
    var sql = "SELECT nome FROM barbearia WHERE id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]); // Retorna o primeiro item do array
        });
    });
},




// ---------------------------------------------------



            insere(nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, adicional, email, senha, nomeimg, nomeimginterior){

                var sql = "INSERT INTO barbearia (nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, adicional, email, senha,  imagem, imagem_interior) VALUES ?";
                var values = [[nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, adicional, email, senha,  nomeimg, nomeimginterior]];
                
                con.query(sql, [values], function (err, result) {

                if (err) throw err;
                console.log("Numero de registros inseridos: " + result.affectedRows);

                });
            },


// ---------------------------------------------------


            deleta(id) {

                var sql = "DELETE FROM barbearia WHERE id = ?";
                return new Promise((resolve, reject) => {
                    con.query(sql, id, function (err, result) {
                        if (err) return reject(err);
                        console.log("Número de registros Apagados: " + result.affectedRows);
                        resolve(result);
                    });
                });
            },



// ---------------------------------------------------


            filtrarBarbearias(filtro) {
                let sql = `
                    SELECT b.*, 
                        (SELECT AVG(nota_barbearia) FROM notas WHERE fk_id_barbearia = b.id) as media 
                    FROM barbearia b 
                    WHERE 1=1
                `;
                let params = [];

                if (filtro.estado) {
                    sql += " AND b.estado = ?";
                    params.push(filtro.estado);
                }
                if (filtro.cidade) {
                    sql += " AND b.cidade = ?";
                    params.push(filtro.cidade);
                }
                if (filtro.bairro) {
                    sql += " AND b.bairro = ?";
                    params.push(filtro.bairro);
                }

                // Filtragem de notas
                if (filtro.nota !== undefined && filtro.nota !== '') {
                    if (filtro.nota === '0') {
                        sql += " HAVING media IS NULL OR media = 0"; // Inclui barbearias com média 0 ou sem avaliações
                    } else {
                        sql += " HAVING ROUND(media) = ?"; // Filtrando pela média arredondada
                        params.push(filtro.nota);
                    }
                }

                return new Promise((resolve, reject) => {
                    con.query(sql, params, (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    });
                });
            },




// ---------------------------------------------------

 
            async buscaparaagen(id) {

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
                        p.fk_id = ?  
                    ORDER BY 
                        a.data ASC
                `;
                return new Promise((resolve, reject) => {
                    con.query(sql, [id], (err, row) => {
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
                        p.fk_id,

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


atualiza(nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, adicional, imagem, id){

    var sql = "UPDATE barbearia SET nome = ?, telefone = ?, cep = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, numero = ?, horaAbre = ?, horaFecha = ?, adicional = ?, imagem = ? WHERE id = ?";

    var values = [ [nome], [telefone], [cep], [estado], [cidade], [bairro], [rua], [numero], [horaAbre], [horaFecha], [adicional], [imagem], [id]];

    con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("Numero de registros atualizados: " + result.affectedRows);
    });
    },



// ---------------------------------------------------




atualizaSemIMG(nome, telefone, cep, estado, cidade, bairro, rua, numero, horaAbre, horaFecha, adicional, id){

    var sql = "UPDATE barbearia SET nome = ?, telefone = ?, cep = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, numero = ?, horaAbre = ?, horaFecha = ?, adicional = ? WHERE id = ?";

    var values = [ [nome], [telefone], [cep], [estado], [cidade], [bairro], [rua], [numero], [horaAbre], [horaFecha], [adicional], [id]];

    con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("Numero de registros atualizados: " + result.affectedRows);
    });
        


    },


// ---------------------------------------------------


atualizaimg( imagem_interior , id){

    var sql = "UPDATE barbearia SET imagem_interior = ? WHERE id = ?";

    var values = [ [imagem_interior], [id]];

    con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("Numero de registros atualizados: " + result.affectedRows);
    });
    },




    async calculaMedia(fk_id_barbearia) {
        const sql = "SELECT AVG(nota_barbearia) as media FROM notas WHERE fk_id_barbearia = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [fk_id_barbearia], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].media || 0); 
            });
        });
    
    },




    deletaAgendamentos(barbeariaId) {
        const sql = "DELETE FROM agendamento WHERE fk_id_servico IN (SELECT id FROM servico WHERE fk_id = ?)";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de agendamentos apagados: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    
    deletaNotas(barbeariaId) {
        const sql = "DELETE FROM Notas WHERE fk_id_barbearia = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de notas apagadas: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    
    buscaServicos(barbeariaId) {
        const sql = "SELECT id FROM servico WHERE fk_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },
    
    deletaServicos(barbeariaId) {
        const sql = "DELETE FROM servico WHERE fk_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de serviços apagados: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    
    buscaProfissionais(barbeariaId) {
        const sql = "SELECT id FROM profissional WHERE fk_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },
    
    deletaNotasProfissional(profissionalId) {
        const sql = "DELETE FROM Notas WHERE fk_id_profissional = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [profissionalId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de notas do profissional apagadas: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    
    deletaProserProfissional(profissionalId) {
        const sql = "DELETE FROM proser WHERE profissional_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [profissionalId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de registros apagados de proser do profissional: " + result.affectedRows);
                resolve(result);
            });
        });
    },
    
    deletaProfissionais(barbeariaId) {
        const sql = "DELETE FROM profissional WHERE fk_id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, [barbeariaId], function(err, result) {
                if (err) return reject(err);
                console.log("Número de profissionais apagados: " + result.affectedRows);
                resolve(result);
            });
        });
    },




    deletarImagensInterior: function(imagens) {
        const deletePromises = imagens.map(img => {
            const imgPath = path.join(__dirname, '../public/interiorBar/', img);
            console.log('Tentando deletar imagem do interior:', imgPath);
            return fs.promises.stat(imgPath) // Verifica se o arquivo existe
                .then(() => fs.promises.unlink(imgPath))
                .then(() => console.log('Imagem do interior deletada:', img))
                .catch(err => {
                    console.error('Erro ao deletar imagem do interior:', err);
                    // Retornar resolução se a imagem não existir
                    if (err.code === 'ENOENT') return; 
                    throw err; // Rejeitar para outros erros
                });
        });
    
        return Promise.all(deletePromises);
    }







}



