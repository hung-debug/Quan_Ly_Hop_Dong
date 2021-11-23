import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pki-dialog-sign',
  templateUrl: './pki-dialog-sign.component.html',
  styleUrls: ['./pki-dialog-sign.component.scss']
})
export class PkiDialogSignComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  optionsNetworkCompany: any = [
    {item_id: 1, item_text: 'Mobiphone'},
    {item_id: 2, item_text: 'Vietel'}
  ];
  networkCompany: any = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private el: ElementRef
  ) { }



  ngOnInit(): void {
    this.datas = this.data;
    this.myForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
    });
  }

  onSubmit() {
    let isSub = false;
    const keyObj = [
      {code: "name", name: 'Họ và tên'},
      {code: "email", name: 'Email'},
    ];
    for (const key of Object.keys(this.myForm.controls)) {
      if (this.myForm.controls[key].invalid) {
        const keyError = keyObj.filter((item) => item.code === key)[0];
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        alert(keyError.name + " " + 'không được để trống')
        // Library.notify(keyError.name + " " + 'không được để trống', sEnum.statusApi.error);
        invalidControl.focus();
        isSub = true;
        break;
      }
    }
  }

}
