import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import * as moment from 'moment';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-report-contract-number-eContract-mSale',
  templateUrl: './report-contract-number-eContract-mSale.component.html',
  styleUrls: ['./report-contract-number-eContract-mSale.component.scss'],
})
export class ReportContractNumberEcontractMsaleComponent implements OnInit {
  @ViewChild('dt') table: Table;
  currentUser: any;
  lang: string;
  selectedNodeOrganization: any;
  listOrgCombobox: any;
  organization_id_user_login: any;
  organization_id: any;
  orgName: any;
  type_id: any = '';
  typeList: Array<any> = [];
  date: any;
  list: any[] = [];
  cols: any[];
  Arr = Array;
  site: string;
  page: number = 0;
  size: number = 5;
  totalRecords: number = 0;
  first: number = 0;

  isBaoCaoHopDongEcontractMsale: boolean = true;

  constructor(
    private appService: AppService,
    private inputTreeService: InputTreeService,
    private userService: UserService,

    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,

    private contractTypeService: ContractTypeService
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
  }
  async ngOnInit(): Promise<void> {

    this.appService.setTitle('role.number.contract.econtract.msale');

    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

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

  changeOrg() {
    this.getTypeListContract(this.selectedNodeOrganization.data);
  }

  async getTypeListContract(typeId?: number) {
    const inforType = await this.contractTypeService
      .getContractTypeList('', '',typeId)
      .toPromise();
    this.typeList = inforType
    this.typeList.unshift(
      {
        "name": "Tất cả",
        "id": ""
      },
      {
        "name": "Hợp đồng điện tử hệ thống mSale",
        "id": 209
      }
    )
  }

  convertTime(time: any, code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "";
  }

  validData() {
    if (!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('date.full.valid.completed', '', 3000);
      return false;
    }
    return true;
  }

  setColForTable() {
    this.cols = [
      {
        header: 'contract.type',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'chart.number',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
    ]
  }

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

    this.type_id = this.type_id ? this.type_id : '';

    if (!to_date) to_date = from_date;

    let params =
      '&from_date=' +
      from_date +
      // '&page=' +
      // this.page +
      // '&size=' +
      // this.size +
      '&to_date=' +
      to_date;

    //chờ api, api mẫu báo cáo sắp hết hiệu lực
    this.reportService.exportMsale('rp-by-contract-type', idOrg, this.type_id, params, flag).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (flag) {
          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `BaoCaoSLHĐ_eContract_mSale_${new Date().getDate()}-${new Date().getMonth() + 1
            }-${new Date().getFullYear()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.toastService.showSuccessHTMLWithTimeout(
            'download.success',
            '',
            3000
          );
        } else {
          this.list = [];
          let list1 = [this.orgName]
          let list2 = response.entities;
          this.list = list1.concat(list2)
          this.totalRecords = response.total_elements
          this.table.first = 0;

          this.setColForTable();
        }
      }, (err: any) => {
        this.spinner.hide()
        if (!flag) {
          this.toastService.showErrorHTMLWithTimeout(
            'report.msale.search.failed',
            '',
            3000
          )
        } else {
          if (flag) {
            this.toastService.showErrorHTMLWithTimeout(
              'report.msale.download.failed',
              '',
              3000
            )
        }}
      });

  }
}
