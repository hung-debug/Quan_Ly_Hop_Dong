import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

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
  list: any;
  cols: any;
  colsSuggest: any;
  mergeCol: any;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;
  orgListTmp: any[] = [];
  orgList: any;
  array_empty: any[];

  constructor(
    private appService: AppService,
    private inputTreeService: InputTreeService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.appService.setTitle('report.expires-soon.contract.full');

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
      {
        id: 3,
        header: 'contract.number',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: '2',
      },
      // {id: 4,header: 'contract.uid', style:'text-align: left;',colspan: 1,rowspan:'2' },
      // {id: 5,header: 'contract.connect', style: 'text-align: left',colspan: 1,rowspan:'2'},
      // {id: 6,header: 'contract.time.create', style:'text-align: left',colspan: 1,rowspan:'2'},
      {
        id: 7,
        header: 'signing.expiration.date',
        style: 'text-align: left',
        colspan: 1,
        rowspan: '2',
      },
      // {id: 8,header: 'contract.status.v2',style:'text-align:left',colspan: 1,rowspan:'2'},
      // {id: 9,header: 'date.completed', style: 'text-align: left',colspan: 1,rowspan:'2'},
      {
        id: 10,
        header: 'suggest',
        style: 'text-align: center',
        colspan: '5',
        rowspan: 1,
      },
    ];

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
  }
}
