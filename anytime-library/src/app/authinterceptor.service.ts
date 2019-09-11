import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { UserAuthService } from './userauth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    const auth = this.injector.get(UserAuthService);
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'token ' + auth.token)
    });
    return next.handle(authRequest);
  }
}
