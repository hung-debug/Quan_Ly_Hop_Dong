import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { Contract, ContractService } from 'src/app/service/contract.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

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

  numberExpirationDate: number;

  soonExpireDay: number
  isSoonExpireDay: boolean = false;
  idExpireDay: number;

  isRoleConfigSms: boolean = false;
  isRoleConfigExpirationDay: boolean = false;


  constructor(
    private appService: AppService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userService: UserService,
    private roleService: RoleService
  ) { }

  async ngOnInit(): Promise<void> {
    this.appService.setTitle("menu.config-sms-email");

    this.spinner.show();
    
    let userId = this.userService.getAuthCurrentUser().id;

    const infoUser = await this.userService.getUserById(userId).toPromise();
    const inforRole = await this.roleService.getRoleById(infoUser.role_id).toPromise();
    const listRole = inforRole.permissions;

    this.isRoleConfigSms = listRole.some((element:any) => element.code == 'CAUHINH_SMS');
    this.isRoleConfigExpirationDay = listRole.some((element:any) => element.code == 'CAUHINH_NGAYSAPHETHAN');


    //gọi api thông tin cấu hình sms của tổ chức
    this.infoConfigSms();

    //gọi api cấu hình ngày sắp hết hạn
    this.infoDayExpiration();
  }

  infoDayExpiration() {
    this.contractService.getConfigExpirationDate().subscribe((response: any) => {
      this.spinner.hide();
      if(response.length > 0) {
        this.soonExpireDay = response[0].value;
        this.idExpireDay = response[0].id;
        this.isSoonExpireDay = true;

        console.log("inffo ", this.idExpireDay);
      } else {
        this.soonExpireDay = 5;
        this.isSoonExpireDay = false;
      }
    })
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

  updateSoonExpireDay() {
    this.spinner.show();
    if(this.isSoonExpireDay) {
      //call api put truyen id
      const body = [{
        id: this.idExpireDay,
        param: 'TG_SAP_HET_HAN_KY',
        value: this.soonExpireDay
      }]

      this.contractService.editConfigExpirationDate(body).subscribe((response: any) => {
        this.spinner.hide();
      })
    } else {
      //call api put khong truyen id
      const body = [
        {
          param: 'TG_SAP_HET_HAN_KY',
          value: this.soonExpireDay
        }
      ]

      this.contractService.editConfigExpirationDate(body).subscribe((response: any) => {
        this.spinner.hide();
        this.isSoonExpireDay = true;
        this.idExpireDay = response[0].id;
      })
    }
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

  resetConfig() {
    this.spinner.show();
    this.infoConfigSms();
    this.spinner.hide();
  }

  resetSoonExpireDay() {
    this.spinner.show();
    this.infoDayExpiration();
    this.spinner.hide();
  }

}
