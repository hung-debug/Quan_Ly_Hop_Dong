import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from 'src/app/service/user.service';
import { parttern_input, parttern } from 'src/app/config/parttern';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { ConsiderContractComponent } from "src/app/main/contract-signature/components/consider-contract/consider-contract.component";


@Component({
  selector: 'app-cert-dialog-sign',
  templateUrl: './cert-dialog-sign.component.html',
  styleUrls: ['./cert-dialog-sign.component.scss']
})

export class CertDialogSignComponent implements OnInit {
  datas: any;
  myForm: FormGroup;
  lang: any;
  cols: any[];
  list: any[];
  id: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private userService: UserService,
    private contractService: ContractService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<CertDialogSignComponent>,
    private spinner: NgxSpinnerService,
    private DigitalCertificateService: DigitalCertificateService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }
    this.cols = [
      { header: 'choice', style: 'text-align: left;' },
      { header: 'notation', style: 'text-align: left;' },
      { header: 'end-date', style: 'text-align: left;' },
    ]
    this.datas = this.data;
    this.getDataSignCert();
  }

  getDataSignCert(){

    this.spinner.show();
    this.DigitalCertificateService.dataSignCert().subscribe(response =>{

      this.spinner.hide();
      this.list = response.certificates;
      this.id = response.certificates.id;
      // console.log("iddđ",this.id);

    })
    // console.log("iddđ",this.id);
  }


  handleCancel() {
    this.dialogRef.close(this.id);
  }

  signCert(){
    // console.log("id",this.list[0].id);
    // const dataSignCert = {
    //   // ma_dvcs: this.myForm.value.taxCode,
    //   // username: this.myForm.value.username,
    //   // password: this.myForm.value.pass1,
    //   // password2: this.myForm.value.pass2
    //   id: this.id,
    // };
    if (!this.id) {
      this.toastService.showErrorHTMLWithTimeout(
        'Cần chọn chứng thư số trước khi ký',
        '',
        3000
      )
    } else {
      this.dialogRef.close(this.id);
    }
  }
}
