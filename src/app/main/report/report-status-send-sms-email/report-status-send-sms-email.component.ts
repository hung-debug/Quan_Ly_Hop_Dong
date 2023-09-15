import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { InputTreeService } from 'src/app/service/input-tree.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { ReportService } from '../report.service';
import { Table } from 'primeng/table';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report-status-send-sms-email',
  templateUrl: './report-status-send-sms-email.component.html',
  styleUrls: ['./report-status-send-sms-email.component.scss'],
})

export class ReportStatusSendSmsEmailComponent implements OnInit {
  currentUser: any;
  selectedNodeOrganization: any;
  listOrgCombobox: any;
  date: any;
  list: any[] = [];
  cols: any[];
  typeList: Array<any> = [];
  inforContract: any;
  optionsStatusContract: any = [];
  optionsStatusProcess: any = [];
  contractStatus: any;
  orgName: any;
  Arr = Array;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;

  constructor(
    private appService: AppService,
    private inputTreeService: InputTreeService,
    private userService: UserService,

    private reportService: ReportService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,

    private contractService: ContractService,
    private contractTypeService: ContractTypeService
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
  }


  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    this.appService.setTitle('role.report.history.send.sms.email');

    this.optionsStatusContract = [
      { id: 20, name: 'Đang thực hiện' },
      { id: 2, name: 'Quá hạn' },
      { id: 31, name: 'Từ chối' },
      { id: 32, name: 'Huỷ bỏ' },
      { id: 30, name: 'Hoàn thành' },
    ];

    this.optionsStatusProcess = [
      { id: 2, name: 'Đã ký' },
      { id: 1, name: 'Đang ký' },
    ];

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';

      this.optionsStatusContract = [
        { id: 20, name: 'Processing' },
        { id: 2, name: 'Overdue' },
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

    this.setColForTable();

    this.getTypeListContract(this.currentUser.organizationId);
  }

  convertTime(time: any, code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "";
  }

  changeOrg() {
    this.getTypeListContract(this.selectedNodeOrganization.data);
  }

  async getTypeListContract(typeId?: number) {
    const inforType = await this.contractTypeService
      .getContractTypeList('', '', typeId)
      .toPromise();
    this.typeList = inforType;
  }

  setColForTable() {
    this.cols = [
      {
        header: 'code.contract',
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
        header: 'created.name',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'report.status.contract',
        style: 'text-align: left;',
        colspan: 1,
        rowspan: 1,
      },
      {
        header: 'report.processing.status.contract',
        style: 'text-align: left',
        colspan: 1,
        rowspan: 1,
      },
    ];
  }

  export(flag: boolean) {

  }
}
