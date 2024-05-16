
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
  isOrgCustomer: boolean = true;
  filter_name: string ='';
  isFirstFilter: boolean = true;
  firstList: any[] = [];

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
      {header: 'personal.customer.name', style:'text-align: left;', class:'col-md-3'},
      {header: 'user.phone', style:'text-align: left;', class:'col-md-3'},
      {header: 'user.email', style:'text-align: left;', class:'col-md-3'},
      {header: 'cardId', style:'text-align: left;', class:'col-md-3'},
    ];
  }

    
  }

  autoSearch(event: any){
    this.filter_name=event.target.value;
    this.getCustomerList();
  }


  getCustomerList(){
    if(this.isFirstFilter){
      this.firstList = this.list;
      this.isFirstFilter = false;
    }

    if(this.type == "ORGANIZATION"){
      // this.list = res.filter((item: any) => {
      //     return item.type === "ORGANIZATION" && item.name.toLowerCase().includes(this.filter_name.toLowerCase());
      // });
      let filterList: any[] = [];
      this.firstList.forEach((item: any) => {
        if(item.type === "ORGANIZATION" && item.name.toLowerCase().includes(this.filter_name.toLowerCase())){
          filterList.push(item);
        }
      });

      this.firstList.forEach((item: any) => {
        if(item.type === "ORGANIZATION" && item.taxCode.includes(this.filter_name) && !filterList.includes(item)){
          filterList.push(item);
        }
      });
      if(filterList.length>0)
      this.list = filterList.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name);
      });
    
    } 
    if(this.type == "PERSONAL"){
        let filterList: any[]=[];
        this.firstList.forEach((item: any) => {
          if(item.type === "PERSONAL" && item.name.toLowerCase().includes(this.filter_name.toLowerCase())){
            
            filterList.push(item);
          }
        });

        this.firstList.forEach((item: any) => {
          if(item.type === "PERSONAL" && item.phone.includes(this.filter_name) && !filterList.includes(item)){
            
            filterList.push(item);
          }
        });

        this.firstList.forEach((item: any) => {
          if(item.card_id != null)
          if(item.type === "PERSONAL" && item.card_id.includes(this.filter_name) && !filterList.includes(item)){
            
            filterList.push(item);
          }
        });
        if(filterList.length>0)
        this.list = filterList.sort((a: any, b: any) => {
          return a.name.localeCompare(b.name);
        });
    }
  }

  getMailOrPhone(item: any){
    let value = '';
    if(item.email && item.phone){
      return item.email + '/ ' + item.phone;
    }
    if(item.phone){
      value = item.phone;
    }
    if(item.email){
      value = item.email;
    }
    return value;
  }

  getPlaceholderFind(){
    if(this.type == "ORGANIZATION"){
      return 'org.partner.search.name.placeholder';
    }else {
      return 'personal.partner.search.name.placeholder';
    }
  }

  //email:any;
  checkEmailError:boolean;
  onSubmit() {    

  }

  choosePartner(item:any){
    
    this.dialogRef.close(item);
  }
}

