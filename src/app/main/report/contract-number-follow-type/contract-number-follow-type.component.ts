import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-contract-number-follow-type',
  templateUrl: './contract-number-follow-type.component.html',
  styleUrls: ['./contract-number-follow-type.component.scss']
})
export class ContractNumberFollowTypeComponent implements OnInit {
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
 
   //Biến lấy số lượng tổ chức lớn nhất trong các hợp đồng
   maxOrg: number;
 
   //Biến để gộp các cột
   mergeCol: any[] = [];
 
   params: any;
   date: any;
   optionsStatus: any;
 
   formGroup: any;

   contractStatus: number = -1;

   fetchChildData: boolean = true;

  total: any = {
    total: 0,
    processed: 0,
    processing: 0,
    canceled: 0,
    prepare_expires: 0,
    expired: 0
  };

  Arr = Array;

  constructor(
    private appService: AppService,
    private userService: UserService,
    private inputTreeService: InputTreeService,

    private datepipe: DatePipe,
    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService 

  ) { }

  ngOnInit(): void {

    this.spinner.hide();
    this.appService.setTitle('report.number.contracts.contract-type.full');

    this.optionsStatus = [
      // { id: -1, name: 'Tất cả' },
      { id: 20, name: 'Đang thực hiện' },
      { id: 2, name:'Quá hạn' },
      { id: 31, name: 'Từ chối' },
      { id: 32, name: 'Huỷ bỏ' },
      { id: 30, name: 'Hoàn thành' },
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';

      this.optionsStatus = [
        { id: -1, name: 'All' },
        { id: 20, name: 'Processing' },
        { id: 2, name:'Overdue' },
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

      this.selectedNodeOrganization = this.listOrgCombobox.filter(
        (p: any) => p.data == this.organization_id
      );
    });

    this.cols = [
      {
        id: 2,
        header: 'contract.type',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 13,
        header: 'chart.number',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 14,
        header: 'contract.status.complete',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 15,
        header: 'sys.processing',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 16,
        header: 'contract.status.cancel',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 17,
        header: 'contract.status.expire',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 18,
        header: 'contract.status.overdue',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
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

  //Export ra file excel
  clickReport: boolean = false;
  org: any;
  async export(flag: boolean) {
    if(!this.validData()) {
      return;
    }

    this.spinner.show();

    let idOrg = this.organization_id;
    if(this.selectedNodeOrganization.data) {
      idOrg = this.selectedNodeOrganization.data;
    }

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
      to_date = from_date;
    
    let params = '?from_date='+from_date+'&to_date='+to_date+'&status='+contractStatus+'&fetchChildData='+this.fetchChildData;
    this.reportService.export('rp-by-type',idOrg,params, flag).subscribe((response: any) => {

        this.spinner.hide();
        
        if(flag) {
          this.spinner.hide();
          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `report-by-type_${new Date().getTime()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
  
          this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
        } else {

          this.table.first = 0

          this.clickReport = true;

          let array: any = [];
          this.list = [];

          this.total = {
            total: 0,
            processed: 0,
            processing: 0,
            canceled: 0,
            prepare_expires: 0,
            expired: 0
          };

          Object.keys(response).forEach((key, index) => {
            this.org = key;

            array[0] = response[key];
          });

          let reportList =array[0];

          let name: any[] = [];
          let value: any[] = [];

          Object.keys(reportList).forEach((key: any, index: any) => {
            name.push(key);
            value.push(reportList[key]);
          });
          
          for(let i = 0; i < name.length; i++) {
            this.list[i] = {
              name: name[i],
              value: value[i]
            }
          }

          let listFirst = [this.org];
          let letSecond = this.list;

          this.list = listFirst.concat(letSecond);

          const listData = this.list.slice(1);

          listData.forEach((item: any) => {
              this.total.name = item.name;

              this.total.total += item.value.total;
              this.total.processed += item.value.processed;
              this.total.processing += item.value.processing;
              this.total.canceled += item.value.canceled;
              this.total.prepare_expires += item.value.prepare_expires;
              this.total.expired += item.value.expired;
          })
        }
       
    })

  }

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }

}
