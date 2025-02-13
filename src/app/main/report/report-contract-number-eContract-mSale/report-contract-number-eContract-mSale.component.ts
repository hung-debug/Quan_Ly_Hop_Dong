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
  type_id: any = [];
  type_id_detail: any= [];
  typeList: Array<any> = [];
  typeListDetail: Array<any> = [];
  date: any;
  list: any[] = [];
  listDetail: any[] = [];
  cols: any[];
  colsDetail: any[];
  Arr = Array;
  site: string;
  page: number = 0;
  size: number = 5;
  totalRecords: number = 0;
  first: number = 0;
  stateOptions: any[];
  isReport: string = 'off';
  contractsSum: number = 0
  isBaoCaoHopDongEcontractMsale: boolean = true;

  isExporting: boolean = false; // Thêm biến cờ

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

    this.stateOptions = [
      { label: 'overview.report', value: 'off' },
      { label: 'detail.report', value: 'on' },
    ];
     // Khởi tạo ngày mặc định là khoảng 1 tháng tính từ ngày hiện tại
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.date = [startDate, currentDate];
  }
  async ngOnInit(): Promise<void> {
    // Tính toán ngày kết thúc (hiện tại)
    let endDate = new Date();
    // Tính toán ngày bắt đầu (7 ngày trước ngày kết thúc)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    // Gán giá trị mặc định cho biến date
    this.date = [startDate, endDate];

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
      this.listOrgCombobox[0]?.children.forEach((element: any) => {
        element.expanded = !element.expanded
      });
      this.selectedNodeOrganization = this.listOrgCombobox.filter(
        (p: any) => p.data == this.organization_id
      );
    });

    this.setColForTable();
    this.getContractGroupList(this.currentUser.organizationId);
    this.getContractGroupListDetail(this.currentUser.organizationId);
  }

  changeTab() {

  }

  changeOrg() {
    // this.typeList = []
    // this.type_id = []
    // this.getTypeListContract(this.selectedNodeOrganization.data);
  }

  async getContractGroupList(typeId?: number) {
    this.typeList = []
    this.type_id = []
    const inforType = await this.reportService
      .getContractGroup()
      .toPromise();
    this.typeList = inforType

    for (let i = 0; i<this.typeList?.length; i++){
      this.type_id.push(this.typeList[i].id)
    }
  }


  async getContractGroupListDetail(typeIdDetail?: number) {
    this.typeListDetail = []
    this.type_id_detail = []
    this.typeListDetail = [
      { id: 1, name: 'Khác' },
      { id: 2, name: 'Công nghệ thông tin' },
    ];
    for (let i = 0; i<this.typeListDetail?.length; i++){
      this.type_id_detail.push(this.typeListDetail[i].id)
    }
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
        header: 'contract.group',
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
    ],

    this.colsDetail = [
      {
        header: 'contract.name',
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
        header: 'contract.group',
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
        header: 'contract.uid',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.time.create',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'expiration-date',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'complete.time',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.status.v2',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'contract.create.unit',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'created.user',
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

    // Vô hiệu hóa nút export
    this.isExporting = true;

    // Hiển thị thông báo "Báo cáo đang được xuất"
    this.toastService.showSuccessHTMLWithTimeout("report.exporting", "", 3000);

    // Ẩn spinner
    this.spinner.hide();

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
      '&from_date=' +
      from_date +
      // '&page=' +
      // this.page +
      // '&size=' +
      // this.size +
      '&to_date=' +
      to_date;

    //chờ api, api mẫu báo cáo sắp hết hiệu lực
        if (flag) {
      this.reportService.exportMsale('rp-by-contract-type', idOrg, this.type_id.toString(), params, flag).subscribe(
        (response: any) => {
          this.spinner.hide();
          // this.toastService.showSuccessHTMLWithTimeout('Xuất file báo cáo thành công','',3000)
          this.exportToExcel(response)
        },
        (err: any) => {
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
        } else {
      this.reportService.exportMsale('rp-by-contract-type', idOrg, this.type_id.toString(), params, flag).subscribe(
        (response: any) => {
          this.spinner.hide();

          let msaleData: any[] = this.convertObjDataToArr(response)
          let newMsaleData: any = msaleData.map((item: any) => ({
            ...item, orgName: this.getOrgNameFromString(item.key), orgId: this.getOrgIdFromString(item.key)
          }))
          let parentOrgIndex = newMsaleData.findIndex((item: any) => item.orgId == idOrg)
          newMsaleData = [newMsaleData[parentOrgIndex], ...newMsaleData.toSpliced(parentOrgIndex, 1)]
          this.list = newMsaleData
          this.table.first = 0
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

  exportDetail(flag: boolean) {
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

    if (!to_date) to_date = from_date;

    let params =
      '&from_date=' +
      from_date +
      '&to_date=' +
      to_date;

    this.reportService.exportMsale('rp-by-contract-type-detail', idOrg, this.type_id_detail.toString(), params, flag).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (flag) {
          this.exportToExcelDetail(response)
        } else {
          let msaleDataDetail: any[] = this.convertObjDataToArr(response)
          let newMsaleDataDetail: any = msaleDataDetail.map((item: any) => ({
            ...item, orgName: this.getOrgNameFromString(item.key), orgId: this.getOrgIdFromString(item.key)
          }))
          let parentOrgIndex = newMsaleDataDetail.findIndex((item: any) => item.orgId == idOrg)
          newMsaleDataDetail = [newMsaleDataDetail[parentOrgIndex], ...newMsaleDataDetail.toSpliced(parentOrgIndex, 1)]
          this.listDetail = newMsaleDataDetail
          this.contractsSum = 0
          this.listDetail.forEach(element => {
            this.contractsSum += element.data.length
          });
          this.table.first = 0
        }
      },
      error: (err: any) => {
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
      },
      complete: () => {
        // Hoàn thành
        this.isExporting = false; // Kích hoạt lại nút export
      }
    });
  }

  convertObjDataToArr(obj: any) {
    let newData: any[] = Object.keys(obj).map((item: any) => ({
      key: item, data: obj[item]
    }))

    return newData
  }

  getOrgNameFromString(str: string) {
    str.toString()
    let nameMatch = str.match(/name=([^,]+)/)
    if (nameMatch) return nameMatch[1]
  }

  getOrgIdFromString(str: string) {
    str.toString()
    let nameMatch = str.match(/id=([^,]+)/)
    if (nameMatch) return nameMatch[1]
  }

  exportToExcel(response: any) {
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
  }

  exportToExcelDetail(response: any) {
    let url = window.URL.createObjectURL(response);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `BaoCaoChiTiet_HĐ_eContract_${new Date().getDate()}-${new Date().getMonth() + 1
        }-${new Date().getFullYear()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.toastService.showSuccessHTMLWithTimeout(
        'download.success',
        '',
        3000
      );
  }
}