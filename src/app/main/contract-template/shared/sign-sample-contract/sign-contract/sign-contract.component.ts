import {Component, OnInit, Input, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-sign-contract-template',
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.scss']
})
export class SignContractComponent implements OnInit, AfterViewInit {
  @Input() datas: any;
  @Input() sign: any;

  constructor() {
  }

  ngOnInit(): void {
    
  }

  getText(sign: any) {
    // ? 'Text' : 'Số hợp đồng'
    if (sign.sign_unit == 'text') {
      if(sign.text_type == "currency")
        return 'Số tiền';
      // 
      return 'Text';
    } else {
      return 'Số hợp đồng';
    }
  }

  ngAfterViewInit() {
    if (this.sign.sign_unit == 'so_tai_lieu' || this.sign.sign_unit == 'text') {
      setTimeout(() => {
        // @ts-ignore
        document.getElementById("input-text").focus();
      }, 0)
    }
  }

}
