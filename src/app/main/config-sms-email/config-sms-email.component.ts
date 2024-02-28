import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { log } from 'console';
import { forEach } from 'lodash';
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

  emailConfig: boolean = false;
  smsConfig: boolean = false;

  soonExpireDay: number
  isSoonExpireDay: boolean = false;
  idExpireDay: number;

  isRoleConfigSms: boolean = false;
  isRoleConfigExpirationDay: boolean = false;
  listConfig: any = [];
  lang: string;
  cols: any[];
  listStatus: any = [];
  listStatus1: any = [];
  notiStatus0: number = 1;
  notiStatus1: number = 1;
  notiStatus2: number = 1;
  notiStatus3: number = 1;
  notiStatus4: number = 1;
  orgId: any;
  dataConfig: any = [];
  myForm = new FormGroup({
    items: new FormArray([]),
  });

  constructor(
    private appService: AppService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
          
    let userId = this.userService.getAuthCurrentUser().id;

    const infoUser = await this.userService.getUserById(userId).toPromise();    
    this.orgId = infoUser.organization.id;
    const inforRole = await this.roleService.getRoleById(infoUser.role_id).toPromise();
    const listRole = inforRole.permissions;
    
    this.listConfig = [
      { smsTypeId: 6, name: 'Chuyển xử lý hợp đồng', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 0, },
      { smsTypeId: 1, name: 'Hủy hợp đồng', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 1 },
      { smsTypeId: 2, name: 'Từ chối hợp đồng', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 1 },
      { smsTypeId: 3, name: 'Hợp đồng sắp hết hạn', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 2 },
      { smsTypeId: 4, name: 'Hợp đồng quá hạn', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 2 },
      { smsTypeId: 5, name: 'Hợp đồng hoàn thành', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 1 },
    ];

    for (let i = 0; i < 5; i++) {
      // this.addFormGroup(this.dataBody[i]);
    }
    this.appService.setTitle("menu.config-sms-email");

    this.listStatus = [
      { id: 0, name: 'Người tạo' },
      { id: 1, name: 'Người tạo và những người đã xử lý' },
      // { id: 2, name: 'Người tạo và người đang xử lý' },
    ]
    
    this.listStatus1 = [
      { id: 0, name: 'Người tạo' },
      { id: 2, name: 'Người tạo và những người đang xử lý' },
    ]

    this.cols = [
      { header: 'config.type', style: 'text-align: left;' },
      { header: 'noti.sms', style: 'text-align: left;' },
      { header: 'noti.email', style: 'text-align: left;' },
      { header: 'sub.send.noti', style: 'text-align: left;' },
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    // this.spinner.show();
    this.isRoleConfigSms = listRole.some((element: any) => element.code == 'CAUHINH_SMS');
    this.isRoleConfigExpirationDay = listRole.some((element: any) => element.code == 'CAUHINH_NGAYSAPHETHAN');


    //gọi api thông tin cấu hình sms của tổ chức
    this.infoConfigSms();

    //gọi api cấu hình ngày sắp hết hạn
    this.infoDayExpiration();
  }

  get groupArray() {
    return this.myForm.controls['items'] as FormArray;
  }

  getControl(groupIndex: number, controlName: string) {
    return (this.groupArray.at(groupIndex) as FormGroup).get(controlName);
  }

  addFormGroup(value: any) {
    const newGroup = this.fb.group({
      smsTypeId: new FormControl(value.smsTypeId),
      smsConfig: new FormControl(value.smsConfig),
      emailConfig: new FormControl(value.emailConfig),
      userSendNotification: new FormControl(value.userSendNotification),
      organizationId: new FormControl(value.organizationId),
      nameConfig: new FormControl(value.name),
    });

    this.groupArray.push(newGroup);

  }

  selectConfigDropDown(event: any, data: any) {
  }

  infoDayExpiration() {
    this.contractService.getConfigExpirationDate().subscribe((response: any) => {
      this.spinner.hide();
      if (response.length > 0) {
        this.soonExpireDay = response[0].value;
        this.idExpireDay = response[0].id;
        this.isSoonExpireDay = true;


      } else {
        this.soonExpireDay = 5;
        this.isSoonExpireDay = false;
      }
    })
  }

  infoConfigSms() {
    this.contractService.getConfigSmsOrg().subscribe((response: any) => {
      this.dataConfig = response;
      this.mapData(this.dataConfig);
      response.forEach((element: any) => {
        this.smsConfig = element.smsConfig;
        this.emailConfig = element.emailConfig;
      });;
    })
  }

  updateSoonExpireDay() {
    if (this.isSoonExpireDay) {
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

  updateSmsEmail() {
    this.contractService.updateConfigSmsOrg(this.groupArray.value).subscribe((response: any) => {   
      if (response.status == 200) {
        this.infoConfigSms();
        this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000);
        this.spinner.hide();
        return;
      }
    })
  }
  
  onSubmit(){
    try {
      this.spinner.show();
      this.updateSmsEmail()
      this.updateSoonExpireDay()
    } catch (error) {
      this.spinner.hide();
    }
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


  mapData(dataBody: any) { 
    this.groupArray.clear();
    let dataId = [6, 1, 2, 3, 4, 5]
    dataId.forEach((value: any, index: any) => {
      let data = dataBody.filter((item: any) =>
        item.smsTypeId === value
      )
      if (data.length > 0) {
        this.addFormGroup(data[0])
      } else {
        this.addFormGroup(this.listConfig[index])
      }
    })
    this.getConfigName()
  }

  getConfigName() {
    for (let i = 0; i < this.groupArray.length; i++) {
      if (this.listConfig[i].smsTypeId == this.groupArray.controls[i].value.smsTypeId) {
        this.groupArray.at(i).patchValue({
          nameConfig: this.listConfig[i].name
      });
      }

    }
  }


}
