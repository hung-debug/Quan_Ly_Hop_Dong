import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log, count } from 'console';
import { forEach } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { Contract, ContractService } from 'src/app/service/contract.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigBrandnameDialogComponent} from './config-check-brandname-dialog/config-check-brandname-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import {parttern, parttern_input} from "src/app/config/parttern";

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
  tlsMailServer: boolean = false;
  soonExpireDay: number
  isSoonExpireDay: boolean = false;
  idExpireDay: number;

  isRoleConfigSms: boolean = false;
  isRoleConfigExpirationDay: boolean = false;
  isRoleConfigBrandname: boolean = false; // cấu hình brandname
  isRoleConfigEmailServer: boolean = false; // cấu hình email server
  listConfig: any = [];
  lang: string;
  cols: any[];
  listStatus: any = [];
  listStatus1: any = [];
  listStatus2: any = [];
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
  fieldTextType: boolean = false;
  optionsSupplier: any;
  submitted = false;
  contractSupplier: number;
  brandnameForm: FormGroup;
  ConfigEmailServerForm: FormGroup;
  isDisable: boolean = true; //auto = true
  isDisableSoonExpireDay: boolean = true;
  isDisableConfigSmsEmail: boolean = true;
  isDisableConfigEmailServer: boolean = true;
  listConfigBrandname:  any ;
  listConfigEmailServer: any;
  brandname: any = 'mContract';
  userNameMailServer: any = "econtract@mobifone.vn";
  aliasMailServer: any = "eContract";
  pattern = parttern;
  count : any = 0;

  get f() { return this.brandnameForm.controls; }
  get e() { return this.ConfigEmailServerForm.controls; }
  constructor(
    private appService: AppService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private fbd: FormBuilder,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.brandnameForm = this.fbd.group({
      brandName: this.fbd.control(this.brandname, [Validators.required, Validators.pattern(parttern.brandname)]),
      smsUser: this.fbd.control("", [Validators.required]),
      smsPass: this.fbd.control("", [Validators.required]),
      contractSupplier: this.fbd.control("MOBIFONE", [Validators.required]),
    });
    
    this.ConfigEmailServerForm = this.fbd.group({
      userNameMailServer: this.fbd.control(this.userNameMailServer, [Validators.required, Validators.pattern(parttern.email)]),
      aliasMailServer: this.fbd.control(this.aliasMailServer, [Validators.required]),
      passwordMailServer: this.fbd.control("", [Validators.required]),
      hostMailServer: this.fbd.control("", [Validators.required, Validators.pattern(parttern.hostMailServer)]),
      portMailServer: this.fbd.control("", [Validators.required, Validators.pattern(parttern.portMailServer)]),
      tlsMailServer: this.fbd.control("", [Validators.required]),
    });
   }

  async ngOnInit(): Promise<void> {
          
    let userId = this.userService.getAuthCurrentUser().id;

    const infoUser = await this.userService.getUserById(userId).toPromise();   
    console.log("infoUser",infoUser);
     
    this.listConfigEmailServer = infoUser.organization;
    this.listConfigBrandname = infoUser.organization;
    if(this.listConfigBrandname.smsSendMethor == 'API'){
      this.listConfigBrandname.contractSupplier = 'MOBIFONE'
    } else{
      this.listConfigBrandname.contractSupplier = 'VNPT'
    }   
    
    this.brandnameForm.patchValue({
      brandName: !infoUser.organization.brandName && infoUser.organization.smsSendMethor == "API" ? this.brandname : infoUser.organization.brandName, // Cập nhật giá trị cho brandName
      contractSupplier: infoUser.organization.smsSendMethor == "API" ? "MOBIFONE" : "VNPT", // Cập nhật giá trị contractSupplier
      smsUser:  infoUser.organization.smsUser, // Cập nhật giá trị cho smsUser
      smsPass:  infoUser.organization.smsPass, // Cập nhật giá trị cho smsPass
    });
    
    if(this.brandnameForm.value.brandName === this.brandname && this.brandnameForm.value.contractSupplier == "MOBIFONE"){
      this.brandnameForm.get('smsUser')?.disable();
      this.brandnameForm?.get('smsPass')?.disable();
      
      this.brandnameForm.patchValue({
        smsUser:  "", // Cập nhật giá trị cho smsUser
        smsPass:  "", // Cập nhật giá trị cho smsPass
      });
    }
    
    this.ValidConfigBrandName();
    console.log("this.ConfigEmailServerForm.patchValue",this.ConfigEmailServerForm);
    
    this.ConfigEmailServerForm.patchValue({
      userNameMailServer: !infoUser.organization.userNameMailServer ? this.userNameMailServer : infoUser.organization.userNameMailServer, // Cập nhật giá trị userNameMailServer
      aliasMailServer: !infoUser.organization.aliasMailServer ? this.aliasMailServer : infoUser.organization.aliasMailServer, // Cập nhật giá trị aliasMailServer
      passwordMailServer: infoUser.organization.passwordMailServer, // Cập nhật giá trị cho passwordMailServer
      hostMailServer: infoUser.organization.hostMailServer, // Cập nhật giá trị cho hostMailServer
      portMailServer: infoUser.organization.portMailServer, // Cập nhật giá trị cho portMailServer
      tlsMailServer: infoUser.organization.tlsMailServer, // Cập nhật giá trị cho tlsMailServer
    });
    
    if(this.ConfigEmailServerForm.value.userNameMailServer === this.userNameMailServer){
      this.ConfigEmailServerForm?.get('aliasMailServer')?.disable();
      this.ConfigEmailServerForm?.get('passwordMailServer')?.disable();
      this.ConfigEmailServerForm?.get('hostMailServer')?.disable();
      this.ConfigEmailServerForm?.get('portMailServer')?.disable();
      
      this.ConfigEmailServerForm.patchValue({
        passwordMailServer:  "", // Cập nhật giá trị cho passwordMailServer
        hostMailServer:  "", // Cập nhật giá trị cho hostMailServer
        portMailServer: "", // Cập nhật giá trị cho portMailServer
      });
    }
    
    this.ValidConfigEmailServer();
    this.orgId = infoUser.organization.id;
    const inforRole = await this.roleService.getRoleById(infoUser.role_id).toPromise();
    const listRole = inforRole.permissions;
    
    this.listConfig = [
      { smsTypeId: 6, name: 'Chuyển xử lý hợp đồng', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 0, },
      { smsTypeId: 1, name: 'Hủy hợp đồng', organizationId: this.orgId, emailConfig: false, smsConfig: false, userSendNotification: 3 },
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
    ]
    
    this.listStatus1 = [
      { id: 0, name: 'Người tạo' },
      { id: 2, name: 'Người tạo và những người đang xử lý' },
    ]
    
    this.listStatus2 = [
      { id: 3, name: 'Người đang xử lý và những người đã xử lý' },
    ]

    this.cols = [
      { header: 'config.type', style: 'text-align: left;' },
      { header: 'noti.sms', style: 'text-align: left;' },
      { header: 'noti.email', style: 'text-align: left;' },
      { header: 'sub.send.noti', style: 'text-align: left;' },
    ];
    
    this.optionsSupplier = [
      { id: 'MOBIFONE', name: 'MobiFone' },
      { id: 'VNPT', name: 'VNPT' },
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    // this.spinner.show();
    this.isRoleConfigSms = listRole.some((element: any) => element.code == 'CAUHINH_SMS');
    this.isRoleConfigExpirationDay = listRole.some((element: any) => element.code == 'CAUHINH_NGAYSAPHETHAN');
    this.isRoleConfigBrandname = listRole.some((element: any) => element.code == 'CAUHINH_BRANDNAME');
    this.isRoleConfigEmailServer = listRole.some((element: any) => element.code == 'CAUHINH_MAILSERVER');
    
    //gọi api thông tin cấu hình sms của tổ chức
    this.infoConfigSms();

    //gọi api cấu hình ngày sắp hết hạn
    this.infoDayExpiration();
    this.ValidConfigSmsEmail();
  }

  get groupArray() {
    return this.myForm.controls['items'] as FormArray;
  }

  getControl(groupIndex: number, controlName: string) {
    return (this.groupArray.at(groupIndex) as FormGroup).get(controlName);
  }

  addFormGroup(value: any) {
    if(value.smsTypeId == 1 ){
      const newGroup = this.fb.group({
        smsTypeId: new FormControl(value.smsTypeId),
        smsConfig: new FormControl(value.smsConfig),
        emailConfig: new FormControl(value.emailConfig),
        userSendNotification: new FormControl(3),
        organizationId: new FormControl(value.organizationId),
        nameConfig: new FormControl(value.name),
      });      
      this.groupArray.push(newGroup);
      
    }else{
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

  }
  
  ValidConfigSmsEmail(): void{  
    this.infoConfigSms().then(() =>{
      this.isDisableConfigSmsEmail = true;
        this.myForm.valueChanges.subscribe(value => { 
          this.isDisableConfigSmsEmail = false;
        })
    })
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

  async infoConfigSms(): Promise<void> {
    return new Promise<void>(async(resolve, reject) => {
      let response = await this.contractService.getConfigSmsOrg().toPromise()
      this.dataConfig = response;
      this.mapData(this.dataConfig);
      response.forEach((element: any) => {
        this.smsConfig = element.smsConfig;
        this.emailConfig = element.emailConfig;
      });;
      resolve(); // Khi functionA thực hiện xong, gọi resolve()
    });
  }
  
  onSoonExpireDayChange(value: any){
    this.soonExpireDay = value
    this.isDisableSoonExpireDay = false;   
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
        this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000);
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
        this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000);
      })
    }
  }
  
  updateSmsEmail() {
    this.contractService.updateConfigSmsOrg(this.groupArray.value).subscribe((response: any) => { 
      if (response.status == 200) {
        // this.infoConfigSms();
        this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000);
        this.spinner.hide();
        this.isDisableConfigSmsEmail = true;
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
  
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  
  onChangeBrandname(){
    if(this.brandnameForm.value.brandName == this.brandname && this.brandnameForm.value.contractSupplier == "MOBIFONE"){
      this.brandnameForm?.get('smsUser')?.disable();    
      this.brandnameForm?.get('smsPass')?.disable();
      this.brandnameForm.controls['smsUser'].setValue("");
      this.brandnameForm.controls['smsPass'].setValue("");
    }else{
      this.brandnameForm?.get('smsUser')?.enable();    
      this.brandnameForm?.get('smsPass')?.enable();
    }
  }
  
  onChangeSupplier(){
    if(this.brandnameForm.value.brandName == this.brandname && this.brandnameForm.value.contractSupplier == "MOBIFONE"){
      this.brandnameForm?.get('smsUser')?.disable();    
      this.brandnameForm?.get('smsPass')?.disable();
      this.brandnameForm.controls['smsUser'].setValue("");
      this.brandnameForm.controls['smsPass'].setValue("");
    }else{
      this.brandnameForm?.get('smsUser')?.enable();    
      this.brandnameForm?.get('smsPass')?.enable();
    }
  }
  
  onChangeEmailServer(){
    if(this.ConfigEmailServerForm.value.userNameMailServer == this.userNameMailServer){
      this.ConfigEmailServerForm?.get('aliasMailServer')?.disable();
      this.ConfigEmailServerForm?.get('passwordMailServer')?.disable();    
      this.ConfigEmailServerForm?.get('hostMailServer')?.disable();
      this.ConfigEmailServerForm?.get('portMailServer')?.disable();
      this.ConfigEmailServerForm.controls['aliasMailServer'].setValue(this.aliasMailServer);
      this.ConfigEmailServerForm.controls['passwordMailServer'].setValue("");
      this.ConfigEmailServerForm.controls['hostMailServer'].setValue("");
      this.ConfigEmailServerForm.controls['portMailServer'].setValue("");
    }else{
      this.ConfigEmailServerForm?.get('aliasMailServer')?.enable();
      this.ConfigEmailServerForm?.get('passwordMailServer')?.enable();    
      this.ConfigEmailServerForm?.get('hostMailServer')?.enable();
      this.ConfigEmailServerForm?.get('portMailServer')?.enable();
    }
  }

  ValidConfigBrandName(){
    this.brandnameForm.valueChanges.subscribe(value => {    
      this.isDisable = false;
      if((this.listConfigBrandname.brandName == value.brandName && this.brandnameForm.value.contractSupplier == this.listConfigBrandname.contractSupplier && this.listConfigBrandname.smsUser == value.smsUser && this.listConfigBrandname.smsPass == value.smsPass)){
        this.isDisable = true;
      }      
    })
  }
  
  configBrandname(){
    if (this.brandnameForm.invalid) {
      return;
    }
         
    this.userService.updateConfigBrandname(this.brandnameForm.value,this.orgId).subscribe((res: any) =>{    
      this.isDisable = true;   
      this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000); 
    })
  }
  
  ValidConfigEmailServer(){
    this.ConfigEmailServerForm.valueChanges.subscribe(value => {
      this.isDisableConfigEmailServer = false;
      if(this.listConfigEmailServer.userNameMailServer == value.userNameMailServer && this.listConfigEmailServer.aliasMailServer == value.aliasMailServer && this.listConfigEmailServer.passwordMailServer == value.passwordMailServer && this.listConfigEmailServer.hostMailServer == value.hostMailServer && this.listConfigEmailServer.portMailServer == value.portMailServer && this.listConfigEmailServer.tlsMailServer == value.tlsMailServer){
        this.isDisable = true;
      }
    })
  }
  
  configEmailServer(){
    if (this.ConfigEmailServerForm.invalid) {
      return;
    }
    
    this.userService.updateConfigEmailServer(this.ConfigEmailServerForm.value, this.orgId).subscribe((res: any) => {
      this.isDisableConfigEmailServer = true;
      this.toastService.showSuccessHTMLWithTimeout('update.success', '', 3000);
    })
  }
}
