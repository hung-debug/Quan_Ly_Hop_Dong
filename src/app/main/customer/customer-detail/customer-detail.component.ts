import { Handler, SignType } from './../../../service/customer.service';
import { ToastService } from './../../../service/toast.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  isOrg = true;
  emaill: string = "email";
  phonee: string = "phone";

  name:String="";
  taxCode:String="";
  signType: SignType[] = [];
  handlers: Handler[] = [];
  id: String;
  orgCustomer: any[] = [];
  type: String;
  ordering: number = 0;
  site: string = "";
  locale: string = "";
  login_by: string = "email";
  email: string = "";
  phone: string = "";
  dropdownButtonText = '';
  card_id = "";

  
  private sub: any;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,

  ) {}

  ngOnInit(): void {
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
      if(this.type === 'organization'){
        this.isOrg = true;
        this.appService.setTitle("organization.customer.detail");
        sessionStorage.setItem('partnerType', 'ORGANIZATION');
        }
        else{
          this.isOrg = false;
          this.appService.setTitle("personal.customer.detail");
          sessionStorage.setItem('partnerType', 'PERSONAL');
        }
      this.id = params['id'];
      this.customerService.getCustomerList().subscribe((res: any) => {
       this.orgCustomer = res.content.filter((item: any) => {
            return item.id.toString() === this.id;
        });
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
        if(this.orgCustomer[0].signType != null){
          this.signType = this.orgCustomer[0].signType;
        } else {
          this.signType = [];
        }
        this.locale = this.orgCustomer[0].locale;
        this.login_by = this.orgCustomer[0].login_by;
        if(this.orgCustomer[0].card_id != null){
          this.card_id = this.orgCustomer[0].card_id;
        }

      });

  })
    //Test
    //     this.sub = this.route.params.subscribe(params => {
    //   this.type = params['type'];
    //   if(this.type === 'organization'){
    //     this.isOrg = true;
    //     this.appService.setTitle("organization.customer.detail");}
    //     else{
    //       this.isOrg = false;
    //       this.appService.setTitle("personal.customer.detail");
    //     }
    //   if(this.isOrg){  
    // this.name = this.customerService.getDataOrgCustomerDemo().name;
    // this.taxCode = this.customerService.getDataOrgCustomerDemo().taxCode;
    // this.handlers = this.customerService.getDataOrgCustomerDemo().handlers;
    // } else if( !this.isOrg){
    //   this.name = this.customerService.getDataPersonalCustomer().name;
    //   this.email = this.customerService.getDataPersonalCustomer().email;
    //   this.phone = this.customerService.getDataPersonalCustomer().phone;
    //   this.signType = this.customerService.getDataPersonalCustomer().signType;
    //   this.login_by = this.customerService.getDataPersonalCustomer().login_by;
    //   this.locale = this.customerService.getDataPersonalCustomer().locale;  
    //   this.card_id = this.customerService.getDataPersonalCustomer().card_id;

  //   }
  // })
    
    
  }

  getSignerHandler(){
    let handlers:Handler[] = this.handlers
    .filter((item: any) => item.role === 'SIGNER')
    .sort((a: any, b: any) => {
      if (a.ordering < b.ordering) {
        return -1;
      }
      if (a.ordering > b.ordering) {
        return 1;
      }
      return 0;
    });
    return handlers;
  }

  getCoordinatorHandler(){
    let handlers:Handler[] = this.handlers
    .filter((item: any) => item.role === 'COORDINATOR')
    .sort((a: any, b: any) => {
      if (a.ordering < b.ordering) {
        return -1;
      }
      if (a.ordering > b.ordering) {
        return 1;
      }
      return 0;
    });
    return handlers;
  }

  getReviewerHandler(){
    let handlers:Handler[] = this.handlers
    .filter((item: any) => item.role === 'REVIEWER')
    .sort((a: any, b: any) => {
      if (a.ordering < b.ordering) {
        return -1;
      }
      if (a.ordering > b.ordering) {
        return 1;
      }
      return 0;
    });
    return handlers;
  }

  getArchiverHandler(){
    let handlers:Handler[] = this.handlers
    .filter((item: any) => item.role === 'ARCHIVER')
    .sort((a: any, b: any) => {
      if (a.ordering < b.ordering) {
        return -1;
      }
      if (a.ordering > b.ordering) {
        return 1;
      }
      return 0;
    }
    );
    return handlers;
  }

  getDataSignCka(data: any) {
    let filter: any[] = []
    if(!data.signType)
    data.signType = [];
    if (data.signType.length>0) {
      filter = data.signType.filter((p: any) => p.id == 1);
    }
    return filter;
  }

  getDataSignUSBToken(data: any) {
    
    let filter: any[] = []
    if(!data.signType)
    data.signType = [];
    if (data.signType.length>0) {
      filter = data.signType.filter((p: any) => p.id == 2);
    }
    return filter;
  }

  getDataSignEkyc(data: any) {
    let filter = []
    if(!data.signType)
    data.signType = [];
    if (data.signType.length>0) {
      filter = data.signType.filter((p: any) => p.id == 5);
    }
    return filter;
  }

  getDataSignHsm(data: any) {
    let filter: any[] = []
    if(!data.signType)
    data.signType = [];
    if (data.signType.length>0) {
      filter = data.signType.filter((p: any) => p.id == 4);
    }
    return filter;
  }

  checkSignType(data: any) {
    if(data.signType != null) {
    if (data.signType.length > 0) {
      return true;
    } else {
      return false;
    }} else return false;
  }

  onCancel(){
    this.router.navigate(['/main/customer'])
  }

}
