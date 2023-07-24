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
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
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
    { label: 'Tất cả', value: '', default: true },
    { label: 'Hoạt động', value: 1 },
    { label: 'Không hoạt động', value: 0 },
  ];
  username: any = "";
  file_name: any;
  status: any;
  size: number = 5;
  keystoreDateStart: any = '';
  keystoreDateEnd: any = '';
  number: number = 0;
  page: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  lang: any;
  first: number = 0;
  totalRecords: number = 0;
  list: any[];
  cols: any[];
  dataSearch: any[];
  fileName: any;
  serial_number: any;
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
      { header: 'file.name', style: 'text-align: left;' },
      { header: 'start-date', style: 'text-align: left;' },
      { header: 'end-date', style: 'text-align: left;' },
      { header: 'unit.status', style: 'text-align: left;' },
      { header: 'unit.manage', style: 'text-align: center;' },
    ];
    this.status = { label: 'Tất cả', value: '', default: true };
    this.getFirstPageSearchData();
    // this.getData();

  }
  array_empty: any = [];
  getFirstPageSearchData() {
    this.first = 0;

    this.spinner.show();
    this.DigitalCertificateService.searchCertificate(this.fileName, this.serial_number, this.status.value, this.keystoreDateStart, this.keystoreDateEnd, 0, this.size).subscribe(response => {
      this.spinner.hide();
      if (response.content) {
        this.list = response.content;
        this.totalRecords = response.totalElements;
      } else {
        // bao loi
        this.toastService.showErrorHTMLWithTimeout('Không tìm thấy dữ liệu', '', 3000);
      }
    })
  }

  getPageableCert(event: LazyLoadEvent) {
    const first = event.first ? event.first : 0;
    const pageNumber = Math.floor(first / this.size) + 1;
    this.spinner.show();
    this.DigitalCertificateService.searchCertificate(this.fileName, this.serial_number, this.status.value, this.keystoreDateStart, this.keystoreDateEnd, pageNumber, this.size).subscribe(response => {
      if (response.content) {
        this.list = response.content;
        this.totalRecords = response.totalElements;
        this.spinner.hide();
      } else {
        // bao loi
        this.toastService.showErrorHTMLWithTimeout('Không tìm thấy dữ liệu', '', 3000);
      }
    })
  }

  getData() {
    this.DigitalCertificateService.getAllCertificate(this.file_name, this.status, this.keystoreDateStart, this.keystoreDateEnd, this.number, this.size).subscribe(response => {
      console.log("res", response);
      this.list = response.content;

      let dataCert: any = "";
      this.array_empty = [];
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
      id: id,
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
      title: 'infor.certificate',
      // dataCert: this.list.filter((x: any) => x.id == id),
      id: id,
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
