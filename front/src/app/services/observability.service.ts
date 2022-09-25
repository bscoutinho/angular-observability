import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ObservabilityService {

  correlationId : string = '';
  usecaseId : string = '';
  body : {} = {};
  timeScreenStart: number = 0;
  url: string = '';

  constructor(
    private router: Router, 
    private http: HttpClient,
    ) {
      console.log('OBSVTES13')
      this.getCorrelationId();
    }
  
  // Start observability - change screen event
  start(endpoint: string) {
    this.url = endpoint

    this.router.events.subscribe((event) => {

      // Track time that page start to render
      if (event instanceof NavigationStart) {
        this.timeScreenStart = performance.now();
      }

      if(event instanceof NavigationEnd) {

        //Set screen as usecaseID
        this.getUsecaseId()

        // Get page transition time
        const responseTime = (performance.now() - this.timeScreenStart).toFixed(0)

        // Compose body to HTTP request
        this.body = this.bodyBuilder(this.correlationId, this.usecaseId, event.url, 'change_screen', responseTime, "success")

        // Send data to server
        this.postData(this.body)
      }

      //Send data in navigation error
      if (event instanceof NavigationError) {
        const responseTime = (performance.now() - this.timeScreenStart).toFixed(0)
        this.body = this.bodyBuilder(this.correlationId, this.usecaseId, event.url, 'change_screen', responseTime, "error")
        this.postData(this.body)
      }

    });
  }

  postData(body: {}) : void {
    this.http.post<any>(this.url, body).subscribe({
        next: data => {
            console.log('Observability data: ', data)
        },
        error: error => {
            console.log('Observability error: ', error)
        }
    })
  }

  manageApiCall(req, res) {

    const correlationId = sessionStorage.getItem('x-usersession-id') || '{}';
    const usecaseId = localStorage.getItem('x-usecase-id') || '{}';
    const start = performance.now();
    let posted = false;

    if(req.method === 'POST' && !posted) {
      const responseTime = (performance.now() - start).toFixed(0)
      this.body = this.bodyBuilder(correlationId, usecaseId, window.location.pathname, 'api_call', responseTime, "success")
      this.postData(this.body)
      posted = true;
    }

    if (req.method === 'GET' && res.status === 200) {
      const responseTime = (performance.now() - start).toFixed(0)
      this.body = this.bodyBuilder(correlationId, usecaseId, window.location.pathname, 'api_call', responseTime, "success")
      this.postData(this.body)
    }

    return
  }

  bodyBuilder(correlation: string, usecase: string, screen: string, type: string, duration: string, status: string) : Object {

    const baseBody = {
      "x-usersession-id": correlation,
      "x-usecase-id": usecase, 
      "screen": screen,
      "type": type,
      "duration": duration,
      "timestamp": new Date(),
      "status": status
    }

    return baseBody
  }

  postFromComponent() {
    let usecase = localStorage.getItem("x-usecase-id")
    const bodyfromComponent = this.bodyBuilder(this.correlationId, usecase, usecase, 'change_screen', '12', "success");
    this.postData(bodyfromComponent)
  }

  generateCorrelationId() {
    if (sessionStorage.getItem("x-usersession-id") === null || sessionStorage.getItem("x-usersession-id") === '') {
      let array = new Uint32Array(3);
      window.crypto.getRandomValues(array);
    
      let result = ''
      for (let i = 0; i < array.length; i++) {
        result += array[i];
      }

      sessionStorage.setItem('x-usersession-id', result)
    }
  }

  /* generateUsecaseId(screen: any) {
    localStorage.setItem('x-usecase-id', screen)
  } */

  getUsecaseId() {
    /* this.generateUsecaseId(screen); */
    this.usecaseId = localStorage.getItem('x-usecase-id') || '{}';
  }

  getCorrelationId() {
    this.generateCorrelationId();
    this.correlationId = sessionStorage.getItem('x-usersession-id') || '{}';
  }
}
