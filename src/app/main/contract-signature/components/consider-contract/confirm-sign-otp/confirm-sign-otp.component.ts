import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Observable, timer} from "rxjs";
import {map, take} from "rxjs/operators";
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import {ImageDialogSignComponent} from "../image-dialog-sign/image-dialog-sign.component";
import {PkiDialogSignComponent} from "../pki-dialog-sign/pki-dialog-sign.component";

@Component({
  selector: 'app-confirm-sign-otp',
  templateUrl: './confirm-sign-otp.component.html',
  styleUrls: ['./confirm-sign-otp.component.scss']
})
export class ConfirmSignOtpComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  c:any;
  counter$: any;
  count = 120;
  isSentOpt = false;
  submitted = false;
  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmSignOtpComponent>,
    private el: ElementRef,
    private contractService: ContractService,
    private toastService: ToastService
  ) { }



  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      otp: this.fbd.control("", [Validators.required]),
    });
    this.sendOtp(this.datas.recipient_id, this.datas.phone);
    this.countTimeOtp();
  }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.dialogRef.close(this.addForm.value.otp);
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

  sendOtp(recipient_id:any, phone:any){
    this.contractService.sendOtpContractProcess(recipient_id, phone).subscribe(
      data => {
        if(!data.success){
          this.toastService.showErrorHTMLWithTimeout('Lỗi gửi OTP', "", 3000);
        }
      
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi', "", 3000);
      }
    )
  }
}
