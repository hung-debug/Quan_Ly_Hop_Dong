import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-contract-template',
  templateUrl: './sign-contract-template.component.html',
  styleUrls: ['./sign-contract-template.component.scss']
})
export class SignContractTemplateComponent implements OnInit {

  @Input() datas: any;
  @Input() sign: any;
  constructor() { }

  ngOnInit(): void {
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
