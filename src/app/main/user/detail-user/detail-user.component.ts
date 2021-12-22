import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  name:any="";
  email:any="";
  birthday:any="";
  phone:any="";
  organizationId:any="";
  role:any="";
  status:any="";

  phoneKpi:any="";
  networkKpi:any="";

  nameHsm:any="";
  imgSignPCSelect:any

  action: string;
  private sub: any;
  id:any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];

  datas: any;

  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private route: ActivatedRoute,
    public router: Router,
    ) {
     }

  ngOnInit(): void {
    this.appService.setTitle('THÔNG TIN NGƯỜI DÙNG');
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.userService.getUserById(this.id).subscribe(
        data => {
          console.log(data);
          this.name = data.name;
          this.email = data.email;
          this.birthday = data.birthday;
          this.phone = data.phone;
          this.organizationId = data.organization_id;
          this.role = data.type_id;
          this.status = data.status;

          this.phoneKpi = data.phone_sign; 
          this.networkKpi = data.phone_tel;

          this.nameHsm = data.hsm_name;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )

    });    
  }

  onCancel(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user']);
    });
  }
}
