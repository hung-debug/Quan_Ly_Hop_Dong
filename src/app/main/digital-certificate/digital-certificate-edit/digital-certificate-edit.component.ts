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
import { log } from 'console';
@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-edit.component.html',
  styleUrls: ['./digital-certificate-edit.component.scss']
})

export class DigitalCertificateEditComponent implements OnInit {
  datas: any;
  addForm: FormGroup;
  emailUser: any[];
  email: any = [];
  status: any = "";
  keystoreSerialNumber: any = "";
  keyStoreFileName: any = "";
  keystoreDateStart: any = "";
  keystoreDateEnd: any = "";
  subject: any = "";
  sub: any[];
  unit: any = "";
  pattern = parttern;
  listEmailOptions: any = [];
  submitted = false;
  listSelectedEmail: any = [];
  listID: any[];
  errorEmail: any = '';

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
    this.spinner.show();
    this.datas = this.data;

    await this.getData();
    await this.getListAllEmail();
    console.log("dataCert", this.datas);

  }

  async getData() {
    await this.DigitalCertificateService.getCertById(this.datas.id).toPromise().then(
      data => {
        this.listEmailOptions.push(...data.customers);
        const listCustomer = data.customers.map((item: any) => item.email);
        this.addForm = this.fbd.group({
          password: this.fbd.control("", [Validators.pattern(parttern.password)]),
          status: this.fbd.control(data.status),
          email: this.fbd.control(listCustomer, [Validators.required])
        });
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
        this.listID = data.customers
      }
    )

  }

  handleCancel() {
    this.dialogRef.close();
  }
  async getListAllEmail(event?: any) {

    let email: any = null
    if (!event) {
      email = ""
    } else {
      email = event.filter;
    }

    await this.DigitalCertificateService.getListAllEmail(email).toPromise().then((response) => {
      if (response && response.length > 0) {
        response.forEach((item: any) => {
          if (!this.listEmailOptions.some((existingItem: any) => existingItem.email === item.email)) {
            this.listEmailOptions.push(item);
          }
        });
      }

    });

    this.spinner.hide();
  }

  onSelectionChange() {
    // const emailControl = this.addForm.get('email');
    // console.log("âgsd", emailControl);
    // if (emailControl) {
    //   const control = emailControl.value
    //   if (control) {
    //     this.listSelectedEmail = [...this.listSelectedEmail, ...control];
    //   }
    //   console.log("listSelectedEmail", this.listSelectedEmail);
    //   this.listEmailOptions.push(this.listSelectedEmail)
    // }

    const selectedValues = this.addForm.get('email')?.value;
    selectedValues.forEach((value: any) => {
      const option = this.listEmailOptions.find((opt: any) => opt.email === value);
      if (option) {
        value = option.email;
      }
    });
    this.addForm.patchValue({ email: selectedValues });
  }
  save() {
    this.submitted = true;
    if(!this.validData()){
      return;
    }
    let id_customer = this.listID.filter((value, index, self) => {
      // Kiểm tra xem có index đầu tiên của value.id trong mảng không
      return self.findIndex(obj => obj.id === value.id) === index;
    }).map(item => item.id);

    let checkDelete = false;

    // moi lan save thi can xoa toan bo list customer trc r add email moi vao
    this.DigitalCertificateService.deleteUserCTS(this.datas.id, id_customer)
      .subscribe((deleteUser: any) => {
        if (deleteUser.success == false) {
          this.toastService.showErrorHTMLWithTimeout(deleteUser.message, "", 3000)
        } else {
          checkDelete = true;
          this.DigitalCertificateService.updateCTS(this.data.id, this.addForm.value.status, this.addForm.value.email).subscribe(response => {
            if (response.success == false) {
              this.toastService.showErrorHTMLWithTimeout(response.message, "", 3000)
            }
            if (checkDelete = true) {
              this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin chứng thư số thành công', "", 3000)
              this.dialog.closeAll();
              window.location.reload();
            }
          })
        }
      })
  }

  validateEmail() {
    this.errorEmail = "";
    if (!this.addForm.controls.email.valid) {
      this.errorEmail = "error.email.required";
      return false;
    }
    return true;
  }

  clearError() {
    // if (this.datas.contractFile) {
    //   this.errorContractFile = '';
    // }
  }

  validData() {
    this.clearError();
    let validateResult = {
      email: this.validateEmail(),
    }
    if (!validateResult.email) {
      return false;
    }
    return true
  }
}
