import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgxInputSearchModule } from "ngx-input-search";
import {TranslateService} from '@ngx-translate/core';
import { ContractService } from 'src/app/service/contract.service';
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
    public contractService: ContractService
  ) {

  }
// non template
  ngOnInit(): void {
    if (this.sign.sign_unit == 'text') {
      if(this.sign.value) {
        if(this.sign.text_type == 'currency') {
          this.sign.value = this.contractService.convertCurrency(this.sign.value);
        }
      }
    }
  }

  getText(sign: any) {
    if (sign.sign_unit == 'text') {
      if(sign.value) {
        if(sign.text_type == 'currency') {
          return this.contractService.convertCurrency(sign.value);
        } else
        return sign.value
      } else if (sign.text_type!= undefined && sign.text_type == "currency"){
          return 'Số tiền'
      } else {
        return 'Text';
      }
    } else {
      if (this.datas.contract_no) {
        this.contractNo = this.datas.contract_no;
        return this.contractNo
      } else if (sign.value) {

        this.contractNo = sign.value;
        return this.contractNo;
      } else return (this.translate.instant('contract.number'));
    }
  }

  getStyleText(sign: any) {
    return {
      'font-size': sign.font_size+'px',
      'font':sign.font ? sign.font: 'Times New Roman',
    };
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

  changeInput(e: any,sign: any){
    if(sign.text_type == 'currency')
      e.target.value = this.contractService.convertCurrency(e.target.value);
  }

  reverseInput(e: any,sign: any){
    if(sign.text_type == 'currency')
      e.target.value = this.contractService.removePeriodsFromCurrencyValue(e.target.value);
  }

  getSpecifiedHandle() {
    if(this.contractNo) return false;

    if (((!this.sign.is_have_text && this.sign.recipient_id) || (this.sign.value !== null && this.sign.value === undefined) || this.datas.contract_no ||
    (this.sign.sign_unit == 'so_tai_lieu' && this.sign.value)) || (this.sign.sign_unit == 'text' && this.sign.recipient_id)) {
      return true;
    } else {
      return false;
    }
  }

  getNotSpecifiedYetHandle() {
    if (this.sign.sign_unit == 'so_tai_lieu' && !this.sign.recipient_id && this.sign.value !== undefined)
      return true;
    else return false;
  }


}
