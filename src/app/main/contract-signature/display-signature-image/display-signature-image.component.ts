import { Component, Input, OnInit } from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-display-signature-image',
  templateUrl: './display-signature-image.component.html',
  styleUrls: ['./display-signature-image.component.scss']
})
export class DisplaySignatureImageComponent implements OnInit {

  @Input() isDateTime: string | undefined | null;
  @Input() phoneOtp: string | undefined | null;
  @Input() userOtp: string | undefined | null;

  constructor() { }

  async ngOnInit(): Promise<void> {
    let http = null;

    if(environment.apiUrl == 'http://14.160.91.174:1387') {
      http = "http";
    } else {
      http = "https";
    }

    const date = await fetch(http+"://worldtimeapi.org/api/ip").then(response => response.json());

    this.isDateTime = date.datetime;
  }


  convertImage() {
    const imageRender = <HTMLElement>document.getElementById('export-signature-image-html');
    
    if (imageRender) {
      domtoimage.toPng(imageRender).then((res: any) => {
        
      })
    }
  }

}
