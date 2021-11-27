import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-sign-contract',
  templateUrl: './info-sign-contract.component.html',
  styleUrls: ['./info-sign-contract.component.scss']
})
export class InfoSignContractComponent implements OnInit, AfterViewInit {
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
