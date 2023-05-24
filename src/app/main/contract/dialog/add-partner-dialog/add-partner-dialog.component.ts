
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { SelectItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-add-partner-dialog',
  templateUrl: './add-partner-dialog.component.html',
  styleUrls: ['./add-partner-dialog.component.scss']
})
export class AddPartnerDialogComponent implements OnInit {
  type:any;
  datas: any;
  isTrue: any = true;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  userList: Array<any> = [];
  submittedUser = false;

  isList: string = 'off';
  stateOptions: any[];
  cols: any[]; 
  list: any[] = [];
  orgListTmp:any[] = [];
  isOrg: string = 'off';
  isOk: any = true;

  constructor(
    private primeNGConfig: PrimeNGConfig,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddPartnerDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
  ) { 
    this.stateOptions = [
      { label: 'Chia sẻ', value: 'off' },
      { label: 'Danh sách', value: 'on' },
    ];
  }

  organization_id_user_login:any;
  orgId:any="";
  ngOnInit(): void {
    this.isOk=true;
    
      this.cols = [
        {header: 'Email đã chia sẻ', style:'text-align: left;' },
        {header: 'Tổ chức', style:'text-align: left;' },
        {header: 'role.manage', style:'text-align: center;' },
        ];
    
  }

  //email:any;
  checkEmailError:boolean;
  onSubmit() {    

  }
}

