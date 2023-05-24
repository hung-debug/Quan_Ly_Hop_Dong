import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-text-signature-image',
  templateUrl: './text-signature-image.component.html'
})
export class TextSignatureImageComponent implements OnInit {
  @Input() textSign: string | undefined | null;
  @Input() width: any;
  @Input() height: any;
  @Input() datas: any;

  @Input() font: any;
  @Input() font_size: any;

  constructor() { }

  ngOnInit(): void {

  }

  getStyleText() {
    return {
      'font': this.font,
      'font-size':this.font_size+'px',
      'width':'fit-content',
      'height': this.height + 'px',
      'text-align':'left',
      'max-width':this.width + 'px',
      'margin': 0,
      'padding': 0,
    };
  }


}
