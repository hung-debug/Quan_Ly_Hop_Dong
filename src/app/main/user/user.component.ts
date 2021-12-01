import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  name:any;
  email:any;
  phone:any;
  birthday:any;
  organization_id:any;

  phoneKpi:any;
  networkKpi:any;

  nameHsm:any;

  constructor(private appService: AppService,
    private toastService : ToastService,) { }

  ngOnInit(): void {
    this.appService.setTitle("user.information");

    this.name = JSON.parse(localStorage.getItem('currentUser')||'').customer.name;
    this.email = JSON.parse(localStorage.getItem('currentUser')||'').customer.email;
    this.phone = JSON.parse(localStorage.getItem('currentUser')||'').customer.phone;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser')||'').customer.organization_id;
  }

  updateInforUser(){
    this.toastService.showSuccessHTMLWithTimeout("Cập nhật thông tin thành công!", "", 10000);
  }

  updateSignFileImageUser(){
    this.toastService.showSuccessHTMLWithTimeout("Cập nhật file chữ ký ảnh thành công!", "", 10000);
  }

  updateSignKpiUser(){
    this.toastService.showSuccessHTMLWithTimeout("Cập nhật chữ ký KPI thành công!", "", 10000);
  }

  updateSignHsmUser(){
    this.toastService.showSuccessHTMLWithTimeout("Cập nhật chữ ký HSM thành công!", "", 10000);
  }

}
