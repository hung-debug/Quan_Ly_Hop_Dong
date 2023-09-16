import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-user',
  templateUrl: './content-sms.component.html',
  styleUrls: ['./content-sms.component.scss']
})

export class ContentSmsComponent implements OnInit {
  currentOrgId: string = "";
  datas: any;
  addForm: FormGroup;
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialogRef: MatDialogRef<ContentSmsComponent>,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private unitService: UnitService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.currentOrgId = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId.toString()
    this.datas = this.data;
  }

}
