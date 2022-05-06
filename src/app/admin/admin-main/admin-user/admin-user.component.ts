import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  constructor(private appService: AppService,
    private adminUserService: AdminUserService,
    private adminUnitService: AdminUnitService,
    private router : Router,
    private toastService: ToastService) { }

  organization_id_user_login:any;
  organization_id:any = "";
  name:any="";
  email:any="";
  phone:any="";
  list: any[];
  cols: any[];
  orgList: any[] = [];
  orgListTmp: any[] = [];

  //phan quyen
  isQLND_01:boolean=true;  //them moi nguoi dung
  isQLND_02:boolean=true;  //sua nguoi dung
  isQLND_03:boolean=true;  //tim kiem nguoi dung
  isQLND_04:boolean=true;  //xem thong tin chi tiet nguoi dung

  ngOnInit(): void {
    this.appService.setTitle("user.list");
    //lay id user
    //mac dinh se search theo ma to chuc minh
    this.organization_id = this.organization_id_user_login;

    this.searchUser();

    this.cols = [
      {header: 'user.name', style:'text-align: left;' },
      {header: 'user.email', style:'text-align: left;' },
      {header: 'user.phone', style:'text-align: left;' },
      {header: 'unit.name', style:'text-align: left;' },
      {header: 'unit.status', style:'text-align: left;' },
      {header: 'menu.role.list', style:'text-align: left;' },
      {header: 'unit.manage', style:'text-align: center;' },
    ];
  }

  searchUser(){
    console.log(this.organization_id);
    this.adminUserService.getUserList(this.name, this.email, this.phone).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });
  }

  addUser() {
    this.router.navigate(['/admin-main/form-user/add']);
  }

  editUser(id:any) {
    this.router.navigate(['/admin-main/form-user/edit/' + id]);
  }

  detailUser(id:any) {
    this.router.navigate(['/admin-main/user-detail/' + id]);
  }
}
