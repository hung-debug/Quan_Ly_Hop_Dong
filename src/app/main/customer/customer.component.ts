import { UploadService } from 'src/app/service/upload.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';

import { ToastService } from 'src/app/service/toast.service';
import {  HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
import { DialogReasonCancelComponent } from '../contract-signature/shared/model/dialog-reason-cancel/dialog-reason-cancel.component';
import { ContractSignatureService } from '../../service/contract-signature.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  action: string;
  status: string;
  type: string;
  private sub: any;
  public contracts: any[] = [];
  p: number = 1;
  page: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';

  title: any = "";
  id: any = "";
  notification: any = "";
  isOrg: string = 'off';
  stateOptions: any[];
  organization_id: any = "";

  code:any = "";
  name:any = "";
  list: any[] = [];
  cols: any[];

    //filter contract
    searchObj: any = {
      filter_name: "",
      partner: ""
    }
    filter_name: any = "";
    filter_type: any = "";
    filter_status: any = "";
    message: any;
    subscription: Subscription;
    roleMess: any = "";

  constructor(private appService: AppService,
    private contractService: ContractService,
    private ContractSignatureService: ContractSignatureService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private roleService: RoleService,
    private datePipe: DatePipe
  ) {

    this.stateOptions = [
      { label: 'personal.customer', value: 'off' },
      { label: 'organization.customer', value: 'on' },
    ];
  }

  ngOnInit() {
    this.appService.setTitle("customer.list");

    this.cols = [
      {header: 'organization.customer.name', style:'text-align: left;' },
      {header: 'tax.code', style:'text-align: left;' },
      {header: '', style:'text-align: center;' },
    ];
  }

  autoSearch(e: any){

  }

  searchContract(){

  }

  changeTab(){
    this.cols=[
      {header: 'personal.customer.name', style:'text-align: left;' },
      {header: 'phone_mail', style:'text-align: left;' },
      {header: '                                           ', style:'text-align: center;' },
    ]
  }



}
