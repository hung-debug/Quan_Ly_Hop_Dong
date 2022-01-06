import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

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
  networkCompany: any = 0;
  phoneNum: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialogRef: MatDialogRef<PkiDialogSignComponent>
  ) { }



  ngOnInit(): void {
    this.datas = this.data;
  }

  onSubmit() {
    const resDialog = {
      phone: this.phoneNum,
      networkCode: this.networkCompany
    };
    console.log(resDialog);
    this.dialogRef.close(resDialog);
  }

}
