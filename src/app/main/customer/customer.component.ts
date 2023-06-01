import { CustomerService } from './../../service/customer.service';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/service/toast.service';
import { Subscription } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';


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
  isDelete: boolean = false;

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
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
  ) {

    this.stateOptions = [
      { label: 'organization.customer', value: 'off' },
      { label: 'personal.customer', value: 'on' },
    ];
  }

  ngOnInit() {
    if(sessionStorage.getItem('partnerType') == null)
    sessionStorage.setItem('partnerType', 'ORGANIZATION')
    if(sessionStorage.getItem('partnerType') == 'PERSONAL'){
      this.isOrgCustomer = false;
      this.changeTab();
      this.getCustomerList();
      this.isOrg = 'on';
    } else if(sessionStorage.getItem('partnerType') == 'ORGANIZATION'){
      this.isOrgCustomer = true;
      this.changeTab();
      this.getCustomerList();
      this.isOrg = 'off';
    }
    this.appService.setTitle("customer.list");
    // this.customerService.getCustomerList().subscribe((res: any) => {
    //   this.list = res.filter((item: any) => {
    //       return item.type === sessionStorage.getItem('partnerType'); 
    //   });
    //   this.spinner.hide();
    // });
    // this.cols = [
    //   {header: 'organization.customer.name', style:'text-align: left;', class:'col-md-5' },
    //   {header: 'tax.code', style:'text-align: left;', class:'col-md-5' },
    //   {header: '', style:'text-align: center;',class:'col-md-2' },
    // ];


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
      this.list = filterList.sort(
        (a, b) => (a.id > b.id ? 1 : -1)
      );
    });
    }else if(!this.isOrgCustomer){
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

        res.forEach((item: any) => {
          if(item.card_id != null)
          if(item.type === "PERSONAL" && item.card_id.includes(this.filter_name) && !filterList.includes(item)){
            console.log(item);
            filterList.push(item);
          }
        });
        this.list = filterList.sort(
          (a, b) => (a.id > b.id ? 1 : -1)
        );
      });
    }
  }

  changeTab(){
    if(!this.isOrgCustomer){
      sessionStorage.setItem('partnerType', 'PERSONAL')
    this.cols=[
      {header: 'personal.customer.name', style:'text-align: left;', class:'col-md-2' },
      {header: 'user.phone', style:'text-align: left;', class:'col-md-3' },
      {header: 'user.email', style:'text-align: left;', class:'col-md-3'},
      {header: 'cardId', style:'text-align: left;', class:'col-md-2'},
      {header: '', style:'text-align: center;', class:'col-md-2' },
    ]}
    else if(this.isOrgCustomer){
      sessionStorage.setItem('partnerType', 'ORGANIZATION')
      this.cols = [
        {header: 'organization.customer.name', style:'text-align: left;', class:'col-md-5' },
        {header: 'tax.code', style:'text-align: left;', class:'col-md-5' },
        {header: '', style:'text-align: center;', class:'col-md-2' },
      ];
    }
    console.log(this.isOrgCustomer);
  }

  personalAdd(){
    this.router.navigate(['/main/form-customer/add/personal']);
  }

  organizationAdd(){
    this.router.navigate(['/main/form-customer/add/organization']);
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

  editCustomer(id: any, isOrgCustomer: boolean){
    if(isOrgCustomer){
    this.router.navigate(['/main/form-customer/edit/organization', id])
  }else {
    this.router.navigate(['/main/form-customer/edit/personal', id])
  }
}

  deleteCustomer(id:any) {
    const data = {
      title: 'customer.delete',
      id: id,
      isOrg: this.isOrgCustomer
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
      this.getCustomerList();
    })
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
    if(this.isOrgCustomer){
      return 'org.partner.search.name.placeholder';
    }else {
      return 'personal.partner.search.name.placeholder';
    }
  }

  openDetail(id: String, type: String){
    if(type === "ORGANIZATION")
    this.router.navigate(['/main/info-customer/organization', id]);
    if(type === "PERSONAL")
    this.router.navigate(['/main/info-customer/personal', id]);
  }

  ngOnDestroy(): void {
    if(this.isDelete == false)
    sessionStorage.removeItem('partnerType');
    console.log("destroy")
  }

}
