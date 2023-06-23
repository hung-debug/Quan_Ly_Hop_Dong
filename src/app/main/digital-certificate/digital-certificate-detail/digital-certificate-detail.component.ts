import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';

@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-detail.component.html',
  styleUrls: ['./digital-certificate-detail.component.scss']
})

export class DigitalCertificateDetailComponent implements OnInit {
  datas: any;
  addForm: FormGroup;
  emailUser: any[];
  email: any = "";
  listEmail: any[];
  status: any = "";
  keystoreSerialNumber: any = "";
  keyStoreFileName: any = "";
  keystoreDateStart: any = "";
  keystoreDateEnd: any = "";
  subject: any = "";
  sub: any[];
  unit: any = "";

  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialogRef: MatDialogRef<DigitalCertificateDetailComponent>,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private DigitalCertificateService: DigitalCertificateService,
  ) {
    this.addForm = this.fbd.group({
      // nameOrg: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.contract_name_valid)]),
      // short_name: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
      // code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
      // email: this.fbd.control("", [Validators.email]),
      // phone: this.fbd.control("", [Validators.pattern("[0-9 ]{10}")]),
      // fax: this.fbd.control("",[Validators.pattern(parttern_input.input_form)]),
      status: 1,
      // parent_id: this.fbd.control("", [Validators.required]),
      // taxCode: this.fbd.control("",Validators.pattern(parttern_input.taxCode_form)),
      idOrg: this.fbd.control(""),
    });
  }
  async ngOnInit(): Promise<void> {
    this.datas = this.data;
    this.getData();
    console.log("dataCert", this.datas);
    this.addForm = this.fbd.group({
      status: 1,
    });
    console.log("addForm", this.addForm);
  }

  async getData() {
    await this.DigitalCertificateService.getCertById(this.datas.id).toPromise().then(
      data => {
        console.log("data", data);
        this.emailUser = data.customers
        const listEmail = this.emailUser.map(item => item.email)
        console.log("listEmail", listEmail.join(", "));
        this.email = listEmail.join(", ")
        this.keystoreSerialNumber = data.keystoreSerialNumber,
        this.keyStoreFileName = data.keyStoreFileName,
        this.keystoreDateStart = data.keystoreDateStart,
        this.keystoreDateEnd = data.keystoreDateEnd,
        this.status = data.status,
        this.sub = data.certInformation.split(",")
        const subjectt = this.sub.find(item => item.includes('CN='))
        this.subject = subjectt.split("=")[1]
        const unitt = this.sub.find(item => item.includes('O='))
        this.unit = unitt.split("=")[1]
      }
    )

  }
  handleCancel() {
    this.dialogRef.close();
  }
  save() {

  }
}
