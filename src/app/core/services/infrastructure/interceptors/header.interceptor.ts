import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../iam/auth.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private readonly authConfigService = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;

    if (!req.url.includes('authorization')) {
      const headers = this.setDefaultHeaders(req.method, req.body instanceof FormData);
      authReq = req.clone({ headers });
    }

    return next.handle(authReq);
  }

  private setDefaultHeaders(method: string, isFormData: boolean): HttpHeaders {
    const headers: { [name: string]: string } = {
      'Authorization': 'Bearer ' + this.authConfigService.getToken(),
      'Accept': 'application/json'
    };

    // Only set Content-Type if the body is not FormData
    // When the FormData object is passed as the body of the request,
    // Angular automatically sets the Content-Type to multipart/form-data (avatar upload)
    if (!isFormData) {
      headers['Content-Type'] = method === 'PATCH' ? 'application/json-patch+json' : 'application/json';
    }

    return new HttpHeaders(headers);
  }
}
