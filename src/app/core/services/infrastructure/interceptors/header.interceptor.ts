import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../iam/auth.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private readonly authConfigService = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;
    if (/*this.signalRService.getConnection()?.connectionId &&*/ !req.url.includes('authorization')) {
      authReq = req.clone({
        headers: this.setDefaultHeaders(req.method)
      });
    }
    return next.handle(authReq);
  }

  private setDefaultHeaders(method: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.authConfigService.getToken(),
      'Accept': 'application/json',
      /*'X-connectionId': this.signalRService.getConnection().connectionId,*/
      'Content-Type': method === 'PATCH' ? 'application/json-patch+json' : 'application/json'
    });
  }
}
