import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ConfigBrandnameDialogComponent>,
    public dialog: MatDialog,
  ) {
    this.checkBrandnameForm = this.fbd.group({
      phone: this.fbd.control("", [Validators.required]),
      message: this.fbd.control("", [Validators.required]),
    })
  }

  async ngOnInit(): Promise<void> {
    // this.currentOrgId = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId.toString()
  }

  onCheck() {
    this.dialogRef.close(this.checkBrandnameForm.value)
  }

  get f() { return this.checkBrandnameForm.controls; }

}