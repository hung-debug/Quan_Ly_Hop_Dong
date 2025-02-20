import { DatePipe } from '@angular/common';
import {Component, ElementRef, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import {forkJoin, Observable, timer} from "rxjs";

import {take} from "rxjs/operators";
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { parttern } from 'src/app/config/parttern';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { concatMap, delay, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
import { UnitService } from 'src/app/service/unit.service';
import { environment } from 'src/environments/environment';
import { TimeService } from 'src/app/service/time.service';

@Component({
  selector: 'app-dialog-change-phone',
  templateUrl: './dialog-change-phone.component.html',
  styleUrls: ['./dialog-change-phone.component.scss']
})

export class DialogChangePhoneComponent implements OnInit{
  datas: any;
  phoneChange: any;
  errorPhone: any = '';
  phoneValid: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<DialogChangePhoneComponent>,
    private el: ElementRef,
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private deviceService: DeviceDetectorService,
    private unitService: UnitService,
    private timeService: TimeService
  ) { }
  
  ngOnInit(): void {
    this.datas = this.data;
    console.log("data",this.datas);
    
  }
  
  phoneRequired() {
    this.errorPhone = "";
    if (!this.phoneChange) {
      this.errorPhone = "error.phone.required";
      this.phoneValid = false;
      return false;
    }

    if(!parttern.phone.test(this.phoneChange)) {
      this.errorPhone = "error.user.phone.format";
      this.phoneValid = false;
      return false;
    }
    
    this.phoneValid = true;
    return true;
  }
  
  onSubmit(){
    console.log("this.phoneChange",this.phoneChange);
    this.dialogRef.close({phoneChange: this.phoneChange})
    
  }
}