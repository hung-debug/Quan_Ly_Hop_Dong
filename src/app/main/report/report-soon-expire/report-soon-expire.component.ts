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

@Component({
  selector: 'app-report-soon-expire',
  templateUrl: './report-soon-expire.component.html',
  styleUrls: ['./report-soon-expire.component.scss'],
})
export class ReportSoonExpireComponent implements OnInit {
  @ViewChild('dt') table: Table;

  selectedNodeOrganization: any;
  listOrgCombobox: any;
  date: any;
  optionsStatus: any;
  list: any[] = [];
  cols: any[];
  colsSuggest: any;
  mergeCol: any;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;
  orgListTmp: any[] = [];
  orgList: any;
  array_empty: any[];

  fetchChildData: boolean = false;
  contractStatus: number = -1;

  Arr = Array;

  orgName: any;
  type_id: any;
  typeList: Array<any> = [];
  currentUser: any;
  contractInfo: string;
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
  }

  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    this.appService.setTitle('report.expires-soon.contract.full');

    this.contractService.getDataNotifyOriganzation().subscribe((res: any) => {
      this.orgName = res.name;
    });

    this.optionsStatus = [
      { id: 20, name: 'Đang thực hiện' },
      { id: 34, name: 'Quá hạn' },
      { id: 31, name: 'Từ chối' },
      { id: 32, name: 'Huỷ bỏ' },
      { id: 30, name: 'Hoàn thành' },
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';

      this.optionsStatus = [
        { id: 20, name: 'Processing' },
        { id: 34, name: 'Overdue' },
        { id: 31, name: 'Reject' },
        { id: 32, name: 'Cancel' },
        { id: 30, name: 'Complete' },
      ];
    }

    //lay id user
    this.organization_id_user_login =
      this.userService.getAuthCurrentUser().organizationId;
    //mac dinh se search theo ma to chuc minh
    this.organization_id = this.organization_id_user_login;

    //lấy danh sách tổ chức

    this.inputTreeService.getData().then((res: any) => {
      this.listOrgCombobox = res;
      this.listOrgCombobox[0]?.children.forEach((element: any) => {
        element.expanded = !element.expanded
      });
      this.selectedNodeOrganization = this.listOrgCombobox.filter(
        (p: any) => p.data == this.organization_id
      );
    });

    this.setColForTable();

    this.getTypeListContract(this.currentUser.organizationId);
  }

  convertTime(time: any,code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "" ;
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

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }

  validData() {
    if (!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('date.full.valid.soon-expire', '', 3000);
      return false;
    }
    return true;
  }

  setColForTable() {
    this.cols = [
      {
        header: 'contract.name',
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
        header: 'created.unit',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.type',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'suggest',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
    ];
  }

  getNumberArray(num: number): number[] {
    return Array(num)
      .fill(0)
      .map((x, i) => i + 1);
  }

  maxParticipants: number = 0;
  export(flag: boolean) {
    if (!this.validData()) {
      return;
    }

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

    let contractStatus = this.contractStatus;

    this.type_id = this.type_id ? this.type_id : '';

    if (!contractStatus) contractStatus = -1;

    if (!to_date) to_date = from_date;
    
    let payload = ""
    if(this.contractInfo){
       payload ='&textSearch=' + this.contractInfo.trim()
    }
    
    let params =
      '?from_date=' +
      from_date +
      '&to_date=' +
      to_date +
      '&type=' +
      this.type_id + payload+`&pageNumber=`+this.page+`&pageSize=`+this.row;
    this.reportService
      .export('rp-by-effective-date', idOrg, params, flag)
      .subscribe((response: any) => {
        this.spinner.hide();

        if (flag) {
          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `BaoCaoSapHetHan_${new Date().getDate()}-${
            new Date().getMonth() + 1
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
          for (let i = 0; i < response.maxParticipant - 1; i++) {
            this.cols.push({
              id: 7 + i,
              header: 'Bên được yêu cầu ký ' + (i + 1),
              style: 'text-align: left;',
              colspan: 1,
              rowspan: 1,
            });
          }

          this.cols.push({
            id: 10,
            header: 'signing.expiration.date',
            style: 'text-align: left',
            colspan: 1,
            rowspan: 1,
          });

          this.maxParticipants = response.maxParticipant;

          let listFirst = [this.orgName];
          let listSecond = response.contracts;

          listSecond.forEach((ele: any) => {
            // Lọc lấy phần tử có thuộc tính type = 1
            let type1 = ele.participants.filter(function (participant: any) {
              return participant.type === 1;
            });

            // Sắp xếp mảng các phần tử không phải type 1 theo thứ tự tăng dần của thuộc tính 'ordering'
            let others = ele.participants
              .filter(function (participant: any) {
                return participant.type !== 1;
              })
              .sort(function (a: any, b: any) {
                return a.ordering - b.ordering;
              });

            // Kết hợp mảng type1 và others thành một mảng mới
            let sortedParticipants = type1.concat(others);

            ele.participants = sortedParticipants;
          });

          this.list = listFirst.concat(listSecond);
          this.totalRecords = response.TotalElements;
          this.numberPage = response.TotalPages;
        }
      });
  }

  toRecord() {
    return Math.min((this.page + 1) * this.row, this.totalRecords)
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.enterPage = this.page + 1;
    this.export(false);
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
    this.export(false);
  }

  changePageNumber(e: any){
    this.page = 0;
    this.row = e.target.value;
    // sessionStorage.setItem('createdPageNum', this.page.toString());
    this.export(false);
  }
}
