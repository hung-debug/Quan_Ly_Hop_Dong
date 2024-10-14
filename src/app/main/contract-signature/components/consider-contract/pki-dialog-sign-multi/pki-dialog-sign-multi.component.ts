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
  selector: 'app-pki-dialog-sign-multi',
  templateUrl: './pki-dialog-sign-multi.component.html',
  styleUrls: ['./pki-dialog-sign-multi.component.scss']
})
export class PkiDialogSignMultiComponent implements OnInit {
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
    public dialogRef: MatDialogRef<PkiDialogSignMultiComponent>,
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
    } else {
      this.type = 0;
    }
  }

  async onSubmit() {
    if (!this.phoneNum || this.phoneNum.length < 9 || this.phoneNum.length > 11 || !this.patternPhone.test(this.phoneNum)) {
      if (!this.phoneNum) {
        this.isError = true;
        this.isErrorInvalid = false;
        return;
      } else {
        this.isErrorInvalid = true;
        this.isError = false;
        return;
      }
    } else {
      this.isError = false;
      this.isErrorInvalid = false;
    }  

    if (!this.networkCode) {
      this.isErrorNetwork = true;
      return;
    } else {
      this.isErrorNetwork = false;
    }
    
    const firstChar = this.phoneNum.charAt(0);
    let resPhone = this.phoneNum;
    if (firstChar === '0') {
      resPhone = '84' + this.phoneNum.substring(1);
    }
  
    const itemNameNetwork = this.nl.find((nc: any) => nc.id === this.networkCode);
    if (itemNameNetwork) {
      this.networkCompany = itemNameNetwork.id === 'bcy' ? 'bcy' : itemNameNetwork.name;
    }

    try {
      this.spinner.show();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  
      for (const recipientId of this.datas.recipientId) {
        const contract = this.data.chooseContract.find((contract: any) => contract.id === recipientId);

        let response = await this.contractService.getDetermineCoordination(recipientId).toPromise();
        let ArrRecipients = response.recipients.filter((ele: any) => ele.email == this.currentUser.email);
        let ArrRecipientsNew = false;
        ArrRecipients.forEach((item: any) => {
          if (item.sign_type[0].id == 3) {
            ArrRecipientsNew = true;
          }
        });
  
        if (ArrRecipients.length == 0 || !ArrRecipientsNew) {
          this.toastService.showErrorHTMLWithTimeout(
            `Bạn không có quyền xử lý tài liệu ${contract.contractName}!`,
            '',
            3000
          );
          
          if (this.type === 1) {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/main/dashboard']);
          }
  
          this.dialogRef.close();
          this.spinner.hide();
          return;
        }

        const res = await this.contractService.getCheckSignatured(recipientId).toPromise();
        if (res && res.status === 2) {
          this.toastService.showErrorHTMLWithTimeout(`Tài liệu ${contract.contractName} đã được xử lý!`, '', 3000);
          return;
        }
      }
    
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout('error_check_signature', '', 3000);
      }
    }
    
    const resDialog = {
      phone: resPhone,
      networkCode: this.networkCompany,
      phone_tel: this.networkCode,
      hidden_phone: this.hidden_phone,
    };
    this.spinner.hide();
    this.dialogRef.close(resDialog);
  }
  
  onChangeSelect(event?: any): void {
    if (event.value) {
      this.isErrorNetwork = false;
    }
  }
}
