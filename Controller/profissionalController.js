




const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const profissionalModel = require("../Model/profissionalModel"); 

const servicoModel = require("../Model/servicoModel");

const barbeariaModel = require("../Model/barbeariaModel");



module.exports = {



// ---------------------------------------------------
    
            store: function(req, res) {

                var formidable = require('formidable');
                var form = new formidable.IncomingForm();
            
            form.parse(req, (err, fields, files) => {

                var oldpath = files.nomeimg[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                var ext = path.extname(files.nomeimg[0].originalFilename)
                var nomeimg = hash + ext
                var newpath = path.join(__dirname, '../public/imagesPro/', nomeimg);

            fs.rename(oldpath, newpath, function (err) {
        
                if (err) throw err;
            });


        
            const fk_id = req.session.userid;  
            const servicos = fields.servicos || []; 


            if (servicos.length === 0) {
                return res.render('home.ejs', {
                    aviso: "Você precisa selecionar um serviço da barbearia para o(a) profissional!",
                    nome: req.session.username,
                    profile: req.session.userimage,
                    loggedin: req.session.loggedin,
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


                profissionalModel.insere(fk_id, fields['nome'][0], fields['email'][0], fields['horaComeca'][0], fields['horaTermina'][0], nomeimg)

            .then(result => {
                if (!result.insertId) {
                    throw new Error('Insert ID not returned');
                }
                return Promise.all(servicos.map(servicoId => 
                    profissionalModel.insereServico(result.insertId, servicoId)
                ));
            })

                .then(() => {
                    res.render('home.ejs', {aviso: "Cadastro de profissional realizado com sucesso!", nome: req.session.username,profile: req.session.userimage,loggedin: req.session.loggedin,nom: req.session.usernam,profil: req.session.userimag,loggedi: req.session.loggedi,boolean: req.session.adm,bid: req.session.userid, bid2: req.session.userid
                    });
                })
                .catch(err => {
                    console.error('Error inserting service:', err);
                    res.status(500).send('Server error');
                });


            }


        
            });
            
        },




// ---------------------------------------------------



            mostra: async function(req, res) {
                const id = req.params.id;


                try {
                    const profissionais = await profissionalModel.buscaprobar(id);
                    console.log('Profissionais encontrados:', profissionais); 
                    const servicos = await servicoModel.buscaserbar(id);

                    const barbearia = await barbeariaModel.buscaNOME(id);

                    let aviso = '';


                        if (profissionais.length === 0) {
                            aviso = "Nenhum profissional cadastrado nesta barbearia!";
                        }

                        console.log("Aviso:", aviso); 

                    res.render('listagem-probar.ejs', { 
                        dadosprofissional: profissionais, 
                        dadosservico: servicos,
                        nome_bar: barbearia.nome,
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



// ---------------------------------------------------




mostraAgendamento: async function(req, res) {
    
    if (req.session.loggedin) {
        const id = req.params.id;
        const selectedDate = req.query.date;

        try {
            const result = await profissionalModel.buscapro(id);
            let agendamentos = [];

            if (selectedDate) {
                agendamentos = await profissionalModel.buscaPorDataEProfissional(selectedDate, id);
            }

            const horariosIndisponiveis = agendamentos.map(a => a.horario);
            console.log("Horários indisponíveis:", horariosIndisponiveis); 
            console.log("data selecionada:", selectedDate); 


            res.render('fazer-agendamento.ejs', {
                dadosprofissional: result,
                horariosIndisponiveis,
                agendamentos,
                selectedDate,
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
    } else {
        res.render('home.ejs', {
            aviso: "Você não tem permissão para acessar essa página!",
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
    }
},




// ---------------------------------------------------




                filtrar: async function(req, res) {

            
                    const barbeariaId = req.params.id;
                    const servicoId = req.body.servicoId;



                    try {
                        const profissionais = await profissionalModel.buscaprofissionalPorServico(barbeariaId, servicoId);

                        const barbearia = await barbeariaModel.buscaNOME(barbeariaId);

                        let aviso = '';

                        
                        if (profissionais.length === 0) {
                            aviso = "Nenhum profissional atende a esses filtros!";
                        }

                        console.log("Aviso:", aviso); 
                       
                 
                        
                        res.render('listagem-probar.ejs', {
                            dadosprofissional: profissionais,
                            nome_bar: barbearia.nome,
                            aviso: aviso, 
                            dadosservico: await servicoModel.buscaserbar(barbeariaId),
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
               




// ---------------------------------------------------



            destroy: function(req, res) {
                if (req.session.loggedi) {
                    var id = req.params.id;
 
                    
                    Promise.all([
                        profissionalModel.deletaAgendamento(id),

                        profissionalModel.deletaProser(id),
                        
                        profissionalModel.deletaNotas(id)
                    ])
                    .then(() => {
                        
                        return profissionalModel.busca(id);
                    })
                    .then(result => {
                        if (result.length > 0) {
                            var img = path.join(__dirname, '../public/imagesPro/', result[0]['imagem']);
                            fs.unlink(img, (err) => {
                                if (err) console.error('Erro ao deletar imagem:', err);
                            });
                        }
                    })
                    .then(() => {
                       
                        return profissionalModel.deleta(id);
                    })
                    .then(() => {
                        res.render('home.ejs', { 
                            aviso: "Profissional deletado(a) com sucesso!", 
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
                        console.error('Erro ao deletar profissional:', err);
                        res.status(500).send('Server error');
                    });
                } else {
                    res.status(403).send('Acesso não autorizado.');
                }
            },




// ---------------------------------------------------



        edit: async function(req, res) {

            var id = req.params.id;

            const result = await profissionalModel.busca(id);

            if (req.session.loggedi && result.length > 0 && result[0].fk_id === req.session.userid ) {

                
        

                try {
                    const profissional = await profissionalModel.busca(id);
                    const servicos = await servicoModel.buscaserbar(profissional[0].fk_id); 
                    const servicosAssociados = await profissionalModel.buscaServicosAssociados(id); 
        

                    res.render('edicao-profissional.ejs', { 

                        dadosprofissional: profissional, 
                        dadosservicos: servicos,
                        servicosAssociados: servicosAssociados,
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

                } catch (err) {

                    console.error(err);
                    res.status(500).send('Server error');

                }

            } else {

                res.render('home.ejs', { aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid });

            }
        

                
            },



// ---------------------------------------------------

update: function(req, res) {
    var id = req.params.id;
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const servicos = fields.servicos || [];
        let imagem;

        
        profissionalModel.busca(id)
            .then(result => {
                const imagemAntiga = result[0]['imagem'];
                const imgPath = path.join(__dirname, '../public/imagesPro/', imagemAntiga);

                
                if (files.imagem && files.imagem.length > 0) {
                    fs.unlink(imgPath, (err) => {
                        if (err) console.error(err); 

                        var oldpath = files.imagem[0].filepath;
                        var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                        var ext = path.extname(files.imagem[0].originalFilename);
                        imagem = hash + ext;
                        var newpath = path.join(__dirname, '../public/imagesPro/', imagem);

                        fs.rename(oldpath, newpath, function(err) {
                            if (err) throw err;
                        });
                    });
                }

                
                return profissionalModel.deletaProser(id)
                    .then(() => {
                    
                        if (imagem) {
                            return profissionalModel.atualiza(
                                fields['nome'][0],
                                fields['email'][0],
                                fields['horaComeca'][0],
                                fields['horaTermina'][0],
                                imagem,
                                id
                            );
                        } else {
                            return profissionalModel.atualizaSemIMG(
                                fields['nome'][0],
                                fields['email'][0],
                                fields['horaComeca'][0],
                                fields['horaTermina'][0],
                                id
                            );
                        }
                    });
            })
            .then(() => {
                
                return Promise.all(servicos.map(servicoId => 
                    profissionalModel.insereServico(id, servicoId)
                ));
            })
            .then(() => {
                res.render('home.ejs', { aviso: "Profissional editado(a) com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Server error');
            });
    });
},



// ---------------------------------------------------




}



