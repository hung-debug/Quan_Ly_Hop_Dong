import { error } from 'console';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {parttern, parttern_input} from "src/app/config/parttern";
@Component({
  selector: 'app-user',
  templateUrl: './config-check-brandname-dialog.component.html',
  styleUrls: ['./config-check-brandname-dialog.component.scss']
})


export class ConfigBrandnameDialogComponent implements OnInit {
  currentOrgId: string = "";
  datas: any;
  submitted = false;
  checkBrandnameForm: FormGroup;
  pattern = parttern;
  isDisable: boolean = true;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ConfigBrandnameDialogComponent>,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.checkBrandnameForm = this.fbd.group({
      phone: this.fbd.control("", [Validators.required, Validators.pattern(parttern.phone)]),
      message: this.fbd.control(this.translate.instant('content.sms.brandname'), [Validators.required]),
    })
  }

  async ngOnInit(): Promise<void> {
    this.checkBrandnameForm?.get('message')?.disable();
  }

  onCheck() {
    this.dialogRef.close(this.checkBrandnameForm.value)
  }
  
  validPhoneNumber(){
    if(!this.f.phone?.errors?.pattern){
      this.isDisable = false;
    }else{
      this.isDisable = true;
    }
  }

  get f() { return this.checkBrandnameForm.controls; }

}