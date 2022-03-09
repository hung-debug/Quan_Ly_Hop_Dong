import { DatePipe } from '@angular/common';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';

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
              private contractTemplateService: ContractTemplateService,
              private router: Router,
              private toastService : ToastService,
              private contractTypeService: ContractTypeService) {
    this.step = variable.stepSampleContract.step4
  }

  contractName:any='';
  contractCode:any='';
  contractFileName:string = '';
  contractType:string = '';
  startTime:string = '';
  endTime:string = '';
  time:string = '';
  comment:string = '';
  userViews:string = '';
  userSigns:string = '';
  userDocs:string = '';
  countPartnerLeads:number = 0;
  countPartnerViews:number = 0;
  countPartnerSigns:number = 0;
  countPartnerDocs:number = 0;
  countPartnerUsers:number = 0;

  connUserViews:string = '';
  connUserSigns:string = '';
  connUserDocs:string = '';
  isOrg:boolean = true;

  conn:string;
  ngOnInit(): void {
    console.log("step4" + this.datas.contract_user_sign);

    this.contractName = this.datas.name; 
    this.contractCode = this.datas.code;
    this.contractFileName = this.datas.file_name; 
    this.startTime = this.datepipe.transform(this.datas.start_time, 'dd/MM/yyyy') || '';
    this.endTime = this.datepipe.transform(this.datas.end_time, 'dd/MM/yyyy') || '';
    this.time = this.startTime + " - " + this.endTime;
    if(this.datas.type_id){
      this.contractTypeService.getContractTypeById(this.datas.type_id).subscribe(data => {
        this.contractType = data.name;
      })
    }

    if (this.datas.is_determine_clone && this.datas.is_determine_clone.length > 0) {
      let data_user_sign = [...this.datas.is_determine_clone];
      console.log(data_user_sign);
      data_user_sign.forEach((element: any) => {
        if (element.type == 1) {
          element.recipients.forEach((item: any) => {
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
        } else if (element.type == 2) {
          this.isOrg = true;
          element.recipients.forEach((item: any) => {
            if (item.role == 1 && item.name) {
              this.countPartnerLeads++;
            }
            else if (item.role == 2 && item.name) {
              this.countPartnerViews++;
            }
            else if (item.role == 3 && item.name) {
              this.countPartnerSigns++;
            }
            else if (item.role == 4 && item.name) {
              this.countPartnerDocs++;
            }
          })
        } else if (element.type == 3) {
          this.isOrg = false;
          element.recipients.forEach((item: any) => {
            if (item.role == 3 && item.name) {
              this.countPartnerSigns++;
            }
          })
        }
      })
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
    this.contractTemplateService.changeStatusContract(this.datas.id, 10).subscribe((data) => {

      console.log(data);
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract-template']);
      });
      this.toastService.showSuccessHTMLWithTimeout("Tạo mẫu hợp đồng thành công!", "", 3000);
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Tạo mẫu hợp đồng thất bại", "", 3000);
      return false;
    }
    );

  }
}
