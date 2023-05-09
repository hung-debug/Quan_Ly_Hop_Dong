import { CustomerService } from './../../service/customer.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/service/toast.service';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  isOrg: string = 'off';
  stateOptions: any[];
  organization_id: any = "";
  isOrgCustomer: boolean = true;

  code:any = "";
  name:any = "";
  list: any[] = [];
  cols: any[];

    //filter customer
    searchObj: any = {
      filter_name: "",
      taxCode: "",
      phone: "",
      email: ""
    }
    filter_name: string = "";
    message: any;
    subscription: Subscription;
    roleMess: any = "";

  constructor(private appService: AppService,
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {

    this.stateOptions = [
      { label: 'organization.customer', value: 'off' },
      { label: 'personal.customer', value: 'on' },
    ];
  }

  ngOnInit() {
    this.appService.setTitle("customer.list");

    this.cols = [
      {header: 'organization.customer.name', style:'text-align: left;' },
      {header: 'tax.code', style:'text-align: left;' },
      {header: '', style:'text-align: center;' },
    ];

    this.customerService.getCustomerList().subscribe((res: any) => {
      this.list = res.filter((item: any) => {
          return item.type === "ORGANIZATION"; 
      });
    });
  }

  autoSearch(event: any){
    this.filter_name=event.target.value;
    this.getCustomerList();
  }

  searchContract(){

  }

  getCustomerList(){
    if(this.isOrgCustomer){
    this.customerService.getCustomerList().subscribe((res: any) => {
      this.list = res.filter((item: any) => {
          return item.type === "ORGANIZATION" && item.name.toLowerCase().includes(this.filter_name.toLowerCase());
      });
    });
    }else if(!this.isOrgCustomer){
      this.customerService.getCustomerList().subscribe((res: any) => {
        this.list = res.filter((item: any) => {
            return item.type === "PERSONAL" && item.name.toLowerCase().includes(this.filter_name.toLowerCase());
        });
      });
    }
  }

  changeTab(){
    if(!this.isOrgCustomer){
    this.cols=[
      {header: 'personal.customer.name', style:'text-align: left;' },
      {header: 'phone_mail', style:'text-align: left;' },
      {header: '', style:'text-align: center;' },
    ]}
    else if(this.isOrgCustomer){
      this.cols = [
        {header: 'organization.customer.name', style:'text-align: left;' },
        {header: 'tax.code', style:'text-align: left;' },
        {header: '', style:'text-align: center;' },
      ];
    }
    console.log(this.isOrgCustomer);
  }

  personalAdd(){
    this.router.navigate(['/main/form-customer/customer-personal-add']);
  }

  organizationAdd(){
    this.router.navigate(['/main/form-customer/customer-organization-add']);
  }

  onSelect(e: any) {
    const selectedOption = e.value; // value of the selected option
    const selectedLabel = this.stateOptions.find(option => option.value === selectedOption).label; // label of the selected option
    if(selectedLabel=='organization.customer'){
      this.isOrgCustomer = true;
      this.changeTab();
      this.getCustomerList();
    }
    else if(selectedLabel=='personal.customer'){
      this.isOrgCustomer = false;
      this.changeTab();
      this.getCustomerList();
      console.log(this.list);
    }
  }

  deleteCustomer(id:any) {
    const data = {
      title: 'role.delete',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteCustomerComponent, {
      width: '450px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  openDetail(id: String, type: String){
    if(type === "ORGANIZATION")
    this.router.navigate(['/main/form-customer/customer-detail/organization', id]);
    if(type === "PERSONAL")
    this.router.navigate(['/main/form-customer/customer-detail/personal', id]);
  }


}
