import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminDeleteUserComponent } from './admin-delete-user/admin-delete-user.component';

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
    private dialog: MatDialog,
    private toastService: ToastService) { }

  name:any="";
  email:any="";
  phone:any="";
  list: any[];
  cols: any[];
  orgList: any[] = [];
  orgListTmp: any[] = [];

  ngOnInit(): void {
    this.appService.setTitle("user.list");
    this.searchUser();

    this.cols = [
      {header: 'user.name', style:'text-align: left;' },
      {header: 'user.email', style:'text-align: left;' },
      {header: 'user.phone', style:'text-align: left;' },
      {header: 'unit.manage', style:'text-align: center;' },
    ];
  }

  searchUser(){
    this.adminUserService.getUserList(this.name, this.email, this.phone).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });
  }

  addUser() {
    const data = {
      title: 'THÊM MỚI NGƯỜI DÙNG'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUserComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  editUser(id:any) {
    const data = {
      title: 'CẬP NHẬT NGƯỜI DÙNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUserComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  detailUser(id:any) {
    this.router.navigate(['/admin-main/user-detail/' + id]);
  }

  deleteUser(id:any) {
    const data = {
      title: 'XÓA NGƯỜI DÙNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDeleteUserComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }
}
