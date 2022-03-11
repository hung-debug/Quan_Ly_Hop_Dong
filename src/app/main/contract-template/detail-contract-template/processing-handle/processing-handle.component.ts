import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-processing-handle',
  templateUrl: './processing-handle.component.html',
  styleUrls: ['./processing-handle.component.scss']
})
export class ProcessingHandleComponent implements OnInit {

  is_list_name: any = [];
  status: any = [
    {
      value: 0,
      name: 'Tạm dừng'
    },
    {
      value: 1,
      name: 'Hoạt động'
    }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      is_data_contract: any,
      content: any},
    public router: Router,
    public dialog: MatDialog,
    // public name: LoginComponent
  ) {
  }

  userViews:any="";
  userSigns:any="";
  userDocs:any="";
  countPartnerLeads:any=0;
  countPartnerViews:any=0;
  countPartnerSigns:any=0;
  countPartnerDocs:any=0;
  listPartner:any=[];
  isOrg:boolean = true;

  connUserView:any="";
  connUserSign:any="";
  connUserDoc:any="";
  ngOnInit(): void {
    console.log(this.data.is_data_contract.participants);
    this.data.is_data_contract.participants.forEach((item: any) => {

      if(item.type==1){
        item.recipients.forEach((element: any) => {
          if(element.role == 2){
            this.userViews += this.connUserView + element.name + " - " + element.email;
            this.connUserView = "<br>";
          }
          if(element.role == 3){
            this.userSigns += this.connUserSign + element.name + " - " + element.email;
            this.connUserSign = "<br>";
          }
          if(element.role == 4){
            this.userDocs += this.connUserDoc + element.name + " - " + element.email;
            this.connUserDoc = "<br>";
          }
        })
      }else{
        if(item.type==2){
          this.isOrg = true;
        }
        item.recipients.forEach((element: any) => {
          if(element.role == 1){
            this.countPartnerLeads++;
          }
          if(element.role == 2){
            this.countPartnerViews++;
          }
          if(element.role == 3){
            this.countPartnerSigns++;
          }
          if(element.role == 4){
            this.countPartnerDocs ++;
          }
        })
      }
    })
    console.log(this.is_list_name)
  }

  getStatus(status: any) {
    if (status == 1) {
      return 'Hoạt động';
    } else if (status == 0) {
      return 'Tạm dừng';
    }
  }

  checkStatusUser(status: any, role: any) {
    let res = '';
    if (status == 3) {
      return 'Đã từ chối';
    }
    if (status == 0) {
      res += 'Chưa ';
    } else if (status == 1) {
      res += 'Đang ';
    } else if (status == 2) {
      res += 'Đã ';
    }
    if (role == 1) {
      res +=  'điều phối';
    } else if (role == 2) {
      res +=  'xem xét';
    } else if (role == 3) {
      res +=  'ký';
    } else if (role == 4) {
      res =  res + ' đóng dấu';
    }
    return res;
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
