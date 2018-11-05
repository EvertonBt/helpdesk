
import { ActivatedRoute } from '@angular/router';
import { SharedService } from './../../services/shared.service';
import { User } from './../../model/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ResponseApi } from 'src/app/model/response.api';

@Component ({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

  @ViewChild('form')
  form: NgForm;

  user = new User('', '', '', '');
  shared: SharedService;
  message: any= {};
  classCss: {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute) {
      this.shared = SharedService.getInstance();
  }

  // Logo ao carregar a tela ele analisa o parametro da rota, isso serve para fazer a pesquisa pelo id ao clicar em um item da lista
  // se o id estiver vazio ele vai exibir a tela com os campos vazios pronto para fazer uma nova inserção
  // caso haja um id na rota ele vai carregar a tela com os campos preenchidos para fazer uma edição
  ngOnInit() {
    let id: string = this.route.snapshot.params['id'];
    if (id !== undefined) {
      this.findById(id);
    }
  }

  // função acionada ao clicar num item da lista ou ao carregar a página na primeira vez (nesse caso ele vai fazer uma busca que não vai retornar nada)
  findById(id: string) {
    this.userService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.user = responseApi.data;
      this.user.password = '';
  } , err => {
    this.showMessage({
      type: 'error',
      text: err['error']['errors'][0]
    });
  });
  }

  // função para salvar um novo usuário
  register() {
    this.message = {};
    this.userService.createOrUpdate(this.user).subscribe((responseApi:ResponseApi) => {
        this.user = new User(null,  '', ' ', '');
        let userRet: User = responseApi.data;
        this.form.resetForm();
        this.showMessage({
          type: 'success',
          text: `Registered ${userRet.email} successfully`
        });
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // essas funções servem para exibir mensagens de erro personalizadas com css
  getFormGroupClass(isInvalid: boolean, isDirty:boolean): {} {
    return {
      'form-group': true,
      'has-error' : isInvalid  && isDirty,
      'has-success' : !isInvalid  && isDirty
    };
  }

  private showMessage(message: {type: string, text: string}): void {
      this.message = message;
      this.buildClasses(message.type);
      setTimeout(() => {
        this.message = undefined;
      }, 3000); // a mensagem dura somente por três segundos
  }

  private buildClasses(type: string): void {
     this.classCss = {
       'alert': true
     }
     this.classCss['alert-'+type] =  true;
  }

}
