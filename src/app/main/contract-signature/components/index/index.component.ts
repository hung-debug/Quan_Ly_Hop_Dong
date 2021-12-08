import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";
import {environment} from "../../../../../environments/environment";
import {UserService} from "../../../../service/user.service";
import {ContractSignatureService} from "../../../../service/contract-signature.service";
import * as contractModel from '../../model/contract-model';
import {data_signature_contract, data_signature_contract_2} from "../../model/contract-model";
import {ContractService} from "../../../../service/contract.service";
import {ToastService} from "../../../../service/toast.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  @ViewChild('AddContract') AddContractComponent: AddContractComponent;
  @Input() datas: any;
 data_contract: any;
  // @Input() datas: any = {
  //   step: variable.stepSampleContract.step_coordination,
  //   contract: {},
  //   action_title: 'Điều phối'
  // }


  constructor(
    private contractSignatureService: ContractSignatureService,
    private contractService: ContractService,
    private toastService : ToastService,
  ) {
    // this.data_contract = contractModel.data_signature_contract;
    this.data_contract = contractModel.data_signature_contract_2;
  }

  ngOnInit(): void {
    this.datas = {
      "step": "infor-coordination",
      "contract": {},
      "action_title": "Điều phối",
      "recipientId_coordination": 869 // get tu param
    };
    // this.getDataApiDetermine();
    this.datas = Object.assign(this.datas, this.data_contract);
    console.log(this.datas);
  }

  // getDataApiDetermine() {
  //   this.contractService.getDetermineCoordination().subscribe((res: any) => {
  //
  //   }, () => {
  //     this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
  //   })
  // }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

}
