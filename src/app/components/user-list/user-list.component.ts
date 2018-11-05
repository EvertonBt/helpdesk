import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ResponseApi } from 'src/app/model/response.api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page:number=0;
  count:number=5;
  pages:Array<number>;
  shared : SharedService;
  message : any = {};
  classCss : {};
  listUser=[];

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router) {
      this.shared = SharedService.getInstance();
  }

  // carrega lista logo na inicializaçao do componente
  ngOnInit() {
    this.findAll(this.page,this.count);
  }

  // método que busca a lista de usuários
  findAll(page:number,count:number){
    this.userService.findAll(page,count).subscribe((responseApi: ResponseApi) => {
        this.listUser = responseApi['data']['content'];
        this.pages = new Array(responseApi['data']['totalPages']);
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });

  }

  // método acionaodo ao clicar no botão de editar, ele chama a página de gravação/edição de usuário passando um id
  edit(id:string){
    this.router.navigate(['/user-new',id]);
  }

  // método que deleta um usuário da lista ao clicar no botão de exclusão, ele também inovca o dialog service para emitir uma mensagem de confirmação
  delete(id:string){
    this.dialogService.confirm('Do you want to delete the email ?')
      .then((candelete:boolean) => {
          if(candelete){
            this.message = {};
            this.userService.delete(id).subscribe((responseApi:ResponseApi) => {
                this.showMessage({
                  type: 'success',
                  text: `Record deleted`
                });
                this.findAll(this.page,this.count);
            } , err => {
              this.showMessage({
                type: 'error',
                text: err['error']['errors'][0]
              });
            });
          }
      });
  }

  // usado na paginação referente ao botão de proxima página
  setNextPage(event:any){
    event.preventDefault();
    if(this.page+1 < this.pages.length){
      this.page =  this.page +1;
      this.findAll(this.page,this.count);
    }
  }

  // usado na paginação, página anterior
  setPreviousPage(event:any){
    event.preventDefault();
    if(this.page > 0){
      this.page =  this.page - 1;
      this.findAll(this.page,this.count);
    }
  }

  // referente a página atual ao ser clicada
  setPage(i,event:any){
    event.preventDefault();
    this.page = i;
    this.findAll(this.page,this.count);
  }

  // referente às mensagens de erro e/ou sucesso e aplicação dos efeitos css
  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type: string): void {
    this.classCss = {
      'alert': true
    }
    this.classCss['alert-'+type] =  true;
  }

}
