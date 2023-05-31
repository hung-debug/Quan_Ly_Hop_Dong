import { HttpErrorResponse } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { networkList } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import {ToastService} from "../../../../../service/toast.service";
import { NgxSpinnerService } from "ngx-spinner";

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
    console.log("data",this.datas);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe(async (response) => {
      console.log("response", response);
      const ArrRecipients = response.recipients.filter((ele: any) => ele.id);
      console.log("ArrRecipients", ArrRecipients);

      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.email === this.currentUser.email) {
          ArrRecipientsNew = true
          return
        }
      });
      console.log("ArrRecipientsNew111", ArrRecipientsNew);

      if (!ArrRecipientsNew) {
        console.log("ArrRecipientsNew111", ArrRecipientsNew);
        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!',
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
      console.log("this.currentUser.email", this.currentUser);

    this.contractService.getCheckSignatured(this.data.recipientId).subscribe((res: any) => {
      if (res && res.status == 2) {
        this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
        return;
      } 
    }, (error: HttpErrorResponse) => {
      this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
    })

    console.log("pki open ");
    const pattern = /^[0-9]*$/;

    if (!this.phoneNum || (this.phoneNum && this.phoneNum.length < 9 || this.phoneNum.length > 11) || (this.phoneNum && !pattern.test(this.phoneNum))) {
      if(!this.phoneNum) {
        this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập số điện thoại', '', 3000);
        return;
      } else {
        this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập đúng định dạng số điện thoại', '', 3000);
        return;
      }
    }

    if(!this.networkCode) {
      console.log("netwwork code ", this.networkCode);
      this.toastService.showErrorHTMLWithTimeout('Vui lòng chọn nhà mạng', '', 3000);
      return;
    }

    const firstChar = this.phoneNum.charAt(0);
    let resPhone = this.phoneNum;
    if(this.phoneNum && firstChar && firstChar == '0') {
      resPhone = '84' + this.phoneNum.substring(1);
    }
    const itemNameNetwork = this.nl.find((nc: any) => nc.id == this.networkCode);
    if (itemNameNetwork) {
      console.log("itemNameNetwork ", itemNameNetwork);


      this.networkCompany = itemNameNetwork.id == 'bcy' ? 'bcy' : itemNameNetwork.name;
    }

    const resDialog = {
      phone: resPhone,
      networkCode: this.networkCompany,
      phone_tel: this.networkCode,
    };

    console.log("res dialog ",resDialog);

    this.dialogRef.close(resDialog);
  }
  )
}
}