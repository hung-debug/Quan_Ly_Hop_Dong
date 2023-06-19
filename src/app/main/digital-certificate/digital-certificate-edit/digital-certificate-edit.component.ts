import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { parttern_input } from "../../../config/parttern";
import { parttern } from '../../../config/parttern';
@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-edit.component.html',
  styleUrls: ['./digital-certificate-edit.component.scss']
})

export class DigitalCertificateEditComponent implements OnInit {
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
  pattern = parttern;
  emailList: any = [];
  submitted = false;
  listSelectedEmail: any = [];
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
    private DigitalCertificateService: DigitalCertificateService,
  ) {
    this.addForm = this.fbd.group({
      password: this.fbd.control("", [Validators.pattern(parttern.password)]),
      status: 1,
      email: this.fbd.control("", [Validators.required])
    });
  }
  async ngOnInit(): Promise<void> {
    this.datas = this.data;
    this.getData();
    console.log("dataCert", this.datas);
  }

  async getData() {
    this.emailUser = this.datas.dataCert[0].customers
    const listEmail = this.emailUser.map(item => item.email)
    console.log("listEmail", listEmail.join(", "));

    this.addForm.patchValue({
      email: listEmail.map(email => ({ email }))
    });
    this.keystoreSerialNumber = this.datas.dataCert[0].keystoreSerialNumber,
      this.keyStoreFileName = this.datas.dataCert[0].keyStoreFileName,
      this.keystoreDateStart = this.datas.dataCert[0].keystoreDateStart,
      this.keystoreDateEnd = this.datas.dataCert[0].keystoreDateEnd,
      this.status = this.data.dataCert[0].status,
      this.sub = this.datas.dataCert[0].certInformation.split(",")
    const subjectt = this.sub.find(item => item.includes('CN='))
    this.subject = subjectt.split("=")[1]
    const unitt = this.sub.find(item => item.includes('O='))
    this.unit = unitt.split("=")[1]
  }

  handleCancel() {
    this.dialogRef.close();
  }
  getListAllEmail(event: any) {
    console.log("responseSU", event.filter);
    let email: any = event.filter
    // let emailLogin = this.userService.getAuthCurrentUser().email;

    this.DigitalCertificateService.getListAllEmail(email).subscribe((response) => {
      if (response && response.length > 0) {
        response.forEach((item: any) => {
          const id = item.id;
          if (!this.emailList.some((existingItem: any) => existingItem.id === id)) {
            this.emailList.push(item);
          }
        });
      }


    });

  }

  onSelectionChange() {
    const emailControl = this.addForm.get('email');
    console.log("âgsd", emailControl);
    if (emailControl) {
      const control = emailControl.value
      if (control) {
        this.listSelectedEmail = [...this.listSelectedEmail, ...control];
      }
    }
  }
  save() {
    this.submitted = true;
    console.log("lít meo", this.addForm);

    this.DigitalCertificateService.updateCTS( this.addForm.value.status).subscribe(response => {

      console.log("this.datassdddddddddddddd", response);
      if (response.success == false) {
        this.toastService.showErrorHTMLWithTimeout(response.message, "", 3000)
      } else {
        this.toastService.showSuccessHTMLWithTimeout('Lưu file chứng thư số thành công', "", 3000)
        this.dialog.closeAll();
      }
    })
  }
  changeTypeSign() {

  }
}
