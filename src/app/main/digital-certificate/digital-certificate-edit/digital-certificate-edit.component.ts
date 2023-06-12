import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-edit.component.html',
  styleUrls: ['./digital-certificate-edit.component.scss']
})

export class DigitalCertificateEditComponent implements OnInit {
  datas: any;
  addForm: FormGroup;
  emailUser: any;
  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialogRef: MatDialogRef<DigitalCertificateEditComponent>,
    public dialog: MatDialog,
    private fbd: FormBuilder,
  ) {
    this.addForm = this.fbd.group({
      // nameOrg: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.contract_name_valid)]),
      // short_name: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
      // code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
      // email: this.fbd.control("", [Validators.email]),
      // phone: this.fbd.control("", [Validators.pattern("[0-9 ]{10}")]),
      // fax: this.fbd.control("",[Validators.pattern(parttern_input.input_form)]),
      // status: 1,
      // parent_id: this.fbd.control("", [Validators.required]),
      // taxCode: this.fbd.control("",Validators.pattern(parttern_input.taxCode_form)),
      idOrg: this.fbd.control(""),
    });
  }
  async ngOnInit(): Promise<void> {
    this.datas = this.data;
  }
  handleCancel() {
    this.dialogRef.close();
  }
  save(){

  }
  changeTypeSign() {

  }
}
