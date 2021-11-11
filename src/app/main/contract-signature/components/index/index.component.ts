import {Component, OnInit, ViewChild} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  @ViewChild('AddContract') AddContractComponent: AddContractComponent
  datas: any = {
    step: variable.stepSampleContract.step_coordination,
    contract: {},
    action_title: 'Điều phối'
  }
  constructor() { }

  ngOnInit(): void {
  }

  dieuPhoiHd() {
    this.datas.step = "confirm-coordination";
  }

}
