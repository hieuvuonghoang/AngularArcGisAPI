import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwtToken = environment.jwtToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (jwtToken && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` },
      });
    }
    return next.handle(request);
  }
}
