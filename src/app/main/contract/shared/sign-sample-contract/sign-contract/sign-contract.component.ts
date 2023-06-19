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

  ngOnInit(): void {
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
          } else return 'Text';
    } else {
      if (this.datas.contract_no) {
        return this.datas.contract_no
      } else if (sign.value) {
        return sign.value;
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

  changeInput(e: any){
    e.target.value = this.convertCurrency(e.target.value);
  }

  reverseInput(e: any){
    e.target.value = this.removePeriodsFromCurrencyValue(e.target.value);
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

  removePeriodsFromCurrencyValue(value: string): string {
    const regex = /(\d[\d.]*(?:\.\d+)?)\b/g;
    let result = '';
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(value)) !== null) {
      const numericPart = match[1].replace(/\./g, '');
      const prefix = value.slice(lastIndex, match.index);
      result += prefix + numericPart;
      lastIndex = match.index + match[0].length;
    }
  
    const suffix = value.slice(lastIndex);
    result += suffix;
  
    return result;
  }

  convertCurrency(value: any) {
    const regex = /(\d[\d.]*(?:\.\d+)?)\b(?=\.{0,2}\d*$)/g;
    const text = value.toString();
    let formattedText = '';
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const numericPart = match[1].replace(/\./g, '');
      const formattedNumericPart = parseFloat(numericPart).toLocaleString('vi-VN');
      const prefix = text.slice(lastIndex, match.index);
      formattedText += prefix + formattedNumericPart;
      lastIndex = match.index + match[0].length;
      if (text.charAt(lastIndex) === '.') {
        formattedText += '.';
        lastIndex++;
      }
    }
    const suffix = text.slice(lastIndex);
    formattedText += suffix;
    value = formattedText;
    return value;
  }
}
