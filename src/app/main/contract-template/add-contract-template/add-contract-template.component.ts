import { ContractTemplateHeaderComponent } from './../shared/model/contract-template-header/contract-template-header.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DetermineSignerTemplateComponent } from '../shared/model/determine-signer-template/determine-signer-template.component';
import { SampleContractTemplateComponent } from '../shared/model/sample-contract-template/sample-contract-template.component';
import { InforContractTemplateComponent } from '../shared/model/infor-contract-template/infor-contract-template.component';
import { ConfirmInforContractTemplateComponent } from '../shared/model/confirm-infor-contract-template/confirm-infor-contract-template.component';
import {variable} from "../../../config/variable";
import { AppService } from 'src/app/service/app.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-contract-template',
  templateUrl: './add-contract-template.component.html',
  styleUrls: ['./add-contract-template.component.scss']
})
export class AddContractTemplateComponent implements OnInit {

  @ViewChild('contractHeader') ContractTemplateHeaderComponent: ContractTemplateHeaderComponent | unknown;
  @ViewChild('determineSigner') DetermineSignerTemplateComponent: DetermineSignerTemplateComponent | unknown;
  @ViewChild('sampleContract') SampleContractTemplateComponent: SampleContractTemplateComponent | unknown;
  @ViewChild('infoContract') InforContractTemplateComponent: InforContractTemplateComponent | unknown;
  @ViewChild('confirmInforContract') ConfirmInforContractTemplateComponent: ConfirmInforContractTemplateComponent | unknown;

  action: string;
  id: string;
  private sub: any;
  datas: any = {
    stepLast: variable.stepSampleContract.step1,
  }

  personal_step = false;
  address_step = false;
  education_step = false;
  confirm_step = false;
  // step = 1;
  step = variable.stepSampleContract.step1;
  constructor(
              private appService: AppService,
              private route: ActivatedRoute,) { }
  ngOnInit() {
    //title
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if(this.action == 'add'){
        this.appService.setTitle('THÊM MỚI MẪU HỢP ĐỒNG');
      }else if(this.action == 'edit'){
        this.id = params['id'];
        this.appService.setTitle('SỬA HỢP MẪU ĐỒNG');
      }else if(this.action == 'copy'){
        this.id = params['id'];
        this.appService.setTitle('SAO CHÉP MẪU HỢP ĐỒNG');
      }
    });

  }

  getStep(e: any) {
    // this.step = this.datas.stepLast;
    this.step = e;
  }

}
