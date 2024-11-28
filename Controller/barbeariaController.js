


const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const barbeariaModel = require("../Model/barbeariaModel");

const servicoModel = require("../Model/servicoModel");

const profissionalModel = require("../Model/profissionalModel"); 
const { serialize } = require('v8');

 

module.exports = {

    store: async function(req, res) {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
    
        var sql = "SELECT * FROM usuario WHERE email = ?";
        var sql2 = "SELECT * FROM barbearia WHERE email = ?";
    
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Erro ao fazer upload:', err);
                return res.status(500).send('Erro ao fazer upload');
            }
    
            // 
            con.query(sql, fields['email'][0], function(err, result) {
                con.query(sql2, fields['email'][0], async function(err, result2) {
    
                    if (result.length > 0 || result2.length > 0) {
                        return res.render('cadastro-login-bar.ejs', {
                            aviso: "Já existe um usuário com esse e-mail!", 
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

                        try {
                            
                            var oldpath = files.nomeimg[0].filepath;
                            var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                            var ext = path.extname(files.nomeimg[0].originalFilename);
                            var nomeimg = hash + ext;
                            var newpath = path.join(__dirname, '../public/imagesBar/', nomeimg);
                            await fs.promises.rename(oldpath, newpath); // Use await para garantir a conclusão
                            console.log(`Imagem de capa cadastrada: ${nomeimg}`);
    
                            
                            let imagens = [];
                            let nomeimginteriorFiles = Array.isArray(files.nomeimginterior) ? files.nomeimginterior : [files.nomeimginterior];
    
                            for (let i = 0; i < nomeimginteriorFiles.length; i++) {
                                const file = nomeimginteriorFiles[i];
                                var oldpath2 = file.filepath;
                                var hash2 = crypto.createHash('md5').update(Date.now() + i.toString()).digest('hex');
                                var ext2 = path.extname(file.originalFilename);
                                var nomeimginterior = hash2 + ext2;
                                var newpath2 = path.join(__dirname, '../public/interiorBar/', nomeimginterior);
                                await fs.promises.rename(oldpath2, newpath2);
                                imagens.push(nomeimginterior);
                                console.log(`Imagem do interior cadastrada: ${nomeimginterior}`);
                            }
    
                            
                            if (imagens.length !== nomeimginteriorFiles.length) {
                                console.error('Número de imagens processadas não corresponde ao número esperado.');
                                return res.status(500).send('Erro ao processar imagens do interior');
                            }
    
                            
                            const saltRounds = 10;
                            const senha = fields['senha'][0];
                            const hashSenha = await bcrypt.hash(senha, saltRounds);
    
                            // 
                            barbeariaModel.insere(fields['nome'][0], fields['telefone'][0], fields['cep'][0], fields['estado'][0], fields['cidade'][0], fields['bairro'][0], fields['rua'][0], fields['numero'][0], fields['horaAbre'][0], fields['horaFecha'][0], fields['adicional'][0], fields['email'][0], hashSenha, nomeimg, JSON.stringify(imagens));
    
                            // 
                            res.render('login-bar.ejs', { 
                                aviso: "Cadastro de barbearia realizado com sucesso!", 
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
    
                        } catch (error) {
                            console.error('Erro ao processar cadastro:', error);
                            res.status(500).send('Erro ao processar cadastro');
                        }
                    }
                });
            });
        });
    },
    
    


logar: function(req, res)  {

    var senha = req.body['senha'];
    var email = req.body['email']
    
    var sql ="SELECT * FROM barbearia where email = ?";

    con.query(sql, [email], function (err, result) {

    if (err) throw err;
    if(result.length){
    
    bcrypt.compare(senha, result[0]['senha'], function(err, resultado) {

    if (err) throw err;

    if (resultado){

    req.session.loggedi = true;
    req.session.usernam = result[0]['nome'];
    req.session.userimag = result[0]['imagem'];
    req.session.userid = result[0]['id'];


    res.render('home.ejs', {aviso: "Login realizado com sucesso!", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} ) 

    } else {res.render('login-bar.ejs', {aviso: "Senha inválida", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} ) }
    });
    } else{ res.render('login-bar.ejs', {aviso: "E-mail não encontrado", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} ) }
    });

},


    index: async function(req, res) {
    barbeariaModel.buscaTodos()
    .then(result=> res.render('listagem-bar.ejs', {dadosBarbearia: result, aviso:" ", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
    .catch(err=> console.error(err));

    },


    indexAgendar: async function(req, res) {


        if (req.session.loggedin) {
    
            barbeariaModel.buscaTodos()
            .then(result=> res.render('listagem-bar.ejs', {dadosBarbearia: result, aviso:"Escolha a barbearia e depois o profissional que deseja agendar!", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
            .catch(err=> console.error(err));
            
            } else if (req.session.loggedi){
            
            res.render('home.ejs',  {aviso:"Você precisa estar logado como usuário para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
        
            }else {

            res.render('home.ejs',  {aviso:"Você precisa fazer login para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );

            }


       
    
        },
    


        mostra: async function(req, res) {
            var id = req.params.id;
            barbeariaModel.busca(id)
              .then(result => {
               
                const dados = result[0];
                
               
                dados.imagens_interior = JSON.parse(dados.imagem_interior);
                
                res.render('listagem-bard.ejs', { 
                  dadosBarbearia: [dados], 
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
              })
              .catch(err => console.error(err));
          },






          destroy: function(req, res) {

            var id = req.params.id;
            barbeariaModel.busca(id)

            if (req.session.adm || req.session.loggedi && req.session.userid == id) {
                
        
                //
                barbeariaModel.busca(id)

                    .then(result => {

                        if (result.length > 0 && result[0]['imagem']) {
                            var imgBarbearia = path.join(__dirname, '../public/imagesBar/', result[0]['imagem']);
                            if (fs.existsSync(imgBarbearia)) {
                                return new Promise((resolve, reject) => {
                                    fs.unlink(imgBarbearia, (err) => {
                                        if (err) {
                                            console.error('Erro ao deletar imagem da barbearia:', err);
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                });
                            }
                        }
                    })

                    barbeariaModel.busca(id)

                    .then(result => {

                         // 
                    const imagensInterior = JSON.parse(result[0]['imagem_interior'] || '[]');
                    const deletePromises = imagensInterior.map(img => {
                        const imgPath = path.join(__dirname, '../public/interiorBar/', img);
                        console.log('Tentando deletar imagem do interior:', imgPath);
                        return fs.promises.unlink(imgPath)
                            .then(() => console.log('Imagem do interior deletada:', img))
                            .catch(err => {
                                console.error('Erro ao deletar imagem do interior:', err);
                                // 
                                if (err.code === 'ENOENT') return; 
                                throw err; 
                            });
                    });

                    return Promise.all(deletePromises);
                

                     })

                    .then(() => {
                        // 
                        return barbeariaModel.deletaAgendamentos(id);
                    })
                    .then(() => {
                        
                        return barbeariaModel.deletaNotas(id);
                    })
                    .then(() => {
                        
                        return servicoModel.buscaserbar(id);
                    })
                    .then(servicos => {
                        
                        return Promise.all(servicos.map(servico => {

                            console.log('Serviços encontrados:', servicos);
                            if (servico.imagem) {
                                var imgServico = path.join(__dirname, '../public/imagesSer/', servico.imagem);
                                console.log('Tentando deletar a imagem do serviço:', imgServico);
                                if (fs.existsSync(imgServico)) {
                                    return new Promise((resolve, reject) => {
                                        fs.unlink(imgServico, (err) => {
                                            if (err) {
                                                console.error('Erro ao deletar imagem do serviço:', err);
                                                
                                                reject(err);
                                            } else {
                                                console.log('Imagem do serviço deletada com sucesso');
                                                resolve();
                                            }
                                        });
                                    });
                                }
                            }
                            return Promise.resolve(); 
                        }))
                        .then(() => {
                            return Promise.all(servicos.map(servico => {
                                return servicoModel.deletaProserPorServico(servico.id).then(() => {
                                    return servicoModel.deleta(servico.id);
                                });
                            }));
                        });
                    })
                    .then(() => {
                        
                        return profissionalModel.buscaprobar(id);
                    })
                    .then(profissionais => {
                    
                        return Promise.all(profissionais.map(profissional => {
                            if (profissional.imagem) {
                                var imgProfissional = path.join(__dirname, '../public/imagesPro/', profissional.imagem);
                                if (fs.existsSync(imgProfissional)) {
                                    return new Promise((resolve, reject) => {
                                        fs.unlink(imgProfissional, (err) => {
                                            if (err) {
                                                console.error('Erro ao deletar imagem do profissional:', err);
                                                reject(err);
                                            } else {
                                                resolve();
                                            }
                                        });
                                    });
                                }
                            }
                            return Promise.resolve(); 
                        }))
                        .then(() => {
                            return Promise.all(profissionais.map(profissional => {
                                return profissionalModel.deletaNotas(profissional.id).then(() => {
                                    return profissionalModel.deletaProser(profissional.id).then(() => {
                                        return profissionalModel.deleta(profissional.id);
                                    });
                                });
                            }));
                        });
                    })
                    .then(() => {
                        
                        return barbeariaModel.deleta(id);
                    })
                    .then(() => {

                        if(req.session.adm) {

                            res.render('home.ejs', { 
                                aviso: "Barbearia deletada com sucesso!", 
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

                             
                        req.session.destroy(function(err) {
                            res.render('home.ejs', { 
                                aviso: "Barbearia deletada com sucesso!", 
                                nome: "", 
                                profile: "", 
                                loggedin: false, 
                                nom: "", 
                                profil: "", 
                                loggedi: false, 
                                boolean: false, 
                                bid: "", 
                                bid2: "" 
                            });
                        });
                    

                        }
                    })
                    .catch(err => {
                        console.error('Erro ao deletar barbearia e dependências:', err);
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
        
            


         




        filtrar: function (req, res) {
            const { estado, cidade, bairro, nota } = req.query;
        
            let filtro = barbeariaModel.filtrarBarbearias({ estado, cidade, bairro, nota });
        
            filtro
            .then(result => {
                
                result.forEach(dados => {
                    dados.media = dados.media || 0; 
                });
        
                if (result.length === 0) {
                    res.render('listagem-bar.ejs', {
                        dadosBarbearia: result,
                        aviso: "Nenhuma barbearia atende a esses filtros",
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
                    res.render('listagem-bar.ejs', {
                        dadosBarbearia: result,
                        aviso: "",
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
            })
            .catch(err => console.error(err));
        },


              
mostraagen: async function(req, res) {



    const id = req.params.id;

    if(req.session.loggedi && req.session.userid == id) {

        try {

            const result = await barbeariaModel.buscaparaagen(id);
    
            console.log('ID da barbearia:', id);

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
            
               
                await barbeariaModel.atualizaStatus(dado.id_agendamento, novoStatus);
            });

      
        await Promise.all(promessasAtualizacao);

        let aviso = '';


        if (result.length === 0) {
            aviso = "Você não tem nenhum agendamento!";
        }

        console.log("Aviso:", aviso);
           
    
            res.render('listagem-agendamento-bar.ejs', { dadosagendamento: result, aviso:aviso, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid
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



    const result = await barbeariaModel.buscadetalhes(id);


    if(req.session.loggedi && result.length > 0 && result[0].fk_id === req.session.userid) {

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





        edit: async function(req, res) {

                    
            var id = req.params.id;

            
            if (req.session.loggedi && req.session.userid == id) {


                barbeariaModel.busca(id)

                .then(result=> res.render('edicao-barbearia.ejs', {dadosBarbearia: result, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
                .catch(err=> console.error(err));

            }else {

                res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                
            }
                
            },






    update: function(req, res) {



        var id = req.params.id;

        if (req.session.loggedi && req.session.userid == id) {
    
                var formidable = require('formidable');
                var form = new formidable.IncomingForm();
    
                
            form.parse(req, (err, fields, files) => {
    
                if(files.imagem && files.imagem.length > 0 ){


                barbeariaModel.busca(id)

                 .then(result=>{ var img = path.join(__dirname, '../public/imagesBar/', result[0]['imagem']);
                 fs.unlink(img, (err) => {});
                 })
                 .catch(err=>
                 console.error(err)
                 );
    
    
                var oldpath = files.imagem[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

                var ext = path.extname(files.imagem[0].originalFilename)
                var imagem = hash + ext
                var newpath = path.join(__dirname, '../public/imagesBar/', imagem);
    
            fs.rename(oldpath, newpath, function (err) {
        
                if (err) throw err;
            });
        
             barbeariaModel.atualiza( fields['nome'][0], fields['telefone'][0], fields['cep'][0], fields['estado'][0], fields['cidade'][0], fields['bairro'][0], fields['rua'][0], fields['numero'][0], fields['horaAbre'][0], fields['horaFecha'][0], fields['adicional'][0], imagem, id)   

             req.session.usernam = fields['nome'][0];
             req.session.userimag = imagem;

            
           
            res.render('home.ejs', { aviso: "Perfil editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});


            
        } else {

              barbeariaModel.atualizaSemIMG( fields['nome'][0], fields['telefone'][0], fields['cep'][0], fields['estado'][0], fields['cidade'][0], fields['bairro'][0], fields['rua'][0], fields['numero'][0], fields['horaAbre'][0], fields['horaFecha'][0], fields['adicional'][0], id)

              req.session.usernam = fields['nome'][0];
           

            res.render('home.ejs', { aviso: "Perfil editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
        }
            
        });


         } else {

            res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })

         }
            
        },





        editimg: async function(req, res) {

                    
            var id = req.params.id;

            
            if (req.session.loggedi && req.session.userid == id) {


                barbeariaModel.busca(id)

                .then(result=> res.render('edicao-barbeariaimg.ejs', {dadosBarbearia: result, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
                .catch(err=> console.error(err));

            }else {

                res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                
            }
                
            },
        


            updateimg: function(req, res) {
                var id = req.params.id;
            
                if (req.session.loggedi && req.session.userid == id) {
                    var formidable = require('formidable');
                    var form = new formidable.IncomingForm();
            
                    form.parse(req, async (err, fields, files) => {
                       
                       
                        try {
                            // 
                            const result = await barbeariaModel.busca(id);
            
                            // 
                            const imagensAnteriores = JSON.parse(result[0]['imagem_interior'] || '[]');
                            const deletarImagens = imagensAnteriores.map(img => {
                                const imgPath = path.join(__dirname, '../public/interiorBar/', img);
                                return fs.promises.unlink(imgPath)
                                    .catch(err => console.error('Erro ao deletar imagem:', err));
                            });
            
                            await Promise.all(deletarImagens);
            
                            // 
                            let novasImagens = [];
                            let nomeimginteriorFiles = Array.isArray(files.nomeimginterior) ? files.nomeimginterior : [files.nomeimginterior];
            
                            for (const file of nomeimginteriorFiles) {
                                const oldpath = file.filepath;
                                const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                                const ext = path.extname(file.originalFilename);
                                const novoNomeImg = hash + ext;
                                const newpath = path.resolve(__dirname, '../public/interiorBar/', novoNomeImg);
            
                                
                                console.log(`Movendo imagem de interior de: ${oldpath} para: ${newpath}`);
            
                                try {
                                    await fs.promises.rename(oldpath, newpath);
                                    novasImagens.push(novoNomeImg);
                                    console.log(`Nova imagem do interior cadastrada: ${novoNomeImg}`);
                                } catch (error) {
                                    console.error('Erro ao mover o arquivo:', file.originalFilename, 'Erro:', error);
                                }
                            }
            
                            
                            await barbeariaModel.atualizaimg(JSON.stringify(novasImagens), id);
            
            
                            res.render('home.ejs', { 
                                aviso: "Imagens do interior editadas com sucesso!", 
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
            
                        } catch (error) {
                            console.error('Erro ao editar imagens:', error);
                            res.render('home.ejs', { 
                                aviso: "Erro ao editar imagens!", 
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




