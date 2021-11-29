import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-choose-type-sign',
  templateUrl: './choose-type-sign.component.html',
  styleUrls: ['./choose-type-sign.component.scss']
})
export class ChooseTypeSignComponent implements OnInit {
  myForm: FormGroup;
  datas: any
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
