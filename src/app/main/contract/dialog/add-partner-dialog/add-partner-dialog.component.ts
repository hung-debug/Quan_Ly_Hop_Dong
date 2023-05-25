
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { CustomerService } from 'src/app/service/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { TreeTable } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { async } from 'rxjs';


@Component({
  selector: 'app-add-partner-dialog',
  templateUrl: './add-partner-dialog.component.html',
  styleUrls: ['./add-partner-dialog.component.scss']
})
export class AddPartnerDialogComponent implements OnInit {
  type:any;
  isTrue: any = true;

  title: string = '';
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
  isOrgCustomer: boolean = true;
  filter_name: string ='';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService : CustomerService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddPartnerDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) { 

  }

  organization_id_user_login:any;
  orgId:any="";
  ngOnInit(): void {
    this.type = this.data.type;
    this.customerService.getCustomerList().subscribe((res: any) => {
      this.list = res.filter((item: any) => {
          return item.type === this.type; 
      });
      console.log(this.list)
    });
    if(this.type == "ORGANIZATION"){
    this.title = "find.partner.organization";
    this.cols = [
      {header: 'organization.customer.name', style:'text-align: left;', class:'col-md-5' },
      {header: 'tax.code', style:'text-align: left;', class:'col-md-5' },
    ];
  }else if(this.type == "PERSONAL"){
    this.title = "find.partner.personal";
    this.cols=[
      {header: 'personal.customer.name', style:'text-align: left;', class:'col-md-4' },
      {header: 'phone_mail', style:'text-align: left;', class:'col-md-4' },
      {header: 'cardId', style:'text-align: left;', class:'col-md-4'},
    ];
  }

    console.log(this.list)
  }

  autoSearch(event: any){
    this.filter_name=event.target.value;
    this.getCustomerList();
  }


  getCustomerList(){
    if(this.type == "ORGANIZATION"){
    this.customerService.getCustomerList().subscribe((res: any) => {
      // this.list = res.filter((item: any) => {
      //     return item.type === "ORGANIZATION" && item.name.toLowerCase().includes(this.filter_name.toLowerCase());
      // });
      let filterList: any[] = [];
      res.forEach((item: any) => {
        if(item.type === "ORGANIZATION" && item.name.toLowerCase().includes(this.filter_name.toLowerCase())){
          filterList.push(item);
        }
      });

      res.forEach((item: any) => {
        if(item.type === "ORGANIZATION" && item.taxCode.includes(this.filter_name) && !filterList.includes(item)){
          filterList.push(item);
        }
      });
      this.list = filterList;
    });
    }else if(this.type == "PERSONAL"){
      this.customerService.getCustomerList().subscribe((res: any) => {
        let filterList: any[]=[];
        res.forEach((item: any) => {
          if(item.type === "PERSONAL" && item.name.toLowerCase().includes(this.filter_name.toLowerCase())){
            filterList.push(item);
          }
        });

        res.forEach((item: any) => {
          if(item.type === "PERSONAL" && item.phone.includes(this.filter_name) && !filterList.includes(item)){
            filterList.push(item);
          }
        });

        // res.forEach((item: any) => {
        //   if(item.type === "PERSONAL" && item.card_id.includes(this.filter_name) && !filterList.includes(item)){
        //     filterList.push(item);
        //   }
        // });

        this.list = filterList;
      });
    }
  }

  //email:any;
  checkEmailError:boolean;
  onSubmit() {    

  }
}

