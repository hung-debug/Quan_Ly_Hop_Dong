import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-report-status-contract',
  templateUrl: './report-status-contract.component.html',
  styleUrls: ['./report-status-contract.component.scss']
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

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.processing.status.contract.full');

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
      }
    ];
  }

}
