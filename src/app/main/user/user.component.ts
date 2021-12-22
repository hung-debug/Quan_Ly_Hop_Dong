import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { ToastService } from 'src/app/service/toast.service';
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
    private router : Router,) { }

  organization_id:any = "";
  email:any = "";
  list: any[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH TỔ CHỨC");
    this.searchUser();

    this.cols = [
      { field: 'name', header: 'Họ và tên', style:'text-align: left;' },
      { field: 'email', header: 'Email', style:'text-align: left;' },
      { field: 'phone', header: 'Số điện thoại', style:'text-align: left;' },
      { field: 'organization_id', header: 'Tổ chức', style:'text-align: left;' },
      { field: 'status', header: 'Trạng thái', style:'text-align: left;' },
      { field: 'type_id', header: 'Vai trò', style:'text-align: left;' },
      { field: 'id', header: 'Quản lý', style:'text-align: center;' },
      ];
  }

  searchUser(){
    this.userService.getUserList(this.organization_id, this.email).subscribe(response => {
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
