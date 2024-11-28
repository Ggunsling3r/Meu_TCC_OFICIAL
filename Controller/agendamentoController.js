




const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const agendamentoModel = require("../Model/agendamentoModel"); 




module.exports = {


   


    store: function(req, res) {
       

        var formidable = require('formidable');
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).send('Server error');
            }

           
            const fk_id_usuario = req.session.userid;  
            const fk_id_profissional = fields.id_profissional; 
            const fk_id_servico = fields.servicos;  
            const data = fields.date; 
            const horario = fields.horario;  

          
            agendamentoModel.insere(fk_id_usuario, fk_id_profissional, fk_id_servico, data, horario)

                .then(() => {
                    res.render('home.ejs', {aviso: "Seu agendamento foi realizado com sucesso, verifique na aba 'Meus agendamentos!'",nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid });
                    })
                .catch(err => {
                    console.error('Error inserting service:', err);
                    res.status(500).send('Server error');
                });
        });


    },


    
mostra: async function(req, res) {



    const id = req.params.id;
 
    
    if(req.session.loggedin && req.session.userid == id ) {

        try {

            const result = await agendamentoModel.busca(id);
            console.log('ID do cliente:', id);
            const agora = new Date();

            const promessasAtualizacao = result.map(async dado => {
    
              
                let dataAgendamento;
                if (dado.data_agendamento instanceof Date) {
                    dataAgendamento = new Date(dado.data_agendamento);
                } else {
                    dataAgendamento = new Date(dado.data_agendamento); 
                }
            
                const [horas, minutos] = dado.horario_agendamento.split(':').map(Number);
               
                dataAgendamento.setHours(horas, minutos, 0, 0); 
            
                console.log('Data e hora do agendamento:', dataAgendamento);
            
               
                const novoStatus = agora.getTime() > dataAgendamento.getTime() ? 1 : 0;
            
                dado.status_agendamento = novoStatus;
                console.log('Status do agendamento:', dado.status_agendamento);
            
                await agendamentoModel.atualizaStatus(dado.id_agendamento, novoStatus);
            });

      
        await Promise.all(promessasAtualizacao);

        let aviso = '';


                        if (result.length === 0) {
                            aviso = "Você não tem nenhum agendamento!";
                        }

                        console.log("Aviso:", aviso);
           
    
            res.render('listagem-agendamento-user.ejs', { dadosagendamento: result, aviso:aviso, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
            });
    
    
    
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }


       } else {


        res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })


       }

    
    

   
},




    
mostradetalhes: async function(req, res) {


    const id = req.params.id;
    

   

    const result = await agendamentoModel.buscadetalhes(id);

    if(req.session.loggedin && result.length > 0 && result[0].fk_id_usuario === req.session.userid) {

        try {

            
    
            console.log('ID do agendamento:', id);
           
    
            res.render('listagem-agendamentod.ejs', { dadosagendamento: result, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
            });
    
    
    
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }


      

    } else {

        res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })


       
    }
    

   
},






destroy: function(req, res) {

   
    var id = req.params.id;
     
    agendamentoModel.busca(id)

    agendamentoModel.deleta(id)

    
    .then(() => {
        res.render('home.ejs', { aviso: "Agendamento deletado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
        });
    })

    .catch(err => {
        console.error('Error inserting service:', err);
        res.status(500).send('Server error');
    
        
    });
    
},



filtraruser: async function(req, res) {
    const id = req.session.userid; 
    const status = req.query.status; // 

    try {
        const agendamentos = await agendamentoModel.buscaPorStatus(id, status);

        let aviso = '';
        if (agendamentos.length === 0) {
            aviso = "Nenhum agendamento encontrado para o status selecionado";
        }

        return res.render('listagem-agendamento-user.ejs', {
            dadosagendamento: agendamentos,
            aviso: aviso,
            nom: req.session.usernam,
            profil: req.session.userimag,
            loggedi: req.session.loggedi,
            nome: req.session.username,
            profile: req.session.userimage,
            loggedin: req.session.loggedin,
            boolean: req.session.adm,
            bid: req.session.userid,
            bid2: req.session.userid
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
},
   





filtrarbar: async function(req, res) {


    const id = req.session.userid; // 
    const status = req.query.status; // 

    try {
        const agendamentos = await agendamentoModel.buscaPorStatusBarbearia(id, status);

        let aviso = '';
        if (agendamentos.length === 0) {
            aviso = "Nenhum agendamento encontrado para o status selecionado";
        }

        return res.render('listagem-agendamento-bar.ejs', {
            dadosagendamento: agendamentos,
            aviso: aviso,
            nom: req.session.usernam,
            profil: req.session.userimag,
            loggedi: req.session.loggedi,
            nome: req.session.username,
            profile: req.session.userimage,
            loggedin: req.session.loggedin,
            boolean: req.session.adm,
            bid: req.session.userid,
            bid2: req.session.userid
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
},
   







}




