const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// try catch tirado deste arquivo, pois já tem no loginController

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = []; // quem tá checando a validação é o errors
    this.user = null;
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return; // se o array não estiver vazio, tem um erro
    this.user = await LoginModel.findOne({ email: this.body.email }); // aqui configura-se o usuário

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return; // se não existir usuário, dá erro
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) { // password e passwored hasheado
      this.errors.push('Senha inválida');
      this.user = null; // se não tiver erro, loga o usuário. o usuário foi configurado acima, garantindo-se que continue null para não dar problema
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists(); // valida o usuário com a função userExists()

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync(); // com salt, posso criar password hasheado
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  } // preenche a variável user com o LoginModel criado aqui, se o usuário for criado, é acessado de fora.

  async userExists() { // async aqui, await lá em cima!
    this.user = await LoginModel.findOne({ email: this.body.email }); // encontrando um email na página de dados que seja o email já enviado
    if(this.user) this.errors.push('Usuário já existe.'); // mensagem de usuário existente, isso é bom para checar se os dados já existem, agora na base de dados não é gerado e-mail nem senha repetidos
  }

  valida() {
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // A senha precisa ter entre 3 e 50
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = ''; // se qualquer coisa dentro da chave do body não for string, retorna vazio
      } // são os formulários do body
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;