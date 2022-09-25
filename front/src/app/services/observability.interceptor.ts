import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ObservabilityService } from './observability.service';
import { Router } from '@angular/router';


let checked = false;
let posted = false;

@Injectable({
  providedIn: 'root',
})
export class ObservabilityInterceptor implements HttpInterceptor {
  body : {} = {};
  constructor(
    private observability: ObservabilityService,
    private router: Router
    ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const correlationId = sessionStorage.getItem('x-usersession-id') || '{}';
    const usecaseId = localStorage.getItem('x-usecase-id') || '{}';
    const apikey = localStorage.getItem('x-api-key') || '';
    const start = performance.now();


    //Add correlationID and usecaseID in each request to server
    const newReq = req.clone({
      setHeaders: { 
        'x-usersession-id': correlationId,
        'x-usecase-id': usecaseId,
        'x-api-key': apikey,
      } 
    });

    return next.handle(newReq).pipe(tap((res: any) => {
      if (res.url) {

        debugger
        this.observability.manageApiCall(req, res)
        // send a POST request to server every time that API is called by a POST
        /* if(req.method === 'POST' && !posted) {
          const responseTime = (performance.now() - start).toFixed(0)
          this.body = this.observability.bodyBuilder(correlationId, usecaseId, this.router.routerState.snapshot.url, 'api_call', responseTime, "success")
          this.observability.postData(this.body)
          posted = true;
        } */
        // send a POST request to server every time that API is called by a GET
        /* if (req.method === 'GET' && res.status === 200) {
          const responseTime = (performance.now() - start).toFixed(0)
          this.body = this.observability.bodyBuilder(correlationId, usecaseId, this.router.routerState.snapshot.url, 'api_call', responseTime, "success")
          this.observability.postData(this.body)
        } */
      }
      return res
    }))
    .pipe(catchError( (error: HttpErrorResponse) => {
      // send a POST request to server every time that API return error
      if(!checked) {
        const responseTime = (performance.now() - start).toFixed(0)
        this.body = this.observability.bodyBuilder(correlationId, usecaseId, this.router.routerState.snapshot.url, 'api_call', responseTime, "error")
        this.observability.postData(this.body)
        checked = true
      }
      return throwError(error);
    }))
  }
}
