import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preview-sign-contract-template',
  templateUrl: './preview-sign-contract-template.component.html',
  styleUrls: ['./preview-sign-contract-template.component.scss']
})
export class PreviewSignContractTemplateComponent implements OnInit {

  @Input() datas: any;
  @Input() sign: any;
  signTemplate: boolean = true;
  @Output() onChangeValueText = new EventEmitter<any>();

  isContent: any;
  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    
  }

  getText(sign: any) {
    if (sign.sign_unit == 'text') {
      if(sign.text_attribute_name) {
        return sign.text_attribute_name
      } else
        return 'Text';
    } else  {
       return (this.translate.instant('contract.number'));
    }
  }

  getStyleText(sign: any) {
    return {
      'font-size': sign.font_size+'px',
      'font':sign.font,
      'width': sign.width+ 'px',
      'display': 'inline-block',
      'word-break': 'break-all'
    };
  }

  getSpecifiedHandle() {
    if ((!this.sign.is_have_text && this.sign.recipient_id) || (this.sign.value !== null && this.sign.value === undefined))
      // sign.sign_unit == 'so_tai_lieu' && !sign.recipient_id
      return true;
    else return false;
  }

  doTheSearch($event: Event): void {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    this.isContent = stringEmitted;
    this.onChangeValueText.emit(stringEmitted);
  }

  getNotSpecifiedYetHandle() {
    if (this.sign.sign_unit == 'so_tai_lieu' && !this.sign.recipient_id && this.sign.value !== undefined)
      return true;
    else return false;
  }

  focusOutFunction() {
    if (!this.sign.value) {
      this.onChangeValueText.emit('');
    }
  }

}
