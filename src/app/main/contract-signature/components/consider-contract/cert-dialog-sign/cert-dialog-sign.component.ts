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
import { DeviceDetectorService } from "ngx-device-detector";
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { ConsiderContractComponent } from "src/app/main/contract-signature/components/consider-contract/consider-contract.component";
import { log } from 'console';


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
  colsMobile: any[];
  list: any[];
  selectedCert: any;
  dataCardId: any;
  currentUser: any;
  loginType: any;

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
    private deviceService: DeviceDetectorService,
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;

    this.loginType = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.type;
  }

  async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }
    this.cols = [
      { header: 'choice', style: 'text-align: left; width: 75px;' },
      { header: 'notation', style: 'text-align: left;' },
      { header: 'subject', style: 'text-align: left;' },
      { header: 'MST/CCCD', style: 'text-align: left;' },
      { header: 'end-date', style: 'text-align: left;' },
    ]
    this.colsMobile = [
      { header: 'choice', style: 'text-align: left;' },
      { header: 'information', style: 'text-align: left;' },
    ]
    this.datas = this.data;
    this.getDataSignCert();
    this.getDeviceApp();
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  getDataSignCert() {

    this.spinner.show();
    this.DigitalCertificateService.dataSignCert().subscribe(response => {
      this.spinner.hide();
      this.list = response.certificates;
    }, (err) => {
      this.spinner.hide()
      return this.toastService.showErrorHTMLWithTimeout("get.cert.data.err","",3000)
    })
  }
  getValueByKey(inputString: string, key: string) {
    const elements = inputString.split(', ');
    for (const element of elements) {
      const [currentKey, value] = element.split('=');
      if (currentKey === key) {
        return value;
      }
    }
    return null; // Return null if the key is not found
  }

  getValue(inputString: string, key: string) {
    const elements = inputString.split(', ');
    for (const element of elements) {
      const [currentKey, value] = element.split('=');
      if (currentKey === key) {
        // Tách giá trị sau dấu ":"
        const colonIndex = value.indexOf(':');
        if (colonIndex !== -1) {
          return value.slice(colonIndex + 1);
        }
      }
    }
    return null; // Return null if the key is not found
  }

  handleCancel() {
    this.dialogRef.close();
  }

  signCert() {
    
    if (this.selectedCert == "undefined" || this.selectedCert == null) {
      this.toastService.showErrorHTMLWithTimeout(
        'Cần chọn chứng thư số trước khi ký',
        '',
        3000
      )
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    const uidCert = this.getValueByKey(this.selectedCert.certInformation, "UID")
    this.dataCardId = uidCert?.split(":")[1];

    if (!this.data.id) {
      //trường hợp ký đơn
      for (const signUpdate of this.data.isDataObjectSignature) {
        if (signUpdate?.recipient?.email === this.currentUser.email &&
          this.dataCardId === signUpdate?.recipient?.cardId && signUpdate?.recipient?.status === 1) {
          this.dialogRef.close(this.selectedCert);
          return;
        }
        else {
          if (signUpdate == this.data.isDataObjectSignature[this.data.isDataObjectSignature.length - 1]) {
            this.toastService.showErrorHTMLWithTimeout(
              'Mã số thuế/CMT/CCCD không trùng khớp thông tin ký tài liệu',
              '',
              3000
            );
            return;
          }
        }
      }
    } else if (this.data.id == 1) {
      //trường hợp ký nhiều
      for (const signUpdate of this.data.isDataObjectSignature) {
        if (signUpdate?.email === this.currentUser.email &&
          this.dataCardId === signUpdate?.cardId && signUpdate?.status === 1) {
          this.dialogRef.close(this.selectedCert);
          return;
        }
        else {
          if (signUpdate == this.data.isDataObjectSignature[this.data.isDataObjectSignature.length - 1]) {
            this.toastService.showErrorHTMLWithTimeout(
              'Mã số thuế/CMT/CCCD không trùng khớp thông tin ký tài liệu',
              '',
              3000
            );
            return;
          }
        }
      }
    }
  }
}
