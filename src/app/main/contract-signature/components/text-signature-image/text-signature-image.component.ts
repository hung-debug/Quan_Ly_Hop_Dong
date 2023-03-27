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
      'font': this.datas.is_data_object_signature[0].font,
      'font-size':this.datas.is_data_object_signature[0].font_size+'px',
      // 'width':this.width + 'px',
      // 'height': this.height + 'px',
    };
  }

}
