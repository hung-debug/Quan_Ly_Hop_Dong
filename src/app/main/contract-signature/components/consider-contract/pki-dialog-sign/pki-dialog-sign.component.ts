import { HttpErrorResponse } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { networkList } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import {ToastService} from "../../../../../service/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pki-dialog-sign',
  templateUrl: './pki-dialog-sign.component.html',
  styleUrls: ['./pki-dialog-sign.component.scss']
})
export class PkiDialogSignComponent implements OnInit {
  datas: any;
  optionsNetworkCompany: any = [
    {item_id: 'mobifone', item_text: 'mobifone'},
    {item_id: 'vietel', item_text: 'vietel'}
  ];
  networkCode: any;
  currentUser: any;
  nl: Array<any> = [];
  networkCompany: any = 0;
  phoneNum: any;
  type: any = 0;
  hidden_phone: boolean = true;
  environment: any = '';
  isError = false;
  isErrorInvalid = false;
  isErrorNetwork = false;
  patternPhone = /^[0-9]*$/;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialogRef: MatDialogRef<PkiDialogSignComponent>,
    private toastService : ToastService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.environment = environment
    this.nl = networkList;
    this.datas = this.data;
    this.phoneNum = this.datas?.sign?.phone;
    this.networkCode = this.datas?.sign?.phone_tel;
    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else
      this.type = 0;
  }

  onSubmit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe(async (response) => {

      let ArrRecipients = response.recipients.filter((ele: any) => ele.email == this.currentUser.email);


      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.sign_type[0].id == 3) {
          ArrRecipientsNew = true
          return
        }
      });


      if (!ArrRecipientsNew) {

        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý tài liệu này!',
          '',
          3000
        );
        if (this.type == 1) {
          this.router.navigate(['/login']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        } else {
          this.router.navigate(['/main/dashboard']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        }
      };


    this.contractService.getCheckSignatured(this.data.recipientId).subscribe((res: any) => {
      if (res && res.status == 2) {
        this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
        return;
      }
    }, (error: HttpErrorResponse) => {
      this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
    })




    if (!this.phoneNum || (this.phoneNum && this.phoneNum.length < 9 || this.phoneNum.length > 11) || (this.phoneNum && !this.patternPhone.test(this.phoneNum))) {
      if(!this.phoneNum) {
        this.isError = true;
        this.isErrorInvalid = false
        // this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập số điện thoại', '', 3000);
        return;
      } else {
        this.isErrorInvalid = true;
        this.isError = false
        // this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập đúng định dạng số điện thoại', '', 3000);
        return;
      }
    }
        this.isError = false
        this.isErrorInvalid = false

    if(!this.networkCode) {
      this.isErrorNetwork = true;
      return;
    }
        this.isErrorNetwork = false;

    const firstChar = this.phoneNum.charAt(0);
    let resPhone = this.phoneNum;
    if(this.phoneNum && firstChar && firstChar == '0') {
      resPhone = '84' + this.phoneNum.substring(1);
    }
    const itemNameNetwork = this.nl.find((nc: any) => nc.id == this.networkCode);
    if (itemNameNetwork) {



      this.networkCompany = itemNameNetwork.id == 'bcy' ? 'bcy' : itemNameNetwork.name;
    }

    const resDialog = {
      phone: resPhone,
      networkCode: this.networkCompany,
      phone_tel: this.networkCode,
      hidden_phone: this.hidden_phone,
    };



    this.dialogRef.close(resDialog);
  }
  )
}
  onChangeSelect(event?: any): void {
    if (event.value) {
      this.isErrorNetwork = false;
    }
  }
}
