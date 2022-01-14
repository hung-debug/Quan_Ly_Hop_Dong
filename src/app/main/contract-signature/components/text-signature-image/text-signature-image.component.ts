import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
//@ts-ignore
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-text-signature-image',
  templateUrl: './text-signature-image.component.html'
})
export class TextSignatureImageComponent implements OnInit {
  @Input() textSign: string | undefined | null;

  constructor() { }

  ngOnInit(): void {
  }

}
