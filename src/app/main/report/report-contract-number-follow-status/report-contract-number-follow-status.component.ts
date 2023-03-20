import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-report-contract-number-follow-status',
  templateUrl: './report-contract-number-follow-status.component.html',
  styleUrls: ['./report-contract-number-follow-status.component.scss']
})
export class ReportContractNumberFollowStatusComponent implements OnInit {

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
    private appService: AppService,
    private userService: UserService,
    private inputTreeService: InputTreeService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.number.contracts.status.full');

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
      // {
      //   id: 1,
      //   header: 'contract.name',
      //   style: 'text-align: left;',
      //   colspan: 1,
      //   rowspan: '2',
      // },
      // {
      //   id: 2,
      //   header: 'contract.type',
      //   style: 'text-align: left;',
      //   colspan: 1,
      //   rowspan: '2',
      // },
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
      // {
      //   id: 10,
      //   header: 'suggest',
      //   style: 'text-align: center',
      //   colspan: '5',
      //   rowspan: 1,
      // },
      {
        id: 13,
        header: 'chart.number',
        style: 'text-align:left',
        colspan: 1,
        rowspan: '2',
      }
    ];
  }

}
