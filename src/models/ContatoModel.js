const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' }, // padão string vazia
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}; // quando o contato for salvo, será salvo na variável this.contato

Contato.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido'); // se o email for enviado valida, senão, passa para o próximo
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.'); // se não for enviado o nome, dá problema, ele é obrigatório (true)
  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.'); // ou o email ou o telefone são necessários, sozinhos
  }
};

Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contato.prototype.edit = async function(id) {
  if(typeof id !== 'string') return; // se for diferente de string, mata o script
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true }); // id e o this.body corpo do formulário, quando atualizar os dados, eles serão jogados no contato daqui.
};

// Métodos estáticos - não têm THIS


Contato.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async function() {
  const contatos = await ContatoModel.find() // até dava para filtrar 
    .sort({ criadoEm: -1 }); // contatos em ordem decrescente!!!
  return contatos;
};

Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({_id: id}); // achao id e apaga! nesse código, o id tem que ser passado para apagar o usuário CERTO!
  return contato;
};


module.exports = Contato;