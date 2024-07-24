import { DatePipe } from '@angular/common';
import {Component, ElementRef, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import {forkJoin, timer} from "rxjs";

import {take} from "rxjs/operators";
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { delay, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UnitService } from 'src/app/service/unit.service';
import { environment } from 'src/environments/environment';
import { TimeService } from 'src/app/service/time.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-account-link-dialog',
  templateUrl: './account-link-dialog.component.html',
  styleUrls: ['./account-link-dialog.component.scss']
})
export class AccountLinkDialogComponent implements OnInit {
  addForm: FormGroup;
  datasOtp: any;
  datas: any;
  c:any;
  counter$: any;
  count = 180;
  isSentOpt = false;
  submitted = false;

  phoneOtp:any;
  isDateTime:any;
  userOtp:any;
  smsContractUse: any;
  smsContractBuy: any;
  ssoEmail: any = "";
  ssoOTP: any = "";
  COUNT_TIME: number = 180;
  isDisableSendOtp: boolean = false;
  isNextStep: boolean = false;
  currentStep: 'infor' | 'otp' | 'sync' = 'infor';
  warningLinkSsoMsg: string = 'Kính gửi Quý khách hàng,\nNhằm nâng cao chất lượng dịch vụ, MobiFone tiến hành nâng cấp hệ thống Quản lý tài khoản tập trung (SSO) cho các khách hàng sử dụng hệ sinh thái giải pháp số của MobiFone.\nSau khi hoàn thành liên kết, Quý khách có thể đăng nhập toàn bộ các hệ thống thuộc hệ sinh thái giải pháp của MobiFone bằng một tài khoản duy nhất.\n<b>Thời gian liên kết từ ngày....đến ngày...</b>'
  ssoSyncingTutorialLink: string = 'https://drive.google.com/drive/folders/13dy_0jrWMUAfwSYAHDtC4A8BQT6cd22n'
  isDisable: boolean = false;
  @Output() confirmOtpForm = new EventEmitter();

  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<AccountLinkDialogComponent>,
    private el: ElementRef,
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private deviceService: DeviceDetectorService,
    private unitService: UnitService,
    private timeService: TimeService,
    private userService: UserService

  ) { }



  ngOnInit(): void {
    this.count = this.COUNT_TIME;
    this.countTimeOtp();
    this.datasOtp = this.data;
    // this.datas = this.datasOtp.datas;
    this.addForm = this.fbd.group({
      otp: this.fbd.control("", [Validators.required]),
    });
    this.ssoEmail = this.data.email

    this.getDeviceApp();

  }

  async checkSMS(contractId: any, recipientId: any, phone: any) {
    //Lấy số lượng hợp đồng đã sử dụng
    const numberContractUseOriganzation = await this.unitService.getNumberContractUseOriganzation(this.data.orgId).toPromise();
    this.smsContractUse = numberContractUseOriganzation.sms;

    //Lấy số lượng hợp đồng đã mua
    const getNumberContractBuyOriganzation = await this.unitService.getNumberContractBuyOriganzation(this.data.orgId).toPromise();
    this.smsContractBuy = getNumberContractBuyOriganzation.sms;

    if(Number(this.smsContractUse) + Number(1) > Number(this.smsContractBuy)) {
      this.toastService.showErrorHTMLWithTimeout('Số lượng SMS của tổ chức không đủ để nhận thông tin ký hợp đồng. Liên hệ với Admin để tiếp tục sử dụng dịch vụ','',3000);
      return;
    } else {
        this.sendOtp(contractId, recipientId, phone);
    }
  }

  async onSubmit(step: any) {
    this.currentStep = step
    // @ts-ignore
    // document.getElementById("otp").focus();
    // this.submitted = true;
    // if (this.addForm.invalid) {
    //   return;
    // }
    //this.dialogRef.close(this.addForm.value.otp);
    //
    // this.confirmOtpForm.emit(this.addForm.value.otp);
    // await this.signContractSubmit();
    if (step == 'infor') {
      this.currentStep = 'otp'
    } else {
      if (this.isNextStep && (this.count == 0 || this.ssoOTP.length < 6)) return
      if (!this.isNextStep && this.currentStep == 'otp') {
        this.userService.getSsoLinkOtp(this.ssoEmail).subscribe(
          (res: any) => {
            if (res.code == '00') {
              this.currentStep = 'sync'
              this.toastService.showSuccessHTMLWithTimeout('Hệ thống đã gửi OTP đến địa chỉ email: ' + this.ssoEmail, '', 3000)
              this.isNextStep = true
            } else {
              this.toastService.showErrorHTMLWithTimeout('Gửi OTP thất bại','',3000)
            }
          }, (err: any) => {
            this.toastService.showErrorHTMLWithTimeout('Gửi OTP thất bại','',3000)
            console.log(err)
          }
        )
      } else {
        this.isDisable = true;
        this.userService.syncAccountSso(this.ssoEmail, this.ssoOTP).subscribe(
          (res: any) => {
            switch (res.code) {
              case '00':
                this.toastService.showSuccessHTMLWithTimeout('Liên kết tài khoản SSO thành công, vui lòng kiểm tra email để xem chi tiết thông tin.','', 3000)
                this.isNextStep = true
                this.isDisable = true;
                this.dialogRef.close()
                this.router.navigate(['/login']);
                break;
              case '01':
                this.toastService.showErrorHTMLWithTimeout('OTP đã nhập không chính xác','',3000)
                break;
              case '02':
                this.toastService.showErrorHTMLWithTimeout('Liên kết tài khoản SSO thất bại','',3000)
                break;
              case '03':
                this.toastService.showErrorHTMLWithTimeout('Thông tin tài khoản được liên kết không đúng','',3000)
                break;
              case '04':
                this.toastService.showErrorHTMLWithTimeout('Gửi OTP thất bại','',3000)
                break;
              case '05':
                this.toastService.showErrorHTMLWithTimeout('Tài khoản đã được liên kết SSO','',3000)
                break;
              case '06':
                this.toastService.showErrorHTMLWithTimeout('Gửi thông báo về tài khoản qua email thất bại','',3000)
                break;
              case '100':
                this.toastService.showErrorHTMLWithTimeout('Lỗi hệ thống','',3000)
                break;
              case '101':
                this.toastService.showErrorHTMLWithTimeout('Kết nối SSO thất bại','',3000)
                break;
            }
            this.isDisable = false;
          }, (err: any) => {
            this.toastService.showErrorHTMLWithTimeout('Liên kết tài khoản SSO thất bại','',3000)
            this.isDisable = false;
            console.log(err)
          }
        )
      }
    }
  }

  countTimeOtp() {
    this.isSentOpt = true;
    this.counter$ = timer(0,1000).pipe(
      take(this.count),
      map(() => this.transform(--this.count))
    );

  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes.toString().padStart(2, '0') + ':' +
    (value - minutes * 60).toString().padStart(2, '0');
  }

  sendOtpAgain(contract_id:any, recipient_id?:any, phone?:any) {
    this.count = this.COUNT_TIME;
    this.countTimeOtp();
    //  this.checkSMS(contract_id, recipient_id, phone);
    this.userService.getSsoLinkOtp(this.ssoEmail).subscribe(
      (res: any) => {
        if (res.code == '00') {
          this.toastService.showSuccessHTMLWithTimeout('Đã gửi OTP đến địa chỉ email: ' + this.ssoEmail, '', 3000)
          this.isNextStep = true
        } else {
          this.toastService.showErrorHTMLWithTimeout('Gửi OTP thất bại','',3000)
        }
      }, (err: any) => {
        this.toastService.showErrorHTMLWithTimeout('Gửi OTP thất bại','',3000)
        console.log(err)
      }
    )
  }

  sendOtp(contract_id:any, recipient_id:any, phone:any){
    // @ts-ignore
    document.getElementById("otp").focus();
    this.contractService.sendOtpContractProcess(contract_id, recipient_id, phone).subscribe(
      data => {
        if(!data.success){

          if(data.message == 'You have entered wrong otp 5 times in a row'){
            if(!this.mobile)
              this.toastService.showErrorHTMLWithTimeout('Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' + this.datepipe.transform(data.nextAttempt, "dd/MM/yyyy HH:mm"), "", 3000);
            else
              alert('Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' + this.datepipe.transform(data.nextAttempt, "dd/MM/yyyy HH:mm"));
            this.dialog.closeAll();
            this.router.navigate(['/main/form-contract/detail/' + contract_id]);
          }else{

            if(!this.mobile)
              this.toastService.showErrorHTMLWithTimeout('Lỗi gửi OTP', "", 3000);
            else
              alert('Lỗi gửi OTP');
          }
        }
        this.count = this.COUNT_TIME;
        this.countTimeOtp();
      }, error => {
        if(!this.mobile)
          this.toastService.showErrorHTMLWithTimeout('Có lỗi', "", 3000);
        else
          alert('Có lỗi');
      }
    )
  }

  getStyleReset(){
    if (this.count == 0) {
      if(this.mobile) {
        return {
          'width':'100px',
          'background-color': '#FCAF17'
        };
      } else
        return {
          'background-color': '#FCAF17'
        };
    } else {
      if(this.mobile) {
        return {
          'width':'100px',
          'background-color': '#99968f'
        };
      } else {
        return {
          'background-color': '#99968f'
        }
      }
    }
  }

  async signContractSubmit() {
    this.spinner.show();
    const signUploadObs$ = [];
    let indexSignUpload: any[] = [];
    let iu = 0;

    if(!this.mobile) {
      for (const signUpdate of this.datas.is_data_object_signature) {

        if (signUpdate && signUpdate.type == 2 && [3, 4].includes(this.datas.roleContractReceived)
          && signUpdate?.recipient?.email === this.datasOtp.currentUser.email
          && signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {

          const formData = {
            "name": "image_" + new Date().getTime() + ".jpg",
            "content": signUpdate.valueSign,
            organizationId: this.datas?.is_data_contract?.organization_id,
            signType: '',
            ocrResponseName: ''
          }

          signUploadObs$.push(this.contractService.uploadFileImageBase64Signature(formData));

          indexSignUpload.push(iu);
        }
        iu++;
      }
    } else {
      for (const signUpdate of this.datas.is_data_object_signature) {
        if (signUpdate && signUpdate.type == 2 && [3, 4].includes(this.datas.roleContractReceived)
          && signUpdate?.recipient?.email === this.datasOtp.currentUser.email
          && signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {
          const formData = {
            "name": "image_" + new Date().getTime() + ".jpg",
            "content": this.datas.is_data_object_signature.valueSign,
            organizationId: this.datas?.is_data_contract?.organization_id,
            signType: '',
            ocrResponseName: ''
          }


          signUploadObs$.push(this.contractService.uploadFileImageBase64Signature(formData));

          indexSignUpload.push(iu);
        }
        iu++;
      }
    }


    forkJoin(signUploadObs$).subscribe(async results => {
      let bucket = results[0].file_object.bucket;
      let ir = 0;
      for (const resE of results) {
        this.datas.filePath = resE?.file_object?.file_path;
        if (this.datas.filePath) {
          this.datas.is_data_object_signature[indexSignUpload[ir]].value = this.datas.filePath;
        }
        ir++;
      }
      await this.signContract(false, bucket);
    }, error => {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
    });
    if (signUploadObs$.length == 0) {
      await this.signContract(true);
    }

  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  async signContract(notContainSignImage?: boolean,bucket?: string) {
    const signUpdateTemp = JSON.parse(JSON.stringify(this.datas.is_data_object_signature));
    let signUpdatePayload = "";
    //neu khong chua chu ky anh
    if (notContainSignImage) {
      signUpdatePayload = signUpdateTemp.filter(
        (item: any) => item?.recipient?.email === this.datasOtp.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
        .map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            value: (item.type == 1 || item.type == 4) ? item.valueSign : item.value,
            font: item.font,
            font_size: item.font_size,
            bucket: bucket
          }
        });
    }else{
      this.userOtp = this.datasOtp.name;
      this.phoneOtp = this.datasOtp.phone;

      let http = null;

      this.isDateTime = await this.timeService.getRealTime().toPromise();
      await of(null).pipe(delay(100)).toPromise();

      const imageRender = <HTMLElement>document.getElementById('export-signature-image-html');

      let signI:any;
      if (imageRender) {
        const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
        signI = textSignB.split(",")[1];
      }


      signUpdatePayload = signUpdateTemp.filter(
        (item: any) => item?.recipient?.email === this.datasOtp.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
        .map((item: any) => {
          return {
            otp: this.addForm.value.otp,
            signInfo: signI,
            processAt: this.isDateTime,
            fields:[
              {
                id: item.id,
                name: item.name,
                value: (item.type == 1 || item.type == 4) ? item.valueSign : item.value,
                font: 'Times New Roman',
                font_size: 14,
                bucket: bucket
              }]
          }
        });
      if(signUpdatePayload){
        signUpdatePayload = signUpdatePayload[0];
      }
    }

    let typeSignDigital = null;
    for (const signUpdate of this.datas.is_data_object_signature) {
      if (signUpdate && signUpdate.type == 3 && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.datasOtp.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        if (signUpdate.recipient?.sign_type) {
          const typeSD = signUpdate.recipient?.sign_type.find((t: any) => t.id != 1);
          if (typeSD) {
            typeSignDigital = typeSD.id;
          }
        }
        break;
      }
    }
    if (typeSignDigital && typeSignDigital == 2) {

    } else {
      await this.signImageC(signUpdatePayload, notContainSignImage);
    }

  }

  getOptions(imageRender: any) {
    const scale = 5;
    const options = {
      quality: 0.99,
      width: imageRender.clientWidth * scale,
      height: imageRender.clientHeight * scale,
      style: { transform: 'scale(' + scale + ')', transformOrigin: 'top left' },
    };

    return options;
  }

  async signImageC(signUpdatePayload: any, notContainSignImage: any) {
    let signDigitalStatus = null;
    let signUpdateTempN = [];
    if(signUpdatePayload){
      signUpdateTempN = JSON.parse(JSON.stringify(signUpdatePayload));
      if (notContainSignImage) {
      }
    }

    if (notContainSignImage && !signDigitalStatus && this.datas.roleContractReceived != 2) {
      this.spinner.hide();
      return;
    }
    if(notContainSignImage){

    }else{
      this.contractService.updateInfoContractConsiderImg(signUpdateTempN, this.datasOtp.recipient_id).subscribe(
        async (result) => {
          if(result?.success == false){
            if(result.message == 'Wrong otp'){
              this.toastService.showErrorHTMLWithTimeout('Mã OTP không đúng', '', 3000);
              this.spinner.hide();
            }else if(result.message == 'Otp code has been expired'){
              this.toastService.showErrorHTMLWithTimeout('Mã OTP quá hạn', '', 3000);
              this.spinner.hide();
            }else if(result.message == 'You have entered wrong otp 5 times in a row'){
              this.toastService.showErrorHTMLWithTimeout('Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' + this.datepipe.transform(result.nextAttempt, "dd/MM/yyyy HH:mm"), '', 3000);
              this.dialog.closeAll();
              this.spinner.hide();
              this.router.navigate(['/main/form-contract/detail/' + this.datasOtp.contract_id]);

            } else{
              this.toastService.showErrorHTMLWithTimeout('Bạn vừa thực hiện ký số không thành công. Vui lòng kiểm tra thông tin tài khoản hoặc yêu cầu ký trên thiết bị!',
                'Thực hiện ký không thành công!', 3000);
              this.dialog.closeAll();
              this.spinner.hide();
            }
          }else{
            if (!notContainSignImage) {
            }
            setTimeout(() => {

              this.router.navigate(['/main/form-contract/detail/' + this.datasOtp.contract_id]);
              this.toastService.showSuccessHTMLWithTimeout(
                [3, 4].includes(this.datas.roleContractReceived) ? 'Bạn vừa thực hiện ký thành công. Hợp đồng đã được chuyển tới người tiếp theo!' : 'Xem xét hợp đồng thành công'
                , [3,4].includes(this.datas.roleContractReceived) ? 'Thực hiện ký thành công!' : '', 3000);
                this.dialog.closeAll();
                this.spinner.hide();
            }, 1000);
          }

        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
          this.spinner.hide();
        }
      )
    }

  }

  onOtpChange(event: any) {
    this.ssoOTP = event
    console.log()
  }

  openTutorialLink() {
    window.open(this.ssoSyncingTutorialLink)
  }
}
