import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  // variável estática
  public static instance: SharedService = null;
  user: User;
  token: string;
  showTemplate = new EventEmitter<boolean>();

  constructor() {
    return SharedService.instance = SharedService.instance || this;
  }

  // retorna uma instancia de Shared Service que vai ser compatilhada por toda a aplicação para saber se a pessoa está ou não logada
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SharedService();
    }
    return this.instance;
  }

  // verifica se o indivíduo está logado
  isLoggedIn(): boolean {
    if (this.user == null) {
      return false;
    }
    return this.user.email !== '';
  }

}
