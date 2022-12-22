import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';

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

  constructor() {
   }

   async ngOnInit(): Promise<void> {
    const date = await fetch("https://worldtimeapi.org/api/ip").then(response => response.json());

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
