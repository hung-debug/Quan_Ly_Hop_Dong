import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";
import {environment} from "../../../../../environments/environment";
import * as contractModel from '../../model/contract-model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  @ViewChild('AddContract') AddContractComponent: AddContractComponent;
  @Input() datas: any;

  // @Input() datas: any = {
  //   step: variable.stepSampleContract.step_coordination,
  //   contract: {},
  //   action_title: 'Điều phối'
  // }

  data_contract: any = {};

  constructor() {
    this.data_contract = contractModel.data_signature_contract;
  }

  ngOnInit(): void {
    let data_coordination = localStorage.getItem('data_coordinates_contract');
    if (data_coordination) {
      this.datas = JSON.parse(data_coordination).data_coordinates;
    }
    // this.datas = this.datas.concat(this.data_contract.contract_information);

    this.datas = Object.assign(this.datas, this.data_contract);
  }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

}
