import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmInforContractComponent} from "../shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {ContractHeaderComponent} from "../shared/model/contract-header/contract-header.component";
import {DetermineSignerComponent} from "../shared/model/determine-signer/determine-signer.component";
import {InforContractComponent} from "../shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "../shared/model/sample-contract/sample-contract.component";
import {variable} from "../../../config/variable";
import {AppService} from 'src/app/service/app.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {ContractService} from "../../../service/contract.service";
// import * as from moment;

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss', '../../main.component.scss']
})
export class AddContractComponent implements OnInit, OnDestroy, AfterViewInit {
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
  step = variable.stepSampleContract.step1;
  message: any;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private appService: AppService,
              private route: ActivatedRoute,
              private contractService: ContractService
  ) {
  }

  ngOnInit() {
    //title
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('contract.add');
      } else if (this.action == 'edit') {
        this.id = params['id'];
        this.appService.setTitle('contract.edit');
      } else if (this.action == 'copy') {
        this.id = params['id'];
        this.appService.setTitle('contract.copy');
      }
    });
    //@ts-ignore
    if (JSON.parse(localStorage.getItem('is_copy'))) {
      this.subscription = this.contractService.currentMessage.subscribe(message => this.message = message);
      if (this.message) {
        let fileName = this.message.i_data_file_contract.filter((p: any) => p.type == 1)[0];
        if (fileName) {
          this.message.is_data_contract['file_name'] = fileName.filename;
          this.message.is_data_contract['contractFile'] = fileName.path;
          this.message.is_data_contract['is_copy'] = true;
        }
        this.datas.determine_contract = this.message.is_data_contract.participants;
        this.datas['is_data_object_signature'] = this.message.is_data_object_signature;
        this.datas = Object.assign(this.datas, this.message.is_data_contract);
        console.log(this.datas, this.message);
      }
    }

  }

  ngOnDestroy() {
    //@ts-ignore
    if (JSON.parse(localStorage.getItem('is_copy'))) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    console.log(this.message);
  }


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
