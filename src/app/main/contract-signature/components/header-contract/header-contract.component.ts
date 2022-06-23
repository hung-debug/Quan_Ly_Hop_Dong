import {Component, OnInit, Input} from '@angular/core';
import {variable} from "../../../../config/variable";

@Component({
  selector: 'app-header-contract',
  templateUrl: './header-contract.component.html',
  styleUrls: ['./header-contract.component.scss']
})
export class HeaderContractComponent implements OnInit {
  @Input() datas: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  comeBack() {
    this.datas.step = variable.stepSampleContract.step_coordination;
  }

}
