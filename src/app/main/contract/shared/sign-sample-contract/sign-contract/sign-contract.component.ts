import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgxInputSearchModule } from "ngx-input-search";
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-sign-contract',
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.scss']
})
export class SignContractComponent implements OnInit, AfterViewInit {
  @Input() datas: any;
  @Input() sign: any;
  @Input() signTemplate: boolean;
  @Output() onChangeValueText = new EventEmitter<any>();
  isContent: any;

  @Input() contractNo: any;

  constructor(
    public translate: TranslateService,
  ) {
    
  }

  ngOnInit(): void {
  }

  getText(sign: any) {
    if (sign.sign_unit == 'text') {
      if(sign.value) {
        return sign.value
      } else
        return 'Text';
    } else {
      if (this.datas.contract_no) {
        return this.datas.contract_no
      } else if (sign.value) {
        return sign.value;
      } else return (this.translate.instant('contract.number'));
    }

  }

  ngAfterViewInit() {
    if (this.sign.sign_unit == 'so_tai_lieu' || this.sign.sign_unit == 'text') {
      setTimeout(() => {
        if (document.getElementById("input-text")) {
          // @ts-ignore
          document.getElementById("input-text").focus();
        }
      }, 0)
    }
  }

  doTheSearch($event: Event, key: string): void {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    this.isContent = stringEmitted; 
    this.onChangeValueText.emit(stringEmitted);
  }

  focusOutFunction() {
    if (!this.sign.value) {
      this.onChangeValueText.emit('');
    }
  }

  getSpecifiedHandle() {
    if ((!this.sign.is_have_text && this.sign.recipient_id) || (this.sign.value !== null && this.sign.value === undefined))
      // sign.sign_unit == 'so_tai_lieu' && !sign.recipient_id
      return true;
    else return false;
  }

  getNotSpecifiedYetHandle() {
    if (this.sign.sign_unit == 'so_tai_lieu' && !this.sign.recipient_id && this.sign.value !== undefined)
      return true;
    else return false;
  }
}
