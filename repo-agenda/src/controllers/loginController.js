const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado'); // renderiza o ejs login-logado
  return res.render('login'); // se existe req.session.user (usuário logado!), ele renderiza a página acima
};

// a partir daqui, cria-se o REGISTRO

exports.register = async function(req, res) { // como register é async, tudo que retorna é também promise! para esperar o que a função register resolver, 
  try { // essa função register também é async!
    const login = new Login(req.body);
    await login.register(); // await aqui para esperar o método register resolver o que deve resolver 

    if(login.errors.length > 0) { // aqui repete-se o login.errors.length > 0, mas aqui colocaremos uma flash de erros!
      req.flash('errors', login.errors);
      req.session.save(function() { // salvar a sessão primeiro para redirecioná-la para a página de trás
        return res.redirect('back'); // voltar para trás
      });
      return; // return aqui para não usar a função debaixo, de fora!
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.'); // o controller é manenajdo com o Model! 
    req.session.save(function() { // salva a função vazia, o que importe é a função SESSION
      return res.redirect('back'); // o try envolve toda a função, se der erro, o catch o lançará!
    });
  } catch(e) {
    console.log(e);
    return res.render('404'); // renderiza a página 404 de erro
  }
};

// a partir daqui, cria-se o LOGIN!!

exports.login = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.login(); // cria a classe Login, pede para fazer o login, se tiver erro, aparecem as mensagens 

    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('back');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user; // 
    req.session.save(function() {
      return res.redirect('back');
    });
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');  // é bem simples. só destruir a sessão para sair 
};
