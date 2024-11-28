var session = require('express-session');
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const path = require('path');
const mysql = require('mysql');
const formidable = require('formidable');


// controlles aqui 

const usuarioController = require("./Controller/usuarioController");
const barbeariaController = require("./Controller/barbeariaController");
const servicoController = require('./Controller/servicoController');
const profissionalController = require("./Controller/profissionalController");
const { redirect } = require('express/lib/response');
const agendamentoController = require('./Controller/agendamentoController');
const notaController = require('./Controller/notaController');




app.use(session({
    secret: '2C44-4D44-WppQ38S', 
    resave: false, 
    saveUninitialized: true
    }));



app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use( express.static("public") );


// ROTAS //




// serviço //

app.get('/cadastro-ser/:bid',function(req,res){

    const id = req.params.bid;

    if (req.session.loggedi && req.session.userid == id) {
    res.render('cadastro-servico.ejs',  { nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
    }else {
    res.render('home.ejs',  {aviso:"Você não tem permissão para acessar essa página!", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
    }



});


// profissional //





// clientes //




app.get('/cadastro-user',function(req,res){
    res.render('cadastro-login-user.ejs',  {aviso:"", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
});


app.get('/login-user',function(req,res){
    res.render('login-user.ejs', {aviso:"", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
   });


app.get('/logout',function(req,res){
    req.session.destroy(function(err) {

    })
    res.redirect('/');
   });


// barbearias //

app.get('/cadastro-bar',function(req,res){
    res.render('cadastro-login-bar.ejs',  {aviso:"", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
});

app.get('/login-bar',function(req,res){
    res.render('login-bar.ejs', {aviso:"", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
   });
   

   app.get('/logoutbar',function(req,res){
    req.session.destroy(function(err) {

    })
    res.redirect('/');
   });



// geral //

app.get('/',function(req,res){
    if (req.session.loggedin) {
     res.render('home.ejs', {nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid,  aviso:"" });
       }else {
     res.render('home.ejs', {nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid,  aviso:"" })
     req.session.loggedin = false;
     req.session.loggedi = false;

      }
    });


app.get('/cadastro',function(req,res){
    res.render('confirm-cadastro.ejs',  {nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid} );
});



app.get('/login',function(req,res){
    res.render('confirm-login.ejs', {aviso:"", nome: req.session.username, profile: req.session.userimage, loggedin: req.session.loggedin, nom: req.session.usernam, profil: req.session.userimag, loggedi: req.session.loggedi, boolean: req.session.adm, bid: req.session.userid, bid2: req.session.userid});
   });





   




// ROTAS DE CONTROLLER //


// usuario //

app.post('/cadastrar', usuarioController.store);

app.post('/logar', usuarioController.logar);

app.get('/verper/:id', usuarioController.mostra);

app.get('/listagem-user-adm',usuarioController.index);

app.get('/apagau/:id', usuarioController.destroy);

app.get('/editaru/:id', usuarioController.edit)

app.post('/fazedicaou/:id', usuarioController.update);

app.get('/filtra', usuarioController.filtrar1);



// barbearia //

app.post('/cadastrarbar', barbeariaController.store);

app.post('/logarbar', barbeariaController.logar);

app.get('/listagem-bar',barbeariaController.index);

app.get('/listagem-bard/:id', barbeariaController.mostra);

app.get('/apagab/:id', barbeariaController.destroy);

app.get('/filtrar', barbeariaController.filtrar);

app.get('/bagendamentos/:id', barbeariaController.mostraagen);

app.get('/dagendab/:id', barbeariaController.mostradetalhes);

// app.get('/verperb/:id', barbeariaController.mostrap);

app.get('/editarb/:id', barbeariaController.edit)

app.post('/fazedicaob/:id', barbeariaController.update);

app.get('/editarimg/:id', barbeariaController.editimg)

app.post('/fazedicaoimg/:id', barbeariaController.updateimg);





// servico // 

app.post('/cadastrarser/:id', servicoController.store);

app.get('/listagem-serbar/:id', servicoController.mostra);

app.get('/apagars/:id', servicoController.destroy);

app.get('/editars/:id', servicoController.edit)

app.post('/fazedicaos/:id', servicoController.update);



// profissional // 


app.get('/cadastro-pro/:bid', servicoController.mostraNomes);

app.post('/cadastrarpro/:id', profissionalController.store);

app.get('/listagem-probar/:id', profissionalController.mostra);

app.get('/apagarp/:id', profissionalController.destroy);

app.get('/editarp/:id', profissionalController.edit)

app.post('/fazedicaop/:id', profissionalController.update);

app.post('/filtrarpro/:id', profissionalController.filtrar);






// agendamento // 

app.get('/agendar', barbeariaController.indexAgendar);
 
app.get('/ragendar/:id',  profissionalController.mostraAgendamento);

app.post('/fagendar',  agendamentoController.store);

app.get('/agendamentos/:id', agendamentoController.mostra);

app.get('/dagenda/:id', agendamentoController.mostradetalhes);

app.get('/apagaragen/:id', agendamentoController.destroy);

app.get('/filtraragen-user/', agendamentoController.filtraruser);

app.get('/filtraragen-bar', agendamentoController.filtrarbar);



// notas avaliações //

app.get('/avabar/:id', notaController.index);

app.get('/cadastro-avabar/:id', notaController.mostraNomes);

app.post('/salvar', notaController.store);


app.get('/avapro/:id', notaController.index2);

app.get('/cadastro-avapro/:id', notaController.mostraNomes2);

app.post('/salvar2', notaController.store2);

app.get('/apagarava/:id', notaController.destroy);




// FIM DAS ROTAS //


app.listen(3000,function(){
    console.log("Servidor Escutando na porta 3000");
});













