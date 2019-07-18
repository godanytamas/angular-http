import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const methods = ['POST', 'PUT', 'DELETE'];
    // Check modifier methods
    if (methods.indexOf(req.method) >= 0) {
      console.log('The method is ' + req.method);
    }
    // Add default headers to all request
    const reqestWithHeaders = req.clone({
      headers: req.headers
        .append('x-application-id', 'xyz123')
        .append('x-platform-name', 'web')
        .append('x-application-version', '1.0.0')
    });
    return next.handle(reqestWithHeaders);
  }
}
