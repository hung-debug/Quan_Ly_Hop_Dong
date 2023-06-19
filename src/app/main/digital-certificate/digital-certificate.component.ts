import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalCertificateAddComponent } from './digital-certificate-add/digital-certificate-add.component';
import { DigitalCertificateDetailComponent } from './digital-certificate-detail/digital-certificate-detail.component';
import { DigitalCertificateEditComponent } from './digital-certificate-edit/digital-certificate-edit.component';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import {TranslateService} from '@ngx-translate/core';
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
    public translate: TranslateService,
    private DigitalCertificateService: DigitalCertificateService,
  ) { }

  listStatus = [
    { label: 'Hoạt động', value: 1 },
    { label: 'Không hoạt động', value: 0 },
  ];
  username: any = "";
  file_name: any;
  status: any;
  size: number = 10;
  keystoreDateStart: any ='';
  keystoreDateEnd: any ='';
  number: number = 1;
  page: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  lang: any;
  first: number = 0;
  list: any[];
  cols: any[];
  FileName: any;
  // listStatus: any[];
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
      { header: 'start-date', style: 'text-align: left;' },
      { header: 'end-date', style: 'text-align: left;' },
      { header: 'unit.status', style: 'text-align: left;' },
      { header: 'unit.manage', style: 'text-align: center;' },
    ];

    this.getData();
    this.searchUser();
    // console.log("thias dastas",this.dataa);

  }
  array_empty: any = [];
  searchUser() {
    this.first = 0;

    this.spinner.show();
    this.DigitalCertificateService.getAllCertificate(this.file_name, this.status, this.keystoreDateStart, this.keystoreDateEnd, this.number, this.size).subscribe(response =>{
      console.log("res",response);
      this.list = response.content;
    })
    this.spinner.hide();
    console.log("dataacert",this.list);

    this.DigitalCertificateService.searchCertificate(this.FileName, this.listStatus, this.keystoreDateStart, this.keystoreDateEnd, this.number, this.size).subscribe(response =>{
      console.log("resssss",response);
      this.list = response.content;
      console.log("status",this.status);

    })
  }

  getData(){
    this.DigitalCertificateService.getAllCertificate(this.file_name, this.status, this.keystoreDateStart, this.keystoreDateEnd, this.number, this.size).subscribe(response =>{
      console.log("res",response);
      this.list = response.content;

      let dataCert: any ="";
      this.array_empty=[];
      this.list.forEach((element: any, index: number) => {
        dataCert = {
          dataCert:
          {
            id: element.id,
            status: element.status,
            keyStoreFileName: element.keyStoreFileName,
            keystoreDateStart: element.keystoreDateStart,
            keystoreDateEnd: element.keystoreDateEnd,
            keystoreSerialNumber: element.keystoreSerialNumber,
            certInformation: element.certInformation
          },
          expanded: true,
        };
        this.array_empty.push(dataCert);
      })
      this.list = this.array_empty;
      console.log("cert",dataCert);

    })
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
      title: 'update.infor.certificate',
      dataCert: this.list.filter((x: any) => x.id == id),
    };
    this.getData()
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
      title: 'infor.certificate',
      dataCert: this.list.filter((x: any) => x.id == id),
    };
    this.getData()
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
