import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/model/current.user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User('', '', '', '');
  shared: SharedService;
  message: string;

  constructor(private userService: UserService,
              private router: Router) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
  }

  // Código principal responsável por fazer login
  login() {
    this.message = '';

    // o subcribe é um funcão de retorno, diz respeito ao que é executado após o servidor responder
    // (o parametro dentro da função subtring(userAuthentication) já vem populado com a resposta do servidor)
    this.userService.login(this.user).subscribe((userAuthentication: CurrentUser) => {
        this.shared.token = userAuthentication.token;
        this.shared.user = userAuthentication.user;
        this.shared.user.profile = this.shared.user.profile.substring(5);
        this.shared.showTemplate.emit(true);
        this.router.navigate(['/']);
    } , err => {
      this.shared.token = null;
      this.shared.user = null;
      this.shared.showTemplate.emit(false);
      this.message = 'Erro ';
    });
  }

  // Executado quando o usuário clica no botão de cancelar o login
  cancelLogin() {
    this.message = '';
    this.user = new User('', '', 'jjjj', '');
    window.location.href = '/login';
    window.location.reload();
  }

  // retorna classes css para exibir mensagens de erro ou sucesso à medida que o usuário vai digitando o texto nos inputs
  getFormGroupClass(isInvalid: boolean, isDirty: boolean): {} {
    return {
      'form-group': true,
      'has-error' : isInvalid  && isDirty,
      'has-success' : !isInvalid  && isDirty
    };
  }

}
