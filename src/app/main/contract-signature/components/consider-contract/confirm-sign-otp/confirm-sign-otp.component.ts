import { DatePipe } from '@angular/common';
import {Component, ElementRef, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import {forkJoin, Observable, timer} from "rxjs";

import {take} from "rxjs/operators";
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import {ImageDialogSignComponent} from "../image-dialog-sign/image-dialog-sign.component";
import {PkiDialogSignComponent} from "../pki-dialog-sign/pki-dialog-sign.component";
// @ts-ignore
import domtoimage from 'dom-to-image';
import { concatMap, delay, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
import { UnitService } from 'src/app/service/unit.service';


@Component({
  selector: 'app-confirm-sign-otp',
  templateUrl: './confirm-sign-otp.component.html',
  styleUrls: ['./confirm-sign-otp.component.scss']
})
export class ConfirmSignOtpComponent implements OnInit {
  addForm: FormGroup;
  datasOtp: any;
  datas: any;
  c:any;
  counter$: any;
  count = 120;
  isSentOpt = false;
  submitted = false;

  phoneOtp:any;
  isDateTime:any;
  userOtp:any;
  smsContractUse: any;
  smsContractBuy: any;
  
  @Output() confirmOtpForm = new EventEmitter();

  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmSignOtpComponent>,
    private el: ElementRef,
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private deviceService: DeviceDetectorService,
    private unitService: UnitService
  ) { }



  ngOnInit(): void {    
    this.datasOtp = this.data;
    this.datas = this.datasOtp.datas;
    this.addForm = this.fbd.group({
      otp: this.fbd.control("", [Validators.required]),
    });
      this.checkSMS(this.datasOtp.contract_id, this.datasOtp.recipient, this.datasOtp.phone);
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

  async onSubmit() {
    // @ts-ignore
    document.getElementById("otp").focus();
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    //this.dialogRef.close(this.addForm.value.otp);
    // console.log(this.addForm.value.otp);
    // this.confirmOtpForm.emit(this.addForm.value.otp);
    await this.signContractSubmit();
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

  sendOtpAgain(contract_id:any, recipient_id:any, phone:any) {
     this.checkSMS(contract_id, recipient_id, phone);
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
        this.count = 120;
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
        console.log('ki anh', signUpdate);
        if (signUpdate && signUpdate.type == 2 && [3, 4].includes(this.datas.roleContractReceived)
          && signUpdate?.recipient?.email === this.datasOtp.currentUser.email
          && signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {
    
          const formData = {
            "name": "image_" + new Date().getTime() + ".jpg",
            "content": signUpdate.valueSign,
            organizationId: this.datas?.is_data_contract?.organization_id
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
            "content": this.datasOtp.datas.is_data_object_signature.valueSign,
            organizationId: this.datas?.is_data_contract?.organization_id
          }
  
          signUploadObs$.push(this.contractService.uploadFileImageBase64Signature(formData));
    
          indexSignUpload.push(iu);
        }
        iu++;
      }
    }
    

    forkJoin(signUploadObs$).subscribe(async results => {
      let ir = 0;
      for (const resE of results) {
        this.datas.filePath = resE?.file_object?.file_path;
        if (this.datas.filePath) {
          this.datas.is_data_object_signature[indexSignUpload[ir]].value = this.datas.filePath;
        }
        ir++;
      }
      await this.signContract(false);
    }, error => {
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

  async signContract(notContainSignImage?: boolean) {
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
            font_size: item.font_size
          }
        });
    }else{
      this.userOtp = this.datasOtp.name;
      this.phoneOtp = this.datasOtp.phone;
      this.isDateTime = this.datepipe.transform(new Date(), "dd/MM/yyyy HH:mm");
      await of(null).pipe(delay(100)).toPromise();
      
      const imageRender = <HTMLElement>document.getElementById('export-signature-image-html');
      
      let signI:any;
      if (imageRender) {
        const textSignB = await domtoimage.toPng(imageRender);
        signI = textSignB.split(",")[1];
      }
     

      signUpdatePayload = signUpdateTemp.filter(
        (item: any) => item?.recipient?.email === this.datasOtp.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
        .map((item: any) => {
          return {
            otp: this.addForm.value.otp,
            signInfo: signI,
            processAt: this.datepipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            fields:[
              {
                id: item.id,
                name: item.name,
                value: (item.type == 1 || item.type == 4) ? item.valueSign : item.value,
                font: 'Arial',
                font_size: 14
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
              this.toastService.showErrorHTMLWithTimeout('Ký hợp đồng không thành công', '', 3000);
              this.dialog.closeAll();
              this.spinner.hide();
            }
          }else{
            if (!notContainSignImage) {
            }
            setTimeout(() => {
              console.log("vao day ky hop dong thanh cong ");
              this.router.navigate(['/main/form-contract/detail/' + this.datasOtp.contract_id]);
              this.toastService.showSuccessHTMLWithTimeout(
                [3, 4].includes(this.datas.roleContractReceived) ? 'Ký hợp đồng thành công' : 'Xem xét hợp đồng thành công'
                , '', 3000);
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
}
