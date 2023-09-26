import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/service/contract.service';
import { ConvertStatusService } from 'src/app/service/convert-status.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-report-contract-receive',
  templateUrl: './report-contract-receive.component.html',
  styleUrls: ['./report-contract-receive.component.scss']
})
export class ReportContractReceiveComponent implements OnInit {
  @ViewChild('dt') table: Table;

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
  contractStatus: number = -1;

  fetchChildData: boolean = false;
  Arr = Array;

  orgName: any;

  constructor(
    private appService: AppService,
    private userService: UserService,
    private translate: TranslateService,
    private fbd: FormBuilder,
    private inputTreeService: InputTreeService,
    private datepipe: DatePipe,
    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private convertStatusService: ConvertStatusService,
  ) {
    this.formGroup = this.fbd.group({
      name: this.fbd.control(''),
      date: this.fbd.control(''),
      contractStatus: this.fbd.control(''),
    });
  }

  ngOnInit(): void {
    this.spinner.hide();

    this.appService.setTitle('report.contract.receive.full');

    this.formGroup = this.fbd.group({
      name: this.fbd.control(''),
      date: this.fbd.control(''),
      contractStatus: this.fbd.control(''),
    });

    this.optionsStatus = [
      { id: 20, name: 'Đang thực hiện' },
      { id: 33, name: 'Sắp hết hạn' },
      { id: 2, name:'Quá hạn' },
      { id: 31, name: 'Từ chối' },
      { id: 32, name: 'Huỷ bỏ' },
      { id: 30, name: 'Hoàn thành' },
    ];

    this.colsSuggest = [
      { header: 'sign.object', style: 'text-align: left, min-width:300px, width: 300px'},
      { header: 'name.unit', style: 'text-align: left, min-width:300px, width: 300px' },
      { header: 'user.view', style: 'text-align: left, min-width:300px, width: 300px' },
      { header: 'user.sign', style: 'text-align: left, min-width:300px, width: 300px' },
      { header: 'user.doc', style: 'text-align: left, min-width:300px, width: 300px'},
    ];

    this.setColForTable();

    this.getMergeCol();

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';

      this.optionsStatus = [
        { id: 20, name: 'Processing' },
        { id: 33, name: 'Expiration soon' },
        { id: 2, name:'Overdue' },
        { id: 31, name: 'Reject' },
        { id: 32, name: 'Cancel' },
        { id: 30, name: 'Complete' },
      ];
    }

    //lay id user
    this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
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
  }

  convertTime(time: any,code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "" ;
  }

  convertStatus(status: string) {
    return this.convertStatusService.convert(status);
  }

  //merge các cột nhỏ của bảng
  getMergeCol() {
    this.mergeCol = this.cols.concat(this.colsSuggest);
  }

  validData() {
    if(!this.date || (this.date && this.date.length < 2)) {
      this.toastService.showErrorHTMLWithTimeout('date.full.valid','',3000);
      return false;
    }
    return true;
  }

  setColForTable() {
    this.cols = [
      {
        id: 1,
        header: 'contract.name',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 2,
        header: 'contract.type',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 3,
        header: 'contract.number',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 4,
        header: 'contract.uid',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 5,
        header: 'contract.connect',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 6,
        header: 'contract.time.create',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 7,
        header: 'expiration-date',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 8,
        header: 'contract.status.v2',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 10,
        header:'created.unit',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 11,
        header:'created.user',
        style: 'text-align: left; width: 250px',
        colspan: 1,
        rowspan: 2,
      },
      {
        id: 1000,
        header: 'suggest',
        style: 'text-align: left; width: 1250px',
        colspan: 5,
        rowspan: 1,
      },
    ];
  }

  //Export ra file excel
  maxParticipants: number = 0;
  clickTable: boolean = false;
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

    this.clickTable = true;

    if(!to_date)
      to_date = from_date

    let params = '?from_date='+from_date+'&to_date='+to_date+'&status='+contractStatus+'&fetchChildData='+this.fetchChildData;
    this.reportService.export('rp-my-process',idOrg,params, flag).subscribe((response: any) => {
        this.spinner.hide();
        if(flag) {
          this.spinner.hide();
          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `BaoCaoHopDongNhan_${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
  
          this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
        } else {
          this.table.first = 0
          this.list = [];
          this.colsSuggest = [
            { header: 'sign.object', style: 'text-align: left, min-width:250px, width: 250px'},
            { header: 'name.unit', style: 'text-align: left, min-width:250px, width: 250px' },
            { header: 'user.view', style: 'text-align: left, min-width:250px, width: 250px' },
            { header: 'user.sign', style: 'text-align: left, min-width:250px, width: 250px' },
            { header: 'user.doc', style: 'text-align: left, min-width:250px, width: 250px'},
          ];

          this.setColForTable();
      
          for(let i = 0; i < response.maxParticipant - 1; i++) {
            this.cols.push({
              id: 1000+i,
              header: 'Bên được yêu cầu ký '+(i+1),
              style: 'text-align: left; width: 1500px',
              colspan: 6,
              rowspan: 1,
            })

            this.colsSuggest.push(
              { header: 'sign.object', style: 'text-align: left, width: 250px' },
              { header: 'name.unit', style: 'text-align: left, width: 250px' },
              { header: 'contract.lead', style: 'text-align: left, width: 250px' },
              { header: 'user.view', style: 'text-align: left, width: 250px' },
              { header: 'user.sign', style: 'text-align: left, width: 250px' },
              { header: 'user.doc', style: 'text-align: left, width: 250px' },
            );
          }

          this.maxParticipants = response.maxParticipant;

          let listFirst = [this.orgName];
          let letSecond = response.contracts;

          this.list = listFirst.concat(letSecond);
        }
      
    })
 
  }

  getValue(list: any,index: number,code: string) {
    if(list.participants[index]) {
      if(code == 'type')
        return list.participants[index].type == 3 ? this.translate.instant('personal') : this.translate.instant('organization')
      if(code == 'name') {
        return list.participants[index].name
      }
    }

    return null;
  }

  getNumberArray(num: number): number[] {
      return Array(num).fill(0).map((x, i) => i + 1);
  }
  

  getName(list: any,index: number,code: string) {
    let result: any[] = [];
    if(list.participants[index]) {
      list.participants[index].recipients.forEach((ele: any) => {
        // participant.recipients.forEach((ele: any) => {
          if(code == 'view') {
            if(ele.role == 2) {
              result.push(ele.email)
            }
          } else if(code == 'sign') {
            if(ele.role == 3 && ele.status != 4) {
              result.push(ele.email)
            }
          } else if(code == 'doc') {
            if(ele.role == 4) {
              result.push(ele.email);
            }
          } else if(code == 'coor') {
            if(ele.role == 1) {
              result.push(ele.email);
            }
          }
        
        // })
      })
    }
    
    return result;
  }

  changeCheckBox(event: any) {
    this.fetchChildData = event.target.checked;
  }
}
