import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared.service';
import { Observable } from 'rxjs';

// classe responsável por interceptar todas as requisições HTTP client e adcionar no cabeçalho da requisição o token
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    shared: SharedService;
    constructor() {
          this.shared = SharedService.getInstance();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
        let authRequest: any;
        if (this.shared.isLoggedIn()) {
            authRequest = req.clone({
                setHeaders: {
                    'Authorization' : this.shared.token
                }
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        }
    }

}
