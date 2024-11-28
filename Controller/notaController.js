







const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const notaModel = require("../Model/notaModel"); 
const profissionalModel = require("../Model/profissionalModel"); 
const barbeariaModel = require("../Model/barbeariaModel");




module.exports = {



    
    index: async function(req, res) {

        const id = req.params.id;

        try {


            const result = await notaModel.buscaavabar(id);


            res.render('listagem-avabar.ejs', { dadosava: result, aviso:'',  nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid

            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },


    index2: async function(req, res) {

        const id = req.params.id;

        try {

            const result = await notaModel.buscaavapro(id);

            res.render('listagem-avapro.ejs', { dadosava: result, aviso:'',  nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid

            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },



    mostraNomes: async function(req, res) {
            
        const id = req.params.id;

        console.log("ID recebido para buscar :", id);  
    
        try {

            if (req.session.loggedin && req.session.adm == 0) {

                const result = await barbeariaModel.busca(id);

    
                res.render('cadastro-avabar.ejs', { 
                    dadosbarbearia: result,  
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

            } else {

                res.render('home.ejs',  {aviso:"Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );

            }


        } catch (err) {
            console.error("Erro ao buscar serviços:", err);  
            res.status(500).send('Server error');
        }

    },




    mostraNomes2: async function(req, res) {
            
        const id = req.params.id;

        console.log("ID recebido para buscar :", id);  
    
        try {

            if (req.session.loggedin && req.session.adm == 0) {

                const result = await profissionalModel.busca(id);

    
                res.render('cadastro-avapro.ejs', { 
                    dadosprofissional: result,  
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

            } else {

                res.render('home.ejs',  {aviso:"Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );

            }


        } catch (err) {
            console.error("Erro ao buscar serviços:", err);  
            res.status(500).send('Server error');
        }

    },




    store: async function(req, res) {


        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
    
        console.log('Dados recebidos:', req.body);
        
    
        const fk_id_barbearia = req.body.id_barbearia;
        const comentario = req.body.comentario;
        const nota = req.body.rate; 
        const fk_id_usuario = req.session.userid; 



                const jaAvaliou = await notaModel.buscaavabarja(fk_id_barbearia, fk_id_usuario);
            
                if (jaAvaliou.length > 0) {
                    return res.render('home.ejs', { 
                        aviso: "Você já avaliou essa barbearia!", 
                        nome: req.session.username,
                        profile: req.session.userimage,
                        loggedin: req.session.loggedin,
                        nom: req.session.usernam,
                        profil: req.session.userimag,
                        loggedi: req.session.loggedi,
                        boolean: req.session.adm,
                        bid: req.session.userid,
                        bid2: req.session.userid 
                    });
        
        
        } else {

                notaModel.insere( fk_id_usuario, fk_id_barbearia, comentario, nota)


                .then(() => {
                    res.render('home.ejs', { aviso: "Avaliação realizada com sucesso!", nome: req.session.username,profile: req.session.userimage,loggedin: req.session.loggedin,nom: req.session.usernam,profil: req.session.userimag,loggedi: req.session.loggedi,boolean: req.session.adm,bid: req.session.userid, bid2: req.session.userid });
                })
                .catch(err => {
                    console.error('Error inserting service:', err);
                    res.status(500).send('Server error');
                });


            } 


       

            

    },




    store2: async function(req, res) {


        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
    
        console.log('Dados recebidos:', req.body);
    
       
        const fk_id_profissional = req.body.id_profissional;
        const comentario = req.body.comentario;
        const nota = req.body.rate; 
        const fk_id_usuario = req.session.userid; 



        const jaAvaliou = await notaModel.buscaavaproja(fk_id_profissional, fk_id_usuario);
    
            if (jaAvaliou.length > 0) {
                return res.render('home.ejs', { 
                    aviso: "Você já avaliou esse profissional!", 
                    nome: req.session.username,
                    profile: req.session.userimage,
                    loggedin: req.session.loggedin,
                    nom: req.session.usernam,
                    profil: req.session.userimag,
                    loggedi: req.session.loggedi,
                    boolean: req.session.adm,
                    bid: req.session.userid,
                    bid2: req.session.userid 
                });


    } else {

           await notaModel.insere2( fk_id_usuario, fk_id_profissional, comentario, nota)
        .then(() => {
            res.render('home.ejs', { aviso: "Avaliação realizada com sucesso!", nome: req.session.username,profile: req.session.userimage,loggedin: req.session.loggedin,nom: req.session.usernam,profil: req.session.userimag,loggedi: req.session.loggedi,boolean: req.session.adm,bid: req.session.userid, bid2: req.session.userid });
        })
        .catch(err => {
            console.error('Error inserting service:', err);
            res.status(500).send('Server error');
        });

        }


        

            

    },



    destroy: function(req, res) {

        if(req.session.adm || req.session.loggedin) { 
   
        var id = req.params.id;
         
        notaModel.busca(id)
        
       
        notaModel.deleta(id)

        
        .then(() => {
            res.render('home.ejs', { aviso: "Avaliação deletada com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
            });
        })

        .catch(err => {
            console.error('Error inserting service:', err);
            res.status(500).send('Server error');
        
            
        });


        } else {

            res.render('home.ejs', { 
                aviso: "Você não tem permissão para acessar essa página!", 
                nome: req.session.username, 
                profile: req.session.userimage, 
                loggedin: req.session.loggedin, 
                nom: req.session.usernam, 
                profil: req.session.userimag, 
                loggedi: req.session.loggedi, 
                boolean: req.session.adm, 
                bid: req.session.userid, 
                bid2: req.session.userid 
            });

        }
        
},






   
     
   

}





