require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    app.emit('pronto'); // mongoose já substitui o driver do MongoDB
  })
  .catch(e => console.log(e));

const session = require('express-session'); // identificar navegador do cliente, salvar um cookie e mandar cookie ao servidor sempre que acessar, afirmando que podemos confiar nas sessão
const MongoStore = require('connect-mongo'); // para falar que as sessões são salvas na base de dados
const flash = require('connect-flash'); // mensagem autodestrutiva, para aparecer e sumir depois de vista
const routes = require('./routes'); // todas as rotas, /home, /users
const path = require('path');
const helmet = require('helmet'); // documentação do Express
const csrf = require('csurf'); // todos os formulários têm que ter csrfToken para segurança!!!
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // middlewares funções executadas na rota, uma coisa passa para a outra!

app.use(helmet());

app.use(express.urlencoded({ extended: true })); // padrão para postar formulários para dentro da aplicação
app.use(express.json()); // também faz a mesma coisa, é importante 
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}); // configurações de sessões



app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); 
app.set('view engine', 'ejs'); // erngine usada para renderizar ejs

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
}); // mandando a aplicação escutar tudo!!