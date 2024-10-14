import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ngOnInit() {
    (window as any).environmentFlag = environment.flag;
  }
}
