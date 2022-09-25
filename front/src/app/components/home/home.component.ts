import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


  body = {
    "x-usersession-id": "1645281881744-f516166b",
    "x-usecase-id": "02f263f6-b8df-35f8-641c-568d431475c3",
    "screen": "/home",
    "type": "api_call",
    "duration": 556,
    "status": "success",
    "timestamp": "2022-02-21T09:58:41.312Z"
  }

  headersFirebase = new HttpHeaders()
  .set('Accept', 'application/json, text/plain, */*',)
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  bodyFirebase = {msisdn:'12345',topic: 'orangetopic', token: '1234567890'}

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    debugger
    localStorage.setItem('x-usecase-id', 'home');
  }

  

  callApi() {
    this.http.get<any>('https://6210a4dc4cd3049e17813289.mockapi.io/api/v1/observability').subscribe(data => {
        console.log('Calling Generic API - Data: ', data)
    })   

    /* https://obe-nonprod-dev.apigee.net/api/obe/firebase-notifier/subscribe */
  }

  callPostFirebaseApi() {
    this.http.post<any>('https://obe-nonprod-dev.apigee.net/api/obe/firebase-notifier/subscribe', this.bodyFirebase, { 'headers': this.headersFirebase }).subscribe(data => {
      console.log('Calling Firebase - Data: ', data)
    }) 
  }

  postTestApi() {
    this.http.post<any>('https://api-dev.dev.heytelecom.be/api/log-events/v1/log', this.body).subscribe(data => {
      console.log('Calling HeyTelecom API - Data: ', data)
    })   
  }

  callApiError() {
    this.http.get<any>('http://localhost:3000/observabilitys').subscribe(data => {
      console.log('Calling Error API - Data: ', data)
    })    
  }

}
