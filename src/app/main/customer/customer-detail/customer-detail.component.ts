import { Handler } from './../../../service/customer.service';
import { ToastService } from './../../../service/toast.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  isOrg = true;
  name:String="";
  email:String="";
  phone:String="";
  taxCode:String="";
  signType: any = {};
  handlers: Handler[] = [];
  id: String;
  orgCustomer: any[] = [];
  type: String;
  
  private sub: any;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,

  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
      if(this.type === 'organization'){
        this.isOrg = true;
        this.appService.setTitle("organization.customer.detail");}
        else{
          this.isOrg = false;
          this.appService.setTitle("personal.customer.detail");
        }
      this.id = params['id'];
      this.customerService.getCustomerList().subscribe((res: any) => {
       this.orgCustomer = res.filter((item: any) => {
            return item.id.toString() === this.id;
        });
        console.log(this.orgCustomer);
        this.name = this.orgCustomer[0].name;
        if(this.orgCustomer[0].taxCode != null){
          this.taxCode = this.orgCustomer[0].taxCode;
        }
        if(this.orgCustomer[0].email != null){
          this.email = this.orgCustomer[0].email;
        }
        if(this.orgCustomer[0].phone != null){
          this.phone = this.orgCustomer[0].phone;
        }
        if(this.orgCustomer[0].handlers != null){
          this.handlers = this.orgCustomer[0].handlers;
        }
      });

  })
  }

  getSignerHandler(){
    return this.handlers
    .filter((item: any) => item.role === 'signer')
    .sort((a: any, b: any) => {
      if (a.ordering < b.ordering) {
        return -1;
      }
      if (a.ordering > b.ordering) {
        return 1;
      }
      return 0;
    });

  }

  onCancel(){
    this.router.navigate(['/main/customer'])
  }

}
