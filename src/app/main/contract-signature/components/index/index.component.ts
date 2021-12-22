import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";
import {environment} from "../../../../../environments/environment";
import {UserService} from "../../../../service/user.service";
import {ContractSignatureService} from "../../../../service/contract-signature.service";
import * as contractModel from '../../model/contract-model';
import {data_signature_contract} from "../../model/contract-model";
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
  datas: any = {};
 data_contract: any;

  constructor(
    private contractSignatureService: ContractSignatureService,
    private contractService: ContractService,
    private toastService : ToastService,
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    let dataLocal = JSON.parse(localStorage.getItem('data_coordinates_contract_id'));
    this.contractService.getDetailContract(dataLocal.data_coordinates_id).subscribe(rs => {
      let data_api = {
        is_data_contract: rs[0],
        i_data_file_contract: rs[1],
        is_data_object_signature: rs[2]
      }
      this.datas = {
        "step": "infor-coordination",
        "contract": {},
        "action_title": "dieu_phoi",
        "data_contract_document_id": {
          contract_id: data_api.is_data_object_signature[0].contract_id,
          document_id: data_api.is_data_object_signature[0].document_id
        },
        view: false,
        coordination_complete: false
      };
      this.datas = Object.assign(this.datas, data_api)
    }, () => {

    })
    // this.datas = Object.assign(this.datas, this.data_contract);
    console.log(this.datas);
  }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

}
