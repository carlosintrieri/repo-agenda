import validator from 'validator';

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events(); // evbento para capturar
  }

  events() {
    if(!this.form) return; // checa se o formulário existe
    this.form.addEventListener('submit', e => { // se existe, submit
      e.preventDefault(); 
      this.validate(e); // cria o método emabixo de validate
    });
  }

  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]'); // está pegando do ejs
    const passwordInput = el.querySelector('input[name="password"]'); // está pegando do ejs
    let error = false; // 

    if(!validator.isEmail(emailInput.value)) {
      alert('E-mail inválido');
      error = true; // o erro ocorreu, então é true
    }

    if(passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      alert('Senha precisa ter entre 3 e 50 caracteres');
      error = true;
    }

    if(!error) el.submit(); // se não houver erro, submit!
  }
}