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

  // isNameSignature: string = 'Công ty cổ phần phần mềm công nghệ cao Việt Nam';
  @Input() nameCompany: any | undefined | null;
  @Input() cardId: any | undefined | null;
  @Input() phonePKI: any | undefined | null;
  @Input() srcMark: any | undefined | null;
  @Input() isDateTime: any | undefined | null;

  constructor() {
    
   }

  async ngOnInit(): Promise<void> {
  }


  convertImage() {
    const imageRender = <HTMLElement>document.getElementById('export-html');
    
    if (imageRender) {
      domtoimage.toPng(imageRender).then((res: any) => {
      })
    }
  }

}
