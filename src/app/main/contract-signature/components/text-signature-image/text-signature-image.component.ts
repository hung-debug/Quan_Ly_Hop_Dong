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

  constructor() { }

  ngOnInit(): void {
    console.log("datas font ", this.datas.is_data_object_signature[0].font);
  }

  getStyleText() {
    return null;
  }

}
