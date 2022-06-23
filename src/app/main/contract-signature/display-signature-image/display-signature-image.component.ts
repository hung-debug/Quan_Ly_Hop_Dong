import { Component, Input, OnInit } from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';
@Component({
  selector: 'app-display-signature-image',
  templateUrl: './display-signature-image.component.html',
  styleUrls: ['./display-signature-image.component.scss']
})
export class DisplaySignatureImageComponent implements OnInit {

  isDateTime: any = new Date();
  @Input() phoneOtp: string | undefined | null;

  constructor() { }

  ngOnInit(): void {
  }

  convertImage() {
    const imageRender = <HTMLElement>document.getElementById('export-signature-image-html');
    console.log(imageRender);
    if (imageRender) {
      domtoimage.toPng(imageRender).then((res: any) => {
        console.log(res.split(",")[1]);
      })
    }
  }

}
