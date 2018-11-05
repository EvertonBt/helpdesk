import { ActivatedRoute } from '@angular/router';
import { Ticket } from './../../model/ticket';
import { SharedService } from './../../services/shared.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { ResponseApi } from 'src/app/model/response.api';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  @ViewChild("form")
  form: NgForm;

  ticket = new Ticket('',0,'', '','','','',null,null,'',null);
  shared : SharedService;
  message : any = {};
  classCss : {};

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute) {
      this.shared = SharedService.getInstance();
  }

  // Na lista de tickets ao clicar no botão detail ele invoca a página de ticket-detail e logo no carregamento
  // ele pega o id passado para buscar no banco e já carregar a página preenchida com os dados do ticket selecionado
  ngOnInit() {
    let id:string = this.route.snapshot.params['id'];
    if(id != undefined){
      this.findById(id);
    }
  }

  // função que busca o ticket no banco
  findById(id:string){
    console.log('id --> ',id);
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      console.log('responseApi -->  ',responseApi);
      this.ticket = responseApi.data;
      this.ticket.date = new Date(this.ticket.date).toISOString();
  } , err => {
    this.showMessage({
      type: 'error',
      text: err['error']['errors'][0]
    });
  });
  }

  // grava alterações no ticket
  register(){
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi:ResponseApi) => {
        this.ticket = new Ticket('',0,'', '','','','',null,null,'',null);
        let ticket : Ticket = responseApi.data;
        this.form.resetForm();
        this.showMessage({
          type: 'success',
          text: `Registered ${ticket.title} successfully`
        });
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // classes responsáveis por adicionar efeitos css
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
      }, 3000);
  }

  private buildClasses(type: string): void {
     this.classCss = {
       'alert': true
     }
     this.classCss['alert-'+type] =  true;
  }
// para envio da imagem, verifica o tamanho e converte em bytes antes de enviar para o banco
  onFileChange(event): void{
    if(event.target.files[0].size > 2000000){
      this.showMessage({
        type: 'error',
        text: 'Maximum image size is 2 MB'
      });
    } else {
      this.ticket.image = '';
      var reader = new FileReader();
      reader.onloadend = (e: Event) => {
          this.ticket.image = <string> reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
// função responsável pela troca de status do ticket
  changeStatus(status:string): void{
    this.ticketService.changeStatus(status,this.ticket).subscribe((responseApi:ResponseApi) => {
        this.ticket = responseApi.data;
        this.ticket.date = new Date(this.ticket.date).toISOString();
        this.showMessage({
          type: 'success',
          text: 'Successfully changed status'
        });
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }
}

