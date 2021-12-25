import { DatePipe } from '@angular/common';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-confirm-info-contract',
  templateUrl: './confirm-info-contract.component.html',
  styleUrls: ['./confirm-info-contract.component.scss']
})
export class ConfirmInfoContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  // @Output() stepChangeConfirmInforContract = new EventEmitter<string>();
  @Output() stepChangeSampleContract = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
              public datepipe: DatePipe,
              private contractService: ContractService,
              private router: Router,
              private toastService : ToastService,) {
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

  connUserViews:string = '';
  connUserSigns:string = '';
  connUserDocs:string = '';
  connPartnerLeads:string = '';
  connPartnerViews:string = '';
  connPartnerSigns:string = '';
  connPartnerDocs:string = '';
  connPartnerUsers:string = '';

  conn:string;


  ngOnInit(): void {
    console.log("step4" + this.datas.contract_user_sign);

    this.contractFileName = this.datas.file_name;
    this.dateDeadline = this.datepipe.transform(this.datas.sign_time, 'dd/MM/yyyy') || '';
    this.comment = this.datas.notes;

    if (this.datas.determine_contract) {
      let data_user_sign = JSON.parse(JSON.stringify(this.datas.determine_contract));
      console.log(data_user_sign);
      // data_user_sign.forEach((element: any) => {
        if (data_user_sign.type == 1) {
          data_user_sign.recipients.forEach((item: any) => {
            if (item.role == 2 && item.name) {
              this.userViews += this.connUserViews + item.name + " - " + item.email;
              this.connUserViews = "<br>";
            }
            else if (item.role == 3 && item.name) {
              this.userSigns += this.connUserSigns + item.name + " - " + item.email;
              this.connUserSigns = "<br>";
            }
            else if (item.role == 4 && item.name) {
              this.userDocs += this.connUserDocs + item.name + " - " + item.email;
              this.connUserDocs = "<br>";
            }
          })
        } else if (data_user_sign.type == 2) {
          data_user_sign.recipients.forEach((item: any) => {
            if (item.role == 1 && item.name) {
              this.partnerLeads += this.connPartnerLeads + item.name + " - " + item.email;
              this.connPartnerLeads = "<br>";
            }
            else if (item.role == 2 && item.name) {
              this.partnerViews += this.connPartnerViews + item.name + " - " + item.email;
              this.connPartnerViews = "<br>";
            }
            else if (item.role == 3 && item.name) {
              this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
              this.connPartnerSigns = "<br>";
            }
            else if (item.role == 4 && item.name) {
              this.partnerDocs += this.connPartnerDocs + item.name + " - " + item.email;
              this.connPartnerDocs = "<br>";
            }
          })
        } else if (data_user_sign.type == 3) {
          data_user_sign.recipients.forEach((item: any) => {
            if (item.role == 3 && item.name) {
              this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
              this.connPartnerSigns = "<br>";
            }
          })
        }
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
    // this.stepChangeConfirmInforContract.emit(step);
    this.stepChangeSampleContract.emit(step);
  }

  callAPI() {
    //call API step confirm
    this.datas.determine_contract.recipients.forEach((item: any) => {
      if (!item.phone) {
        item.phone = null;
      }
      delete item.id;
    })

    // this.contractService.addConfirmContract(this.datas).subscribe((data) => {
    this.contractService.coordinationContract(this.datas.determine_contract.id , this.datas.determine_contract.recipients).subscribe((data) => {
        console.log(JSON.stringify(data));
        setTimeout(() => {
          this.datas.step = variable.stepSampleContract.step_coordination;
          // save local check khi user f5 reload lại trang sẽ ko còn action điều phối hđ
          localStorage.setItem('coordination_complete', JSON.stringify(true));
          this.datas.coordination_complete = true;
          // this.datas.view = true;
          this.router.navigate(['/main/contract-signature/coordinates/' + this.datas.data_contract_document_id.contract_id]);
          this.toastService.showSuccessHTMLWithTimeout("Điều phối hợp đồng thành công!", "", 10000);
        }, 100)
      },
      error => {
        console.log("false content");
        return false;
      }
    );

  }

}
