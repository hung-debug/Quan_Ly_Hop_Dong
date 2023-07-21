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
import { UnitService } from 'src/app/service/unit.service';
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
  errorOrg: any = '';
  orgList: Array<any> = [];
  orgIdSelected: any;
  code:string = "";
  orgID: any;

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
    private unitService: UnitService,
  ) {
    this.addForm = this.fbd.group({
      password: this.fbd.control("", [Validators.pattern(parttern.password)]),
      status: 1,
      email: this.fbd.control("", [Validators.required]),
      orgId: this.fbd.control("", [Validators.required])
    });
  }
  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.datas = this.data;

    // await this.getData();
    await this.getListAllEmail();
    console.log("dataCert", this.datas);
    this.getOrg({ filter: '' })

  }

  async getData() {
    await this.DigitalCertificateService.getCertById(this.datas.id).toPromise().then(
      data => {
        console.log('dtaaaa',data);
        this.listEmailOptions.push(...data.customers);
        console.log("listEmailOptions",this.listEmailOptions);

        const listCustomer = data.customers.map((item: any) => item.email);
        console.log('dât001',data.orgAdminCreate);
        console.log('002',this.orgList);
        this.addForm = this.fbd.group({
          password: this.fbd.control("", [Validators.pattern(parttern.password)]),
          status: this.fbd.control(data.status),
          email: this.fbd.control(listCustomer, [Validators.required]),
          orgId: this.fbd.control(data.orgAdminCreate.toString(), [Validators.required])
        });
        console.log("addfomer",this.addForm);

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
        this.orgID = data.orgAdminCreate.toString()
        // this.addForm.patchValue({ orgId: this.orgID });
      }
    )

  }

  getOrg(event: any){
    let name: string = event.filter
    this.orgIdSelected = this.addForm.value.orgId || ''
    this.unitService.getUnitList(this.code, name).subscribe(response => {
      this.orgList = response.entities.map((item: any) => ({
        id: item.id.toString(), name: item.name
      }))
      console.log("ỏg",this.orgList);
      this.getData()
    })
  }


  handleCancel() {
    this.dialogRef.close();
  }
  async getListAllEmail(event?: any) {
    this.listEmailOptions = []
    this.addForm.patchValue({ email: [''] });
    console.log('evennnt',event);
    let email: any = null
    if (!event) {
      email = ""
    } else {
      email = event.filter;
    }

    await this.DigitalCertificateService.getListOrgByEmail(email || '',event?.value || '').toPromise().then((response) => {
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
    let selectedValues = []
    selectedValues = this.addForm.get('email')?.value;
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

  // getListAllEmail(event: any) {
  //   this.emailList = []
  //   console.log("responseSU", event.filter);
  //   let email: any = event.filter || ''
  //   // let emailLogin = this.userService.getAuthCurrentUser().email;
  //   console.log("event",event);

  //   this.DigitalCertificateService.getListOrgByEmail(email,event.value || '').subscribe((response) => {
  //     if (response && response.length > 0) {
  //       response.forEach((item: any) => {
  //         const id = item.id;
  //         if (!this.emailList.some((existingItem: any) => existingItem.id === id)) {
  //           this.emailList.push(item);
  //         }
  //       });
  //     }
  //   });
  // }

    getListAllEmailOnFillter(event: any) {
    // this.emailList = []
    console.log("responseSU", event.filter);
    let email: any = event.filter || ''
    // let emailLogin = this.userService.getAuthCurrentUser().email;
    console.log("event",event);

    this.DigitalCertificateService.getListOrgByEmail(email,this.addForm.value.orgId || '').subscribe((response) => {
      if (response && response.length > 0) {
        response.forEach((item: any) => {
          const id = item.id;
          if (!this.listEmailOptions.some((existingItem: any) => existingItem.id === id)) {
            this.listEmailOptions.push(item);
          }
        });
      }
    });
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
  validateOrg() {
    this.errorOrg = "";
    if (!this.addForm.controls.orgId.valid) {
      this.errorOrg = "error.org.required";
      return false;
    }
    return true;
  }

  validData() {
    this.clearError();
    let validateResult = {
      email: this.validateEmail(),
      orgId:this.validateOrg()
    }
    if (!validateResult.email|| !validateResult.orgId) {
      return false;
    }
    return true
  }
}
