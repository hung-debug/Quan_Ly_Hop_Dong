import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalCertificateAddComponent } from './digital-certificate-add/digital-certificate-add.component';
import { DigitalCertificateDetailComponent } from './digital-certificate-detail/digital-certificate-detail.component';
import { DigitalCertificateEditComponent } from './digital-certificate-edit/digital-certificate-edit.component';
@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate.component.html',
  styleUrls: ['./digital-certificate.component.scss']
})
export class DigitalCertificateComponent implements OnInit {

  constructor(
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialog: MatDialog,
  ) { }
  username: any = "";
  lang: any;
  first: number = 0;
  list: any[];
  cols: any[];
  isQLDC_01: boolean = true; //them moi chung thu so
  isQLDC_02: boolean = true; //sua thong tin chung thu so
  isQLDC_03: boolean = true; //tim kiem thong tin
  isQLDC_04: boolean = true; //xem thong tin chung thu so
  async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.appService.setTitle("certificate.list");
    this.cols = [
      { header: 'notation', style: 'text-align: left;' },
      { header: 'email.used', style: 'text-align: left;' },
      { header: 'start-date', style: 'text-align: left;' },
      { header: 'end-date', style: 'text-align: left;' },
      { header: 'unit.status', style: 'text-align: left;' },
      { header: 'unit.manage', style: 'text-align: center;' },
    ];
    this.list = [
      { notation: 'abc' },
    ]
  }
  searchUser() {
    // this.first = 0;

    // this.spinner.show();
    // this.userService.getUserList(!this.organization_id? this.organization_id_user_login :this.organization_id, this.email).subscribe(response => {
    //   this.spinner.hide();
    //   this.list = response.entities;
    // });
  }
  addUnit() {
    const data = {
      title: 'add.certificate'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DigitalCertificateAddComponent, {
      width: '550px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }
  editUser(id: any) {
    const data = {
      title: 'update.infor.certificate'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DigitalCertificateEditComponent, {
      width: '550px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  detailUser(id: any) {
    const data = {
      title: 'infor.certificate'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DigitalCertificateDetailComponent, {
      width: '550px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}
