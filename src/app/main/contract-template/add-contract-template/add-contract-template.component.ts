import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmInforContractComponent} from "../shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {ContractHeaderComponent} from "../shared/model/contract-header/contract-header.component";
import {DetermineSignerComponent} from "../shared/model/determine-signer/determine-signer.component";
import {InforContractComponent} from "../shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "../shared/model/sample-contract/sample-contract.component";
import {variable} from "../../../config/variable";
import {AppService} from 'src/app/service/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";
import {ContractService} from "../../../service/contract.service";
import {UploadService} from "../../../service/upload.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../service/toast.service";
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
// import * as from moment;

@Component({
  selector: 'app-add-contract-template',
  templateUrl: './add-contract-template.component.html',
  styleUrls: ['./add-contract-template.component.scss', '../../main.component.scss']
})  
export class AddContractTemplateComponent implements OnInit {
  @ViewChild('contractHeader') ContractHeaderComponent: ContractHeaderComponent | unknown;
  @ViewChild('determineSigner') DetermineSignerComponent: DetermineSignerComponent | unknown;
  @ViewChild('sampleContract') SampleContractComponent: SampleContractComponent | unknown;
  @ViewChild('infoContract') InforContractComponent: InforContractComponent | unknown;
  @ViewChild('confirmInforContract') ConfirmInforContractComponent: ConfirmInforContractComponent | unknown;

  action: string;
  id: string;
  private sub: any;
  datas: any = {
    stepLast: variable.stepSampleContract.step1,
    save_draft: {
      'infor_contract': false,
      'determine_signer': false,
      'sample_contract': false,
      'confirm_infor_contract': false
    }
  }
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  confirmDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  education_step = false;
  confirm_step = false;
  // step = 1;
  step: any;
  message: any;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private appService: AppService,
              private route: ActivatedRoute,
              private contractService: ContractService,
              private router: Router,
              private uploadService: UploadService,
              private spinner: NgxSpinnerService,
              private toastService : ToastService,
              private userService: UserService,
              private roleService: RoleService,
  ) {
  }

  isQLHD_01:boolean=true;
  isQLHD_02:boolean=true;
  isQLHD_08:boolean=true;
  isQLHD_11:boolean=true;

  ngOnInit() {
    //title
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //lay id user
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data.role_id).subscribe(
          data => {
            console.log(data);
            let listRole: any[];
            listRole = data.permissions;
            this.isQLHD_01 = listRole.some(element => element.code == 'QLHD_01');
            // this.isQLHD_02 = listRole.some(element => element.code == 'QLHD_02');
            // this.isQLHD_08 = listRole.some(element => element.code == 'QLHD_08');
            this.isQLHD_11 = listRole.some(element => element.code == 'QLHD_11');
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
          }
        );

      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
      })

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('contract.add');
      } else if (this.action == 'add-contract-connect') {
        this.appService.setTitle('contract.add');
        const array_empty: any [] = [];
        array_empty.push({ref_id: Number(params['id'])});
        this.datas.contractConnect = array_empty;
        console.log(this.datas.contractConnect);
      } else if (this.action == 'edit') {
        this.id = params['id'];
        this.appService.setTitle('contract.edit');
      } else if (this.action == 'copy') {
        this.id = params['id'];
        this.appService.setTitle('contract.copy');
      }

      if (this.action == 'copy' || this.action == 'edit') {
        this.spinner.show();
        this.contractService.getDetailContract(this.id).subscribe((rs: any) => {
          let data_api = {
            is_data_contract: rs[0],
            i_data_file_contract: rs[1],
            is_data_object_signature: rs[2]
          }
          // this.contractService.changeMessage(data_api);
          this.getDataContractCreated(data_api);
        }, () => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
        }, () => {
          this.spinner.hide();
        })
      } else this.step = variable.stepSampleContract.step1;
    });
  }

  getDataContractCreated(data: any) {
    // this.subscription = this.contractService.currentMessage.subscribe(message => this.message = message);
    if (data) {
      let fileName = data.i_data_file_contract.filter((p: any) => p.type == 1)[0];
      let fileNameAttach = data.i_data_file_contract.filter((p: any) => p.type == 3)[0];
      if (fileName) {
        data.is_data_contract['file_name'] = fileName.filename;
        data.is_data_contract['contractFile'] = fileName.path;
      }
      if (fileNameAttach) {
        data.is_data_contract['file_name_attach'] = fileNameAttach.filename;
        data.is_data_contract['attachFile'] = fileNameAttach.path;
      }
      this.datas.contractConnect = data.is_data_contract.refs;
      data.is_data_contract['is_action_contract_created'] = true;
      // this.datas.determine_contract = data.is_data_contract.participants;
      this.datas.is_determine_clone = data.is_data_contract.participants;
      this.datas.contract_id_action = data.is_data_contract.id;
      this.datas.i_data_file_contract = data.i_data_file_contract;
      this.datas['is_data_object_signature'] = data.is_data_object_signature;
      // this.datas.determine_contract.forEach((res: any) => {
      //   delete res.id;
      //   res.recipients.forEach((element: any) => {
      //     delete element.id;
      //   })
      // })
      this.datas = Object.assign(this.datas, data.is_data_contract);
      this.step = variable.stepSampleContract.step1;
      // console.log(this.datas);
    }
  }

  // ngOnDestroy() {
  //   if (this.action == 'copy' || this.action == 'edit') {
  //     this.subscription.unsubscribe();
  //   }
  // }

  next() {
    if (this.step == 'infor-contract') {
      this.personal_step = true;
      if (this.personalDetails.invalid) {
        return
      }
      this.step = 'determine-contract';
    } else if (this.step == 'determine-contract') {
      this.address_step = true;
      if (this.addressDetails.invalid) {
        return
      }
      this.step = 'sample-contract';
    } else if (this.step == 'sample-contract') {
      this.education_step = true;
      if (this.educationalDetails.invalid) {
        return
      }
      this.step = 'confirm-contract';
    }
  }

  previous() {
    // this.step--
    if (this.step == 'infor-contract') {
      this.personal_step = false;
    } else if (this.step == 'determine-contract') {
      this.address_step = false;
      this.education_step = false;
    } else if (this.step == 'sample-contract') {
      this.education_step = false;
      this.confirm_step = false;
    }
  }

  submit() {
    if (this.step == 'confirm-contract') {
      this.confirm_step = true;
      if (this.confirmDetails.invalid) {
        return
      }
    }
  }

  getStep(e: any) {
    // this.step = this.datas.stepLast;
    this.step = e;
  }


  getDataStepContract(e: any) {

  }

  t() {
    console.log(this);
  }
}
