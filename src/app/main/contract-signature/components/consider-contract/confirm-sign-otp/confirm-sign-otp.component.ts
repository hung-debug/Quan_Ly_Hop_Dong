import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Observable, timer} from "rxjs";
import {map, take} from "rxjs/operators";
import {ImageDialogSignComponent} from "../image-dialog-sign/image-dialog-sign.component";
import {PkiDialogSignComponent} from "../pki-dialog-sign/pki-dialog-sign.component";

@Component({
  selector: 'app-confirm-sign-otp',
  templateUrl: './confirm-sign-otp.component.html',
  styleUrls: ['./confirm-sign-otp.component.scss']
})
export class ConfirmSignOtpComponent implements OnInit {myForm: FormGroup;
  datas: any;
  counter$: Observable<number>;
  count = 120;
  isSentOpt = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmSignOtpComponent>,
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

  countTimeOtp() {
    this.isSentOpt = true;
    this.counter$ = timer(0,1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
  }

  submitOtp() {
    this.dialogRef.close(1);
  }
}
