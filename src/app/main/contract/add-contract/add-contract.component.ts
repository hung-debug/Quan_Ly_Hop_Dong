import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ConfirmInforContractComponent} from "../shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {ContractHeaderComponent} from "../shared/model/contract-header/contract-header.component";
import {DetermineSignerComponent} from "../shared/model/determine-signer/determine-signer.component";
import {InforContractComponent} from "../shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "../shared/model/sample-contract/sample-contract.component";
import {variable} from "../../../config/variable";
import { AppService } from 'src/app/service/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss', '../../main.component.scss']
})
export class AddContractComponent implements OnInit {
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
  constructor(private formBuilder: FormBuilder,
              private appService: AppService,
              private route: ActivatedRoute,) { }
  ngOnInit() {
    //title
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if(this.action == 'add'){
        this.appService.setTitle('THÊM MỚI HỢP ĐỒNG');
      }else if(this.action == 'edit'){
        this.id = params['id'];
        this.appService.setTitle('SỬA HỢP ĐỒNG');
      }else if(this.action == 'copy'){
        this.id = params['id'];
        this.appService.setTitle('SAO CHÉP HỢP ĐỒNG');
      }
    });

  }

  next(){
    if(this.step=='infor-contract'){
      this.personal_step = true;
      if (this.personalDetails.invalid) { return  }
      this.step = 'determine-contract';
    }
    else if(this.step=='determine-contract'){
      this.address_step = true;
      if (this.addressDetails.invalid) { return }
      this.step = 'sample-contract';
    }
    else if(this.step=='sample-contract'){
      this.education_step = true;
      if (this.educationalDetails.invalid) { return }
      this.step = 'confirm-contract';
    }
  }

  previous(){
    // this.step--
    if(this.step=='infor-contract'){
      this.personal_step = false;
    }
    else if(this.step=='determine-contract'){
      this.address_step = false;
      this.education_step = false;
    }
    else if(this.step=='sample-contract'){
      this.education_step = false;
      this.confirm_step = false;
    }
  }

  submit(){
    if(this.step=='confirm-contract'){
      this.confirm_step = true;
      if (this.confirmDetails.invalid) { return }
    }
  }

  getStep(e: any) {
    // this.step = this.datas.stepLast;
    this.step = e;
  }
}
