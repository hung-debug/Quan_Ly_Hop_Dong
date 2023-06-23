import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckSignDigitalService } from 'src/app/service/check-sign-digital.service';
import Swal from 'sweetalert2';
import { parttern_input } from "../../../config/parttern";
import { parttern } from '../../../config/parttern';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from 'src/app/service/contract.service';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { UserService } from 'src/app/service/user.service';
import { MultiSelectModule } from 'primeng/multiselect';


@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-add.component.html',
  styleUrls: ['./digital-certificate-add.component.scss'],
})
export class DigitalCertificateAddComponent implements OnInit {
  datas: any;
  addForm: FormGroup;
  fieldTextType: boolean = false;
  submitted = false;
  errorContractFile: any = '';
  uploadFileContractAgain: boolean = false;
  toppingList: any[];
  toppings: any;
  email: any[];
  arrSearchEmailView: any = [];
  emailList: any = [];
  errorEmail: any = '';
  pattern = parttern;
  pattern_input = parttern_input;
  addFormEmail: FormGroup;
  listSelectedEmail: any = [];
  password:any;
  status: number = 1;


  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialogRef: MatDialogRef<DigitalCertificateAddComponent>,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private checkSignDigitalService: CheckSignDigitalService,
    private MatSelectModule: MatSelectModule,
    private MatFormFieldModule: MatFormFieldModule,
    private contractService: ContractService,
    private DigitalCertificateService: DigitalCertificateService,
    private userService: UserService,
    private MultiSelectModule: MultiSelectModule,
  ) {
    this.addForm = this.fbd.group({
      password: this.fbd.control("", [Validators.pattern(parttern.password)]),
      status: 1,
      email: this.fbd.control("", [Validators.required])
    });
    this.addFormEmail = this.fbd.group({
      email: this.fbd.control("", [Validators.required])
    });
  }
  async ngOnInit(): Promise<void> {
    this.datas = this.data;
    console.log("SUUU", this.addForm)
    this.addForm = this.fbd.group({
      password: this.fbd.control("", [Validators.pattern(parttern.password)]),
      status: 1,
      email: this.fbd.control("", [Validators.required])
    });
    this.addFormEmail = this.fbd.group({
      email: this.fbd.control("", [Validators.required])
    });
    // chạy mồi lấy list dữ liệu cho component
    this.getListAllEmail({ filter: 'a' })

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  fileChanged(e: any) {
    this.spinner.show();
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        if (extension && extension.toLowerCase() == 'p12') {
          // this.datas.contractFile = file;
          // this.DigitalCertificateService.getList(file).subscribe((response :any)=>{
            this.spinner.hide();
            const fileInput: any = document.getElementById('file-input');
            fileInput.value = '';
            this.datas.file_name = file_name;
            this.datas.contractFile = file;
            this.contractFileRequired();
          //   // if (this.datas.is_action_contract_created) {
          //   //   this.uploadFileContractAgain = true;
          //   // }
          // })

        }
        else {
          this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu định dạng p12", "", 3000);
          this.spinner.hide();
        }
      } else {
        this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu nhỏ hơn 5MB", "", 3000);
        this.spinner.hide();
      }
    }
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
    console.log('dddđ', this.listSelectedEmail)
    // const control = this.addFormEmail.controls; // Truy cập đối tượng AbstractControl
    // console.log("âgsd",  control);

    // if (control.email.value) {
    //   this.listSelectedEmail.push(control.email.value); // Sao chép giá trị của AbstractControl
    //   console.log('kasjkdasjd',   this.listSelectedEmail)
    // }
    const emailControl = this.addForm.get('email');
    console.log("âgsd", emailControl);

    if (emailControl) {

      const control = emailControl.value

      if (control) {
        this.listSelectedEmail = [...this.listSelectedEmail, ...control];
      }

    }

  }
  getNotificationValid(is_notify: string) {
    this.spinner.hide();
    this.toastService.showWarningHTMLWithTimeout(is_notify, "", 3000);
  }

  validateEmail(testInput: string) {
    this.errorEmail = "";
    if (!this.pattern.email.test(testInput)) {
      this.errorEmail = "error.user.email.format";
      return false;
    } else if (testInput == "") {
      this.errorEmail = "error.email.required";
      return false;
    }
    return true;
  }

  contractFileRequired() {
    this.errorContractFile = "";
    if (!this.datas.contractFile && !this.datas.file_name) {
      this.errorContractFile = "error.contract.file.required";
      return false;
    }
    return true;
  }
  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

  handleCancel() {
    this.dialogRef.close();
  }
  clearError() {
    if (this.datas.contractFile) {
      this.errorContractFile = '';
    }
  }
  // error.password.required
  validData() {
    this.clearError();
    this.contractFileRequired();
    if (!this.contractFileRequired()) {
      // this.spinner.hide();
      return false;
    }
    return true
  }
  save() {
    this.submitted = true;

    if (!this.validData()) {
      console.log("a");
      return;
    }else{

console.log("b");


    this.DigitalCertificateService.addImportCTS(this.datas.contractFile,this.addForm.value.email,this.addForm.value.password,this.addForm.value.status).subscribe(response => {

      console.log("this.datassdddddddddddddd",response);
      if(response.success == false){
        this.toastService.showErrorHTMLWithTimeout(response.message,"", 3000)
      }else{
        this.toastService.showSuccessHTMLWithTimeout('Lưu file chứng thư số thành công',"",3000)
        this.dialog.closeAll();
        window.location.reload();
      }
    })
  }
  }
}
