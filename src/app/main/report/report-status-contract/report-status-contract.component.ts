import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-status-contract',
  templateUrl: './report-status-contract.component.html',
  styleUrls: ['./report-status-contract.component.scss'],
})
export class ReportStatusContractComponent implements OnInit {
  //Biến lưu dữ liệu trong bảng
  list: any[];

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

  contractStatus: any;

  fetchChildData: boolean = false;

  constructor(
    private appService: AppService,
    private userService: UserService,
    private inputTreeService: InputTreeService,

    private datepipe: DatePipe,
    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService 

  ) {}

  ngOnInit(): void {
    this.appService.setTitle('report.processing.status.contract.full');

    this.optionsStatus = [
      { id: -1, name: this.translate.instant('all') },
      { id: 20, name: this.translate.instant('sys.processing') },
      { id: 2, name: this.translate.instant('contract.status.overdue') },
      { id: 31, name: this.translate.instant('contract.status.fail') },
      { id: 32, name: this.translate.instant('contract.status.cancel') },
      { id: 30, name: this.translate.instant('contract.status.complete') },
    ];

    //lay id user
    this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
    
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
        id: 1,
        header: 'contract.name',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      {
        id: 2,
        header: 'contract.type',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      // {
      //   id: 3,
      //   header: 'contract.number',
      //   style: 'text-align: left;',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      // {
      //   id: 4,
      //   header: 'contract.uid',
      //   style: 'text-align: left;',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      // {
      //   id: 5,
      //   header: 'contract.connect',
      //   style: 'text-align: left',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      // {
      //   id: 6,
      //   header: 'contract.time.create',
      //   style: 'text-align: left',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      // {
      //   id: 7,
      //   header: 'signing.expiration.date',
      //   style: 'text-align: left',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      {
        id: 8,
        header: 'contract.status.v2',
        style: 'text-align:left',
        colspan: 1,
        rowspan: '2',
      },
      // {
      //   id: 9,
      //   header: 'date.completed',
      //   style: 'text-align: left',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      {
        id: 10,
        header: 'suggest',
        style: 'text-align: center',
        colspan: '5',
        rowspan: 1,
      },
      {
        id: 11,
        header: 'user.ed',
        style: 'text-align: center',
        colspan: '5',
        rowspan: 1,
      },
      {
        id: 11,
        header: 'user.ing',
        style: 'text-align: center',
        colspan: '5',
        rowspan: 1,
      },
      {
        id: 11,
        header: 'user.not.process',
        style: 'text-align: center',
        colspan: '5',
        rowspan: 1,
      },
    ];
  }

  
  validData() {
    if(!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập đủ ngày ngày tạo','',3000);
      return false;
    }
    return true;
  }

  //Export ra file excel
  export(flag: boolean) {
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

    let params = '?from_date='+from_date+'&to_date='+to_date+'&status='+contractStatus+'&fetchChilData='+this.fetchChildData;
    this.reportService.export('rp-by-status-process',idOrg,params, true).subscribe((response: any) => {

      this.spinner.hide();

      if(flag) {
        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `report-by-status-process_${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
      }
      
    })

  }

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }
}
