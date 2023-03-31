import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-soon-expire',
  templateUrl: './report-soon-expire.component.html',
  styleUrls: ['./report-soon-expire.component.scss'],
})
export class ReportSoonExpireComponent implements OnInit {
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

  constructor(
    private appService: AppService,
    private inputTreeService: InputTreeService,
    private userService: UserService,

    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,

    private translate: TranslateService ,
    private contractService: ContractService

  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    this.appService.setTitle('report.expires-soon.contract.full');

    this.contractService.getDataNotifyOriganzation().subscribe((res: any) => {
      this.orgName = res.name;
    })
    
    this.optionsStatus = [
      { id: -1, name: 'Tất cả' },
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

      this.selectedNodeOrganization = this.listOrgCombobox.filter((p: any) => p.data == this.organization_id);
    });

    this.setColForTable();
  }

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }

  validData() {
    if(!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng nhập đủ ngày ngày tạo','',3000);
      return false;
    }
    return true;
  }

  setColForTable() {
    this.cols = [
      {
        id: 1,
        header: 'contract.name',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        id: 2,
        header: 'contract.type',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        id: 3,
        header: 'contract.number',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        id: 7,
        header: 'signing.expiration.date',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
      {
        id: 10,
        header: 'suggest',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
    ];
  }

  maxParticipants: number = 0;
  export(flag: boolean) {
    if(!this.validData()) {
      return;
    }

    this.spinner.show();

    this.selectedNodeOrganization = !this.selectedNodeOrganization.length ? this.selectedNodeOrganization : this.selectedNodeOrganization[0]

    this.orgName = this.selectedNodeOrganization.label;
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

    let params = '?from_date='+from_date+'&to_date='+to_date+'&type=';
    this.reportService.export('rp-by-effective-date',idOrg,params, flag).subscribe((response: any) => {

        this.spinner.hide();

        if(flag) {
          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `report-effective-date_${new Date().getTime()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
  
          this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
        } else {
          this.setColForTable();
          for(let i = 0; i < response.maxParticipant - 1; i++) {
            this.cols.push({
              id: 10+i,
              header: 'Bên được yêu cầu ký '+(i+1),
              style: 'text-align: left;',
              colspan: 1,
              rowspan: 1,
            })
          }

          this.maxParticipants = response.maxParticipant;

          let listFirst = [this.orgName];
          let letSecond = response.contracts;

          console.log("re ", response.contracts)
  
          this.list = listFirst.concat(letSecond);
        }
      
    })
 
  }
}
