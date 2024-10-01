const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController');


// function meuMiddleware(req, res, next) {  // sem falar NEXT, não vai chamar a requisão e não vai terminar
//     req.session = { nome: 'Luiz', sonbrenome: 'Miranda'}
//     console.log();
//     console.log('Passei no meu middleware');
//     console.log();
//     next();
    
// }
// Rotas da home
// route.get('/', meuMiddleware, homeController.paginaInicial, function(req, res, next){
//     console.log();
//     console.log('Ainda estou aqui...');
//     console.log(`'ultimo middleware' Olha o que tem na req.session.nome ${req.session.nome}`);

// });
route.get('/', homeController.paginaInicial)
route.post('/', homeController.trataPost);

// Rotas de contato
route.get('/contato', contatoController.paginaInicial);


module.exports = route;