import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { AddUserComponent } from './add-user/add-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private userService: UserService,
    private unitService: UnitService,
    private router : Router,) { }

  organization_id:any = "";
  email:any = "";
  list: any[];
  cols: any[];
  orgList: Array<any> = [];

  isQLND_01:boolean=true;  //them moi nguoi dung
  isQLND_02:boolean=true;  //sua nguoi dung
  isQLND_03:boolean=true;  //tim kiem nguoi dung
  isQLND_04:boolean=true;  //xem thong tin chi tiet nguoi dung

  ngOnInit(): void {
    this.appService.setTitle("user.list");
    this.searchUser();

    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgList = data.entities;
    });

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
    this.userService.getUserList(this.organization_id==null?"":this.organization_id, this.email).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });
  }

  addUser() {
    this.router.navigate(['/main/form-user/add']);
  }

  editUser(id:any) {
    this.router.navigate(['/main/form-user/edit/' + id]);
  }

  detailUser(id:any) {
    this.router.navigate(['/main/user-detail/' + id]);
  }
}
