






const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const servicoModel = require("../Model/servicoModel");




module.exports = {


    
    store: function(req, res) {

        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
    
    form.parse(req, (err, fields, files) => {

        var oldpath = files.nomeimg[0].filepath;
        var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        var ext = path.extname(files.nomeimg[0].originalFilename)
        var nomeimg = hash + ext
        var newpath = path.join(__dirname, '../public/imagesSer/', nomeimg);

    fs.rename(oldpath, newpath, function (err) {
 
        if (err) throw err;
    });

  
    const fk_id = req.session.userid;  

    servicoModel.insere(fk_id, fields['nome'][0], fields['tempo'][0], fields['preco'][0], nomeimg)

        .then(() => {
            res.render('home.ejs', {aviso: "Cadastro de serviço realizado com sucesso!",nome: req.session.username,profile: req.session.userimage,loggedin: req.session.loggedin,nom: req.session.usernam,profil: req.session.userimag,loggedi: req.session.loggedi,boolean: req.session.adm,bid: req.session.userid, bid2: req.session.userid
            });
        })
        .catch(err => {
            console.error('Error inserting service:', err);
            res.status(500).send('Server error');
        });
        
    });
    
},
 




        mostra: async function(req, res) {

            const id = req.params.id;

            try {



                const result = await servicoModel.buscaserbar(id);

                res.render('listagem-serbar.ejs', { dadosservico: result,  nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
                });
            } catch (err) {
                console.error(err);
                res.status(500).send('Server error');
            }
        },




        mostraNomes: async function(req, res) {
            
            const id = req.params.bid;

            console.log("ID recebido para buscar serviços:", id);  
        
            
            try {
                if (req.session.loggedi && req.session.userid == id) {

                    const result = await servicoModel.buscaserbar(id);

                    console.log("Serviços retornados para a barbearia de ID " + id + ":", result);  
        
                    res.render('cadastro-profissional.ejs', { 
                        dadosservico: result,  
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


                    res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                  


                }


            } catch (err) {
                console.error("Erro ao buscar serviços:", err);  
                res.status(500).send('Server error');
            }

        },



            destroy: function(req, res) {

                if (req.session.loggedi) {
                    const id = req.params.id;
            
                    servicoModel.busca(id)
                    .then(result => {
                        if (result.length > 0 && result[0]['imagem']) {
                            const img = path.join(__dirname, '../public/imagesSer/', result[0]['imagem']);
                            fs.unlink(img, (err) => {
                                if (err) console.error('Error deleting image:', err);
                            });
                        } else {
                            console.log('Nenhuma imagem encontrada para o serviço.');
                        }

            
                        
                        return servicoModel.deletaAgendamentoPorServico(id);
                    })
                    .then(() => {
                       
                        return servicoModel.deletaProserPorServico(id);
                    })
                    .then(() => {
                        
                        return servicoModel.deleta(id);
                    })
                    .then(() => {
                        res.render('home.ejs', {
                            aviso: "Serviço deletado com sucesso!",
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
                    })
                    .catch(err => {
                        console.error('Error deleting service:', err);
                        res.status(500).send('Server error');
                    });
                }
            },
        



        edit: async function(req, res) {

            var id = req.params.id;

            

            const result = await servicoModel.busca(id);

            
            if (req.session.loggedi && result.length > 0 && result[0].fk_id === req.session.userid) {

                
 
                

                servicoModel.busca(id)

                .then(result=> res.render('edicao-servico.ejs', {dadosservico: result, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
                .catch(err=> console.error(err));
            }else {
                res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                
            }
    
                
            },



            update: function(req, res) {

                var id = req.params.id;
    
                var formidable = require('formidable');
                var form = new formidable.IncomingForm();
    
                
    
            form.parse(req, (err, fields, files) => {
    
                if(files.imagem && files.imagem.length > 0 ){


                servicoModel.busca(id)

                 .then(result=>{ var img = path.join(__dirname, '../public/imagesSer/', result[0]['imagem']);
                 fs.unlink(img, (err) => {});
                 })
                 .catch(err=>
                 console.error(err)
                 );
    
    
                var oldpath = files.imagem[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

                var ext = path.extname(files.imagem[0].originalFilename)
                var imagem = hash + ext
                var newpath = path.join(__dirname, '../public/imagesSer/', imagem);
    
            fs.rename(oldpath, newpath, function (err) {
        
                if (err) throw err;
            });
        
            servicoModel.atualiza( fields['nome'][0], fields['tempo'][0], fields['preco'][0], imagem, id)
           
            res.render('home.ejs', { aviso: "Serviço editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});


            
        } else {

            servicoModel.atualizaSemIMG( fields['nome'][0], fields['tempo'][0], fields['preco'][0], id)

            res.render('home.ejs', { aviso: "Serviço editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
        }
            
        });
            
       
        },
            



}





