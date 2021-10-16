import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss']
})
export class ConfirmInforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  constructor() {
    this.step = 'confirm-contract'
  }

  ngOnInit(): void {
  }

}
