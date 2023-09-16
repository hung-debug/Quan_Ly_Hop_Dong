import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentSmsComponent } from './content-sms/content-sms.component';

@Component({
  selector: 'app-report-status-send-sms-email',
  templateUrl: './report-status-send-sms-email.component.html',
  styleUrls: ['./report-status-send-sms-email.component.scss'],
})

export class ReportStatusSendSmsEmailComponent implements OnInit {
  @ViewChild('dt') table: Table;
  currentUser: any;
  selectedNodeOrganization: any;
  listOrgCombobox: any;
  date: any;
  list: any[] = [];
  cols: any[];
  typeList: Array<any> = [];
  inforContract: any;
  orgName: any;
  Arr = Array;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;
  totalRecords: number = 0;
  first: number = 0;

  constructor(
    private appService: AppService,
    private inputTreeService: InputTreeService,
    private userService: UserService,
    public dialog: MatDialog,
    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,

    private contractService: ContractService,
    private contractTypeService: ContractTypeService
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;

    // Tính toán ngày kết thúc (hiện tại)
    const endDate = new Date();

    // Tính toán ngày bắt đầu (7 ngày trước ngày kết thúc)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    // Gán giá trị mặc định cho biến date
    this.date = [startDate, endDate];
  }


  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    this.appService.setTitle('role.report.history.send.sms.email');


    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    //lay id user
    this.organization_id_user_login =
      this.userService.getAuthCurrentUser().organizationId;
    //mac dinh se search theo ma to chuc minh
    this.organization_id = this.organization_id_user_login;

    //lấy danh sách tổ chức

    this.inputTreeService.getData().then((res: any) => {
      this.listOrgCombobox = res;

      this.selectedNodeOrganization = this.listOrgCombobox.filter(
        (p: any) => p.data == this.organization_id
      );
    });

    this.setColForTable();

    this.getTypeListContract(this.currentUser.organizationId);
  }

  convertTime(time: any, code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "";
  }

  changeOrg() {
    this.getTypeListContract(this.selectedNodeOrganization.data);
  }

  async getTypeListContract(typeId?: number) {
    const inforType = await this.contractTypeService
      .getContractTypeList('', '', typeId)
      .toPromise();
    this.typeList = inforType;
  }

  contentSMS(id: any) {
    const data = {
      title: 'content.sms',
      id: id,
    };
    const dialogRef = this.dialog.open(ContentSmsComponent, {
      width: '600px',
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }

  setColForTable() {
    this.cols = [
      {
        header: 'code.contract',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.number',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.name',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'phone',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'content',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'time.send.date',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'Trạng thái gửi',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
    ];
  }

  export(flag: boolean) {

    this.spinner.show();

    this.selectedNodeOrganization = !this.selectedNodeOrganization.length
      ? this.selectedNodeOrganization
      : this.selectedNodeOrganization[0];

    this.orgName = this.selectedNodeOrganization.label;
    let idOrg = this.selectedNodeOrganization.data;

    let from_date: any = '';
    let to_date: any = '';
    if (this.date && this.date.length > 0) {
      from_date = this.datepipe.transform(this.date[0], 'yyyy-MM-dd');
      to_date = this.datepipe.transform(this.date[1], 'yyyy-MM-dd');
    }

    if (!to_date) to_date = from_date;

    let params =
      '?from_date=' +
      from_date +
      '&to_date=' +
      to_date;

    this.reportService.export('rp-by-effective-date', idOrg, params, flag).subscribe((response: any) => {
      this.spinner.hide();

      if (flag) {
        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `BaoCaoLichSuSms_${new Date().getDate()}-${new Date().getMonth() + 1
          }-${new Date().getFullYear()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.toastService.showSuccessHTMLWithTimeout(
          'no.contract.download.file.success',
          '',
          3000
        );
      } else {
        this.list = [];
        this.table.first = 0;
        this.setColForTable();
      }
    });
  }
}
