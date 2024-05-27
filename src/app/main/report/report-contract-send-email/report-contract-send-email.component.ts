import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { ContentEmailComponent } from '../report-contract-send-email/content-email/content-email.component';

@Component({
  selector: 'app-report-status-send-email',
  templateUrl: './report-contract-send-email.component.html',
  styleUrls: ['./report-contract-send-email.component.scss'],
})

export class ReportStatusSendEmailComponent implements OnInit {
  @ViewChild('dt') table: Table;
  currentUser: any;
  selectedNodeOrganization: any;
  listOrgCombobox: any;
  date: any;
  list: any[] = [];
  cols: any[];
  typeList: Array<any> = [];
  contractInfo: any;
  orgName: any;
  Arr = Array;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;
  optionsStatus: any = [];
  contractStatus: any;
  maxSelectableDate: Date;
  totalRecords: number = 0;
  row: number = 10;
  pageOptions: any[] = [10, 20, 50, 100];
  page: number = 0;
  enterPage: number = 1;
  inputTimeout: any;
  numberPage: number;
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
    let endDate = new Date();
    // Tính toán ngày bắt đầu (7 ngày trước ngày kết thúc)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    // Gán giá trị mặc định cho biến date

    this.date = [startDate, endDate];
  }


  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    this.appService.setTitle('report');
    this.appService.setSubTitle('role.report.history.send.email');

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
      this.listOrgCombobox[0].children.forEach((element: any) => {
        element.expanded = !element.expanded
      });
      this.selectedNodeOrganization = this.listOrgCombobox.filter(
        (p: any) => p.data == this.organization_id
      );
    });

    this.setColForTable();

    this.getTypeListContract(this.currentUser.organizationId);
  }

  onCloseCalendar() {
    this.maxSelectableDate.setDate(this.date[0].getDate()+3000)
  }

  convertTime(time: any, code?: any) {
    return moment(time).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY HH:mm:ss");
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

  contentEmail(id: any) {
    const data = {
      title: 'content.email',
      id: id,
    };
    const dialogRef = this.dialog.open(ContentEmailComponent, {
      width: '900px',
      height: '750px',
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
        header: 'report.email',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'content',
        style: 'text-align: center',
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
        header: 'contract.status.v2',
        style: 'text-align: center',
        colspan: 1,
        rowspan: 1,
      },
    ];
  }
  async exportEmailReportCall(isExport: boolean) {
    this.selectedNodeOrganization = !this.selectedNodeOrganization.length
    ? this.selectedNodeOrganization
    : this.selectedNodeOrganization[0];
    this.orgName = this.selectedNodeOrganization.label;
    let idOrg = this.selectedNodeOrganization.data;

    let from_date: any = '';
    let to_date: any = '';
    if (this.date && this.date.length > 0) {
      from_date = this.date[0]
      to_date = this.date[1]
    }

    let contractStatus = this.contractStatus;

    if (!contractStatus) contractStatus = -1;

    if (!to_date) to_date = from_date;

    let payloadData = {
      "orgId": idOrg,
      "contractInfo": this.contractInfo,
      "startDate": from_date,
      "endDate": to_date,
    }

    let params = `?pageNumber=`+this.page+`&pageSize=`+this.row;
    try {
      if (!isExport) {
        this.spinner.show()
        await this.reportService.exportEmailReport(params, payloadData, false).toPromise().then(
          (res: any) => {
            this.table.first = 0
            this.list = [];
            this.spinner.hide()
            this.list = res.content
            this.totalRecords = res.totalElements;
            this.numberPage = res.totalPages;
          }
        )
      } else {
        this.spinner.show()
        await this.reportService.exportEmailReport(params, payloadData, true).toPromise().then(
          (res: any) => {
            // this.list = [];
            this.spinner.hide()
            if (res) {
              this.toastService.showSuccessHTMLWithTimeout('Xuất file báo cáo thành công','',3000)
              this.downloadFile(res)
            }
          }
        )
      }
    } catch (error) {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout('error.get.contract.list.report','',3000)
    }
  }

  toRecord() {
    return Math.min((this.page + 1) * this.row, this.totalRecords)
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.enterPage = this.page + 1;
    this.exportEmailReportCall(false);
  }

  validateInput(event: KeyboardEvent) {
    const input = event.key;
    if (input === ' ' || (isNaN(Number(input)) && input !== 'Backspace')) {
      event.preventDefault();
    }
  }

  onInput(event: any) {
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.autoSearchEnterPage(event);
    }, 1000);
  }

  autoSearchEnterPage(event: any) {
    if(event.target.value && event.target.value != 0 && event.target.value <= this.numberPage) {
      this.page = this.enterPage - 1;
    } else {
      this.enterPage = this.page + 1;
    }
    this.exportEmailReportCall(false);
  }

  changePageNumber(e: any){
    this.page = 0;
    this.enterPage = 1;
    this.row = e.target.value;
    // sessionStorage.setItem('createdPageNum', this.page.toString());
    this.exportEmailReportCall(false);
  }

  downloadFile(data: any) {
    let currentDate = moment().format('HH:mm:ss')
    let selectedStartDate = moment(this.date[0]).format('DD-MM-YYYY')
    let selectedEndDate = moment(this.date[1]).format('DD-MM-YYYY')
    const blob = new Blob([data], { type: 'application/x-binary' });
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element for downloading the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `Email_Report_${selectedStartDate + '_' + selectedEndDate}.xlsx`; // Specify the file name for the download

    // Trigger a click event to initiate the download
    a.click();

    // Clean up by revoking the URL
    window.URL.revokeObjectURL(url);
  }

}
