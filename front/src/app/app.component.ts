import { ObservabilityService } from './services/observability.service';
import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private observability: ObservabilityService) {
      this.observability.start(environment.observabilityUrl)
  }

  title = 'front';
}
