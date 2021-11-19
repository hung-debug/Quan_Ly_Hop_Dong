import { ConfirmInforContractBatchComponent } from './../shared-batch/model/confirm-infor-contract-batch/confirm-infor-contract-batch.component';
import { InforContractBatchComponent } from './../shared-batch/model/infor-contract-batch/infor-contract-batch.component';
import { ContractBatchHeaderComponent } from './../shared-batch/model/contract-batch-header/contract-batch-header.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {variable} from "../../../config/variable";
import { FormBuilder } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-contract-batch',
  templateUrl: './add-contract-batch.component.html',
  styleUrls: ['./add-contract-batch.component.scss']
})
export class AddContractBatchComponent implements OnInit {

  @ViewChild('contractHeader') ContractBatchHeaderComponent: ContractBatchHeaderComponent | unknown;
  @ViewChild('infoContract') InforContractBatchComponent: InforContractBatchComponent | unknown;
  @ViewChild('confirmInforContract') ConfirmInforContractBacthComponent: ConfirmInforContractBatchComponent | unknown;

  action: string;
  id: string;
  private sub: any;
  datas: any = {
    stepLast: variable.stepBatchContract.step1,
  }
  step = variable.stepBatchContract.step1;
  constructor(private formBuilder: FormBuilder,
              private appService: AppService,
              private route: ActivatedRoute,) { }
  ngOnInit() {
    //title
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if(this.action == 'add'){
        this.appService.setTitle('contract.add');
      }else if(this.action == 'edit'){
        this.id = params['id'];
        this.appService.setTitle('contract.edit');
      }else if(this.action == 'copy'){
        this.id = params['id'];
        this.appService.setTitle('contract.copy');
      }
    });

  }
  getStep(e: any) {
    // this.step = this.datas.stepLast;
    this.step = e;
  }

}
