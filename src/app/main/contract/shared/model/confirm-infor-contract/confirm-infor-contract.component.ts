import { DatePipe } from '@angular/common';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss']
})
export class ConfirmInforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeConfirmInforContract = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
              public datepipe: DatePipe,
              private contractService: ContractService,
              private router: Router,) {
    this.step = variable.stepSampleContract.step4
  }

  contractFileName:string = '';
  dateDeadline:string = '';
  comment:string = '';
  userViews:string = '';
  userSigns:string = '';
  userDocs:string = '';
  partnerLeads:string = '';
  partnerViews:string = '';
  partnerSigns:string = '';
  partnerDocs:string = '';
  partnerUsers:string = '';

  conn:string;
  ngOnInit(): void {
    console.log("step4" + this.datas.contract_user_sign);

    this.contractFileName = this.datas.file_name;
    this.dateDeadline = this.datepipe.transform(this.datas.dateDeadline, 'dd/MM/yyyy') || '';
    this.comment = this.datas.comment;

    this.conn = '';
    if (this.datas.userForm.userViews && this.datas.userForm.userViews.length > 0) {
      this.datas.userForm.userViews.forEach((item: any) => {
        this.userViews = this.userViews + this.conn + item.name + " - " + item.email;
        this.conn = "<br>";
      })
    }

    let userSigns:string = '';
    this.conn = '';
    if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length > 0) {
      this.datas.userForm.userSigns.forEach((item: any) => {
        this.userSigns = this.userSigns + this.conn + item.name + " - " + item.email;
        this.conn = "<br>";
      })
    }

    let userDocs:string = '';
    this.conn = '';
    if (this.datas.userForm.userDocs && this.datas.userForm.userDocs.length > 0) {
      this.datas.userForm.userDocs.forEach((item: any) => {
        this.userDocs = this.userDocs + this.conn + item.name + " - " + item.email;
        this.conn = "<br>";
      })
    }

    let connLeads = '';
    let connViews = '';
    let connSigns = '';
    let connDocs = '';
    let connUsers = '';
    if (this.datas.partnerForm.partnerArrs && this.datas.partnerForm.partnerArrs.length > 0) {
      this.datas.partnerForm.partnerArrs.forEach((element: any) => {

        if(element.type == 1){
          if (element.partnerLeads && element.partnerLeads.length > 0) {
            element.partnerLeads.forEach((item: any) => {
              this.partnerLeads = this.partnerLeads + connLeads + item.name + " - " + item.email;
              connLeads = "<br>";
            })
          }

          if (element.partnerViews && element.partnerViews.length > 0) {
            element.partnerViews.forEach((item: any) => {
              this.partnerViews = this.partnerViews + connViews + item.name + " - " + item.email;
              connViews = "<br>";
            })
          }

          if (element.partnerSigns && element.partnerSigns.length > 0) {
            element.partnerSigns.forEach((item: any) => {
              this.partnerSigns = this.partnerSigns + connSigns + item.name + " - " + item.email;
              connSigns = "<br>";
            })
          }

          if (element.partnerDocs && element.partnerDocs.length > 0) {
            element.partnerDocs.forEach((item: any) => {
              this.partnerDocs = this.partnerDocs + connDocs + item.name + " - " + item.email;
              connDocs = "<br>";
            })
          }
        }else{
          if (element.partnerUsers && element.partnerUsers.length > 0) {
            element.partnerUsers.forEach((item: any) => {
              this.partnerUsers = this.partnerUsers + connUsers + item.name + " - " + item.email;
              connUsers = "<br>";
            })
          }
        }
      })
    }

    if(this.partnerUsers != ''){
      this.partnerSigns += '<br>' + this.partnerUsers;
    }
  }

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  // next step event
  next() {
    this.callAPI();
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeConfirmInforContract.emit(step);
  }

  callAPI() {
    //call API step confirm
  //   this.contractService.addConfirmContract(this.datas).subscribe((data) => {
  //
  //     console.log(JSON.stringify(data));
  //     this.router.navigate(['/main/contract/create/draft']);
  //   },
  //   error => {
  //     console.log("false content");
  //     return false;
  //   }
  //   );
  //
  }
}
