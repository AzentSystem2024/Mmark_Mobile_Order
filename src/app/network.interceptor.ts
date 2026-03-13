import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NetworkService } from './network.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  constructor(private network: NetworkService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
  if (!this.network.isOnline()) {
    return throwError(() => new Error('NO_INTERNET'));
  }
  return next.handle(req);
}
}
