import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot,  CanActivate  } from '@angular/router';
import { Observable } from 'rxjs';

// classe responsável por proteger as páginas que exigem autenticação,
// caso o usuário não esteja logado ele é redirecionado para a página de login
@Injectable()
export class AuthGuard implements CanActivate {

  public shared: SharedService;
  constructor(private userService: UserService,
              private router: Router) {
                this.shared = SharedService.getInstance();
  }
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.shared.isLoggedIn()) {
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
