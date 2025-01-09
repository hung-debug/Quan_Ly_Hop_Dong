import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { ConvertStatusService } from 'src/app/service/convert-status.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-report-contract-number-follow-status',
  templateUrl: './report-contract-number-follow-status.component.html',
  styleUrls: ['./report-contract-number-follow-status.component.scss']
})
export class ReportContractNumberFollowStatusComponent implements OnInit {
  @ViewChild('dt') table: Table;

   //Biến lưu dữ liệu trong bảng
   list: any[] = [];

   //col header
   cols: any[];
 
   colsSuggest: any[];
 
   selectedNodeOrganization: any;
   listOrgCombobox: any[];
   organization_id: any = '';
   lang: any;
   orgListTmp: any[] = [];
   orgList: any[] = [];
   organization_id_user_login: any;
 
   //Biến lấy số lượng tổ chức lớn nhất trong các tài liệu
   maxOrg: number;
 
   //Biến để gộp các cột
   mergeCol: any[] = [];
 
   params: any;
   date: any;
   optionsStatus: any;
 
   formGroup: any;

   contractStatus: number = -1;

   fetchChildData: boolean = true;

   Arr = Array;

  constructor(
    private appService: AppService,
    private userService: UserService,
    private inputTreeService: InputTreeService,

    private datepipe: DatePipe,
    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private convertStatusService: ConvertStatusService 
  ) {  // Khởi tạo ngày mặc định là khoảng 1 tháng tính từ ngày hiện tại
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.date = [startDate, currentDate];}

  ngOnInit(): void {
    this.spinner.hide();

    this.appService.setTitle('report');
    this.appService.setSubTitle('report.number.contracts.status.full');

    this.optionsStatus = [
      { id: -1, name: 'Tất cả' },
      { id: 20, name: 'Đang thực hiện' },
      { id: 2,  name:'Quá hạn' },
      { id: 40, name:'Thanh lý' },
      { id: 31, name: 'Từ chối' },
      { id: 32, name: 'Huỷ bỏ' },
      { id: 30, name: 'Hoàn thành' },
      { id: 33, name: 'Sắp hết hạn'}
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';

      this.optionsStatus = [
        { id: -1, name: 'All' },
        { id: 20, name: 'Processing' },
        { id: 2,  name:'Overdue' },
        { id: 40, name:'Liquidated' },
        { id: 31, name: 'Reject' },
        { id: 32, name: 'Cancel' },
        { id: 30, name: 'Complete' },
        { id: 33, name: 'Expiration soon' }
      ];
    }

    //lay id user
    this.organization_id_user_login =this.userService.getAuthCurrentUser().organizationId;

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

    this.cols = [
      {
        id: 8,
        header: 'contract.status.v2',
        style: 'text-align:left',
        colspan: 1,
        rowspan: 1,
      },
      {
        id: 13,
        header: 'chart.number',
        style: 'text-align:left',
        colspan: 1,
        rowspan: 1,
      }
    ];
  }

  
  validData() {
    if(!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('date.full.valid','',3000);
      return false;
    }
    return true;
  }

  org: any;
  clickReport: boolean = false;
  total: number;
  async export(flag: boolean) {
    if(!this.validData()) {
      return;
    }

    this.spinner.show();

    this.selectedNodeOrganization = !this.selectedNodeOrganization.length ? this.selectedNodeOrganization : this.selectedNodeOrganization[0]

    let idOrg = this.selectedNodeOrganization.data;

    let from_date: any = '';
    let to_date: any = '';
    if(this.date && this.date.length > 0) {
      from_date = this.datepipe.transform(this.date[0],'yyyy-MM-dd');
      to_date = this.datepipe.transform(this.date[1],'yyyy-MM-dd');
    }

    let contractStatus = this.contractStatus;

    if(!contractStatus) 
      contractStatus = -1;

    if(!to_date)
      to_date = from_date

    let params = '?from_date='+from_date+'&to_date='+to_date+'&status='+contractStatus+'&fetchChildData='+this.fetchChildData;

    const response = await this.reportService.export('rp-by-status',idOrg,params, flag).toPromise();

    this.spinner.hide();
    if(flag) {
      let url = window.URL.createObjectURL(response);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `BaoCaoSLTheoTrangThai_${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
    } else {

      this.list = [];
      this.table.first = 0

      this.spinner.hide();
      this.clickReport = true;

      this.list = response;
    }
  }

  convert(code: string) {
    return this.convertStatusService.convert(code);
  }

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }

}
