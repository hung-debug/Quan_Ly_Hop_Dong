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
  dataSendLog: any;
  checkBrandnameForm: FormGroup;
  get f() { return this.checkBrandnameForm.controls; }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfigBrandnameDialogComponent>,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    // this.currentOrgId = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId.toString()
  }

}