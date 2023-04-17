import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-digital-signature',
  templateUrl: './display-digital-signature.component.html',
  styleUrls: ['./display-digital-signature.component.scss']
})
export class DisplayDigitalSignatureComponent implements OnInit {

  isDateTime: any = new Date();
  // isNameSignature: string = 'Công ty cổ phần phần mềm công nghệ cao Việt Nam';
  @Input() nameCompany: any | undefined | null;
  @Input() cardId: any | undefined | null;
  @Input() phonePKI: any | undefined | null;
  @Input() srcMark: any | undefined | null;

  constructor() {
    console.log("s ", this.srcMark)
   }

  async ngOnInit(): Promise<void> {
    let http = "";
    if(environment.apiUrl == 'http://14.160.91.174:1387') {
      http = "http";
    } else {
      http = "https";
    }

    const date = await fetch(http+"://worldtimeapi.org/api/ip").then(response => response.json());

    this.isDateTime = date.datetime;
  }


  convertImage() {
    const imageRender = <HTMLElement>document.getElementById('export-html');
    console.log(imageRender);
    if (imageRender) {
      domtoimage.toPng(imageRender).then((res: any) => {
        console.log(res.split(",")[1]);
      })
    }
  }

}
