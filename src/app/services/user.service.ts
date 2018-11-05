
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from '../model/user';
import { HELP_DESK_API } from './helpdesk.api'; // constante criada no arquivo helpdesk.api para disponibilizar o link do servidor

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  // método usado para fazer login
  login(user: User) {
    return this.http.post(`${HELP_DESK_API}/api/auth`, user);
  }
 // método usado para atualizar um registro de usuário, caso ele não exista é criado automaticamente
  createOrUpdate(user: User) {
    if (user.id != null && user.id !== '') {
      return this.http.put(`${HELP_DESK_API}/api/user`, user);
    } else {
      user.id = null;
      return this.http.post(`${HELP_DESK_API}/api/user`, user);
    }
  }
  // lista todos os usuários do sistema passando para ele o número de registros e as páginas
  findAll(page: number, count: number) {
    return this.http.get(`${HELP_DESK_API}/api/user/${page}/${count}`);
  }

  // pesquisa usuário pelo id
  findById(id: string) {
    return this.http.get(`${HELP_DESK_API}/api/user/${id}`);
  }

  // deleta usuário pelo id
  delete(id: string) {
    return this.http.delete(`${HELP_DESK_API}/api/user/${id}`);
  }
}
