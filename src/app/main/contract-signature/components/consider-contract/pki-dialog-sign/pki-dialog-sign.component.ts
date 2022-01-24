import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { networkList } from 'src/app/config/variable';
import {ToastService} from "../../../../../service/toast.service";

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialogRef: MatDialogRef<PkiDialogSignComponent>,
    private toastService : ToastService
  ) {
  }

  ngOnInit(): void {
    this.nl = networkList;
    this.datas = this.data;
    this.phoneNum = this.datas?.sign?.phone;
    this.networkCode = this.datas?.sign?.phone_tel;
  }

  onSubmit() {
    const pattern = /^[0-9]*$/;

    if (!this.phoneNum || (this.phoneNum && this.phoneNum.length < 9 || this.phoneNum.length > 11) || (this.phoneNum && !pattern.test(this.phoneNum))) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập đúng định dạng số điện thoại', '', 3000);
      return;
    }
    const firstChar = this.phoneNum.charAt(0);
    let resPhone = this.phoneNum;
    if(this.phoneNum && firstChar && firstChar == '0') {
      resPhone = '84' + this.phoneNum.substring(1);
    }
    const itemNameNetwork = this.nl.find((nc: any) => nc.id == this.networkCode);
    if (itemNameNetwork) {
      this.networkCompany = itemNameNetwork.name ? itemNameNetwork.name.toLowerCase() : null;
    }
    const resDialog = {
      phone: resPhone,
      networkCode: this.networkCompany,
      phone_tel: this.networkCode,
    };
    this.dialogRef.close(resDialog);
  }

}
