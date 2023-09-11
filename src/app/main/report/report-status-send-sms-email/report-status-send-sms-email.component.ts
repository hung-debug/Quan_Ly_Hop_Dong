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
  optionsStatus: any = [];
  contractStatus: any;
  orgName: any;
  Arr = Array;

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
  }

  convertTime(time: any,code?: any) {
    return moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") != 'Invalid date' ? moment(time, "YYYY/MM/DD").format("DD/MM/YYYY") : "" ;
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

  export(flag: boolean) {

  }
}
