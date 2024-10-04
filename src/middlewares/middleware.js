exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success'); // para funcionar, precisa do locals.success, senão dá erro!!
  res.locals.user = req.session.user; // aqui colocam-se os locals, entender por quê.
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }

  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if(!req.session.user) { // se o usuário não está logado (! diferente da função)
    req.flash('errors', 'Você precisa fazer login.');
    req.session.save(() => res.redirect('/')); // salve a sessão para para redirecionar a página para garantir que foi salva antes de REDIRECIONAR / redirecionará quem não estiver logado acessando a página. se não estiver logado, manda pra home
    return; // o return não deixa passar para o middleware abaixo
  }

  next();
};