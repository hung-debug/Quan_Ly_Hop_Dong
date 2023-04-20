import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { Contract, ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-config-sms-email',
  templateUrl: './config-sms-email.component.html',
  styleUrls: ['./config-sms-email.component.scss']
})
export class ConfigSmsEmailComponent implements OnInit {

  outOfDateContarct: boolean = false;
  aboutExpiredContract: boolean = false;
  rejectContract: boolean = false;
  cancelContract: boolean = false;
  completedContract: boolean = false;

  constructor(
    private appService: AppService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("menu.config-sms-email");

    //gọi api thông tin cấu hình sms của tổ chức
    this.infoConfigSms();
  }

  infoConfigSms() {
    this.contractService.getConfigSmsOrg().subscribe((response: any) => {
      this.cancelContract = response.some((element: any) => element.id == 1);
      this.rejectContract = response.some((element: any) => element.id == 2);
      this.aboutExpiredContract = response.some((element: any) => element.id == 3);
      this.outOfDateContarct = response.some((element: any) => element.id == 4);
      this.completedContract = response.some((element: any) => element.id == 5);
    })
  }

  updateSms() {
    this.spinner.show();
    let smsTypeIdList: number[]= [];

    if(this.cancelContract) {
      smsTypeIdList.push(1);
    }

    if(this.rejectContract) {
      smsTypeIdList.push(2)
    }

    if(this.aboutExpiredContract) {
      smsTypeIdList.push(3)
    }

    if(this.outOfDateContarct) {
      smsTypeIdList.push(4)
    }

    if(this.completedContract) {
      smsTypeIdList.push(5);
    }

    this.contractService.updateConfigSmsOrg(smsTypeIdList).subscribe((response: any) => {
      if(response.status == 200) {
        this.infoConfigSms();
        this.toastService.showSuccessHTMLWithTimeout('update.success','',3000);
        this.spinner.hide();
        return;
      }
   })
  }

}
