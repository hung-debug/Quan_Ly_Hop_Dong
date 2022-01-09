import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { networkList } from 'src/app/data/data';

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
    public dialogRef: MatDialogRef<PkiDialogSignComponent>
  ) {
  }

  ngOnInit(): void {
    this.nl = networkList;
    this.datas = this.data;
    this.phoneNum = this.datas?.sign?.phone;
    this.networkCode = this.datas?.sign?.phone_tel;
  }

  onSubmit() {
    const itemNameNetwork = this.nl.find((nc: any) => nc.id == this.networkCode);
    if (itemNameNetwork) {
      this.networkCompany = itemNameNetwork.name ? itemNameNetwork.name.toLowerCase() : null;
    }
    const resDialog = {
      phone: this.phoneNum,
      networkCode: this.networkCompany,
      phone_tel: this.networkCode,
    };
    this.dialogRef.close(resDialog);
  }

}
