



const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const usuarioModel = require("../Model/usuarioModel");




module.exports = {


// ---------------------------------------------------


/// Usado para cadastrar um novo usuário cliente
 
    store: function(req, res) {

         var sql = "SELECT * FROM usuario where email = ?"
         var sql2 = "SELECT * FROM barbearia where email = ?"

         var formidable = require('formidable');
         var form = new formidable.IncomingForm();
           
         form.parse(req, (err, fields, files) => {

            con.query(sql, fields['email'][0], function (err, result) { 
            con.query(sql2, fields['email'][0], function (err, result2) { 

                if( result.length > 0 ){

                    res.render('cadastro-login-user.ejs', {aviso: "Já existe um usuário com esse e-mail!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm} )
            
                }  else if( result2.length > 0 ) { 

                    res.render('cadastro-login-user.ejs', {aviso: "Já existe um usuário com esse e-mail!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm} )

                }  else { 


        var oldpath = files.nomeimg[0].filepath;
        var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        var ext = path.extname(files.nomeimg[0].originalFilename)
        var nomeimg = hash + ext
        var newpath = path.join(__dirname, '../public/imagesUser/', nomeimg);

    fs.rename(oldpath, newpath, function (err) {
 
        if (err) throw err;
    });

    const saltRounds = 10;
    const senha = fields['senha'][0];
    bcrypt.hash(senha, saltRounds, function(err, hash) {   
    usuarioModel.insere( fields['nome'][0], fields['telefone'][0], fields['email'][0], hash, nomeimg)
    });
    

       

   res.render('login-user.ejs', {aviso: "Cadastro de usuário realizado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm} ) 


    }


        });
    });

});

    },



// ---------------------------------------------------


/// Usado para se logar no sistema como usuário cliente

        logar: function(req, res)  {

            var senha = req.body['senha'];
            var email = req.body['email']
            
            var sql ="SELECT * FROM usuario where email = ?";

            con.query(sql, [email], function (err, result) {

            if (err) throw err;
            if(result.length){
            
            bcrypt.compare(senha, result[0]['senha'], function(err, resultado) {

            if (err) throw err;

            if (resultado){

            req.session.loggedin = true;
            req.session.username = result[0]['nome'];
            req.session.userimage = result[0]['imagem'];
            req.session.adm = result[0]['isAdmin'];
            req.session.userid = result[0]['id'];



            res.render('home.ejs', {aviso: "Login realizado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid2: req.session.userid  } ) 

            } else {res.render('login-user.ejs', {aviso: "Senha inválida", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid2: req.session.userid } ) }
            });
            } else{ res.render('login-user.ejs', {aviso: "E-mail não encontrado", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid2: req.session.userid } ) }
            });



        },



// ---------------------------------------------------


/// Usado para ver o seu perfil de usuário cliente baseado no ID

        mostra: async function(req, res) {


            var id = req.params.id;
            
            
            if(req.session.loggedin && req.session.userid == id || req.session.adm){

            
            usuarioModel.busca(id)

            .then(result=> res.render('listagem-user.ejs', {dadosusuario: result, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
            .catch(err=> console.error(err));

             } else {

                res.render('home.ejs',  {aviso:"Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );

             }
            
            },



// ---------------------------------------------------


/// Usado pelo ADM para ver todos os usuários clientes que estão cadastrados no sistema em ordem alfabética

        index: async function(req, res) {

        if(req.session.adm) { 

        usuarioModel.buscaTodos()
        .then(result => {
                    
        result.sort((a, b) => {
        if (a.nome < b.nome) return -1;
        if (a.nome > b.nome) return 1;
        return 0;

        });
            
        res.render('listagem-user-adm.ejs', {dadosusuario: result, aviso:"", nom: req.session.usernam,profil: req.session.userimag,loggedi: req.session.loggedi,nome: req.session.username,profile: req.session.userimage,loggedin: req.session.loggedin,boolean: req.session.adm,bid: req.session.userid,bid2: req.session.userid});
                
    })
                .catch(err => console.error(err));


                }else { 
                    res.render('home.ejs',  {aviso:"Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
                } 

            },



// ---------------------------------------------------





            destroy: function(req, res) {
                var id = req.params.id;

                if (req.session.adm || req.session.userid == id) {
                    
                    usuarioModel.deletaAgendamento(id)
                    .then(() => {
                        // 
                        return usuarioModel.deletafk(id);
                    })
                    .then(() => {
                    
                        return usuarioModel.busca(id);
                    })
                    .then(result => {
                        if (result.length > 0 && result[0]['imagem']) {
                            var img = path.join(__dirname, '../public/imagesUser/', result[0]['imagem']);
                            return new Promise((resolve, reject) => {
                                fs.unlink(img, (err) => {
                                    if (err) {
                                        console.error('Erro ao deletar imagem do usuário:', err);
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        }
                        return Promise.resolve(); 
                    })
                    .then(() => {
                        // 
                        return usuarioModel.deleta(id);
                    })
                    .then(() => {
                        if (req.session.adm) {
                            res.render('home.ejs', {
                                aviso: "Usuário deletado com sucesso!",
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
                                    aviso: "Conta deletada com sucesso!",
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
                        console.error('Erro ao deletar conta do usuário:', err);
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



// ---------------------------------------------------


/// Usado para acessar a tela de edição de perfil do usuário cliente baseado no ID


        edit: async function(req, res) {

                
            
            var id = req.params.id;

            
            if (req.session.loggedin && req.session.userid == id) {

        

                usuarioModel.busca(id)

                .then(result=> res.render('edicao-usuario.ejs', {dadosusuario: result, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid}))
                .catch(err=> console.error(err));


            }else {


                res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                
            }
                
            },



// ---------------------------------------------------

/// Atualiza os atributos escolhidos para o perfil do usuário cliente baseado no ID



            update: function(req, res) {



                var id = req.params.id;

                if (req.session.loggedin && req.session.userid == id) {
    
                var formidable = require('formidable');
                var form = new formidable.IncomingForm();
    
                
    
            form.parse(req, (err, fields, files) => {
    
                if(files.imagem && files.imagem.length > 0 ){


                usuarioModel.busca(id)

                 .then(result=>{ var img = path.join(__dirname, '../public/imagesUser/', result[0]['imagem']);
                 fs.unlink(img, (err) => {});
                 })
                 .catch(err=>
                 console.error(err)
                 );
    
    
                var oldpath = files.imagem[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

                var ext = path.extname(files.imagem[0].originalFilename)
                var imagem = hash + ext
                var newpath = path.join(__dirname, '../public/imagesUser/', imagem);
    
            fs.rename(oldpath, newpath, function (err) {
        
                if (err) throw err;
            });
        
            usuarioModel.atualiza( fields['nome'][0], fields['telefone'][0], imagem, id)

            req.session.username = fields['nome'][0];
            req.session.userimage = imagem;
           
            res.render('home.ejs', { aviso: "Perfil editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});


            
        } else {

            usuarioModel.atualizaSemIMG( fields['nome'][0], fields['telefone'][0], id)

            req.session.username = fields['nome'][0];

            res.render('home.ejs', { aviso: "Perfil editado com sucesso!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
        }
            
        });


         } else {

            res.render('home.ejs', {aviso: "Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })

         }
            
        },



// ---------------------------------------------------

/// Utilizado pelo ADM como filtro de listagem de usuários pelo nome



        filtrar1: function (req, res) { 

           

                const { nome } = req.query;
    
                let filtro1 = usuarioModel.filtrarusuarios({ nome });
        
                filtro1

                
    
                .then(result=> {


                    if (result.length === 0) {
                       
                    
                        res.render('listagem-user-adm.ejs', {dadosusuario: result, aviso: "Nenhum usuário atende a esses filtros", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid })
                        

                    } else {


                        res.render('listagem-user-adm.ejs', {dadosusuario: result, aviso:"", nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});

                } 
             

            })
            
            .catch(err=> console.error(err));

         },



// ---------------------------------------------------


}









