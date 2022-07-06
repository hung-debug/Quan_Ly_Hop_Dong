import { Component, OnInit } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminDeleteUserComponent } from './admin-delete-user/admin-delete-user.component';
import { AdminDetailUserComponent } from './admin-detail-user/admin-detail-user.component';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent implements OnInit {
  constructor(
    private appService: AppService,
    private adminUserService: AdminUserService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  name: any = '';
  email: any = '';
  phone: any = '';
  cols: any[];
  orgList: any[] = [];
  orgListTmp: any[] = [];

  addUserRole: boolean = false;
  searchUserRole: boolean = false;
  infoUserRole: boolean = false;
  editUserRole: boolean = false;

  adminUserRole: boolean = true;

  permissions: any;
  totalRecords: number;
  loading: boolean;
  list: any[];
  page: number = 0;

  rows: number;

  ngOnInit(): void {
    this.rows = 20;
    this.permissions = JSON.parse(
      localStorage.getItem('currentAdmin') || ''
    ).user.permissions;

    if(this.permissions[0].code.includes('QLTB')) {
      console.log("vao qltb");
      this.adminUserRole = false;

      this.appService.setTitle('');
    } else {
      this.addUserRole = this.checkRole(this.addUserRole, 'QLND_01');
      this.searchUserRole = this.checkRole(this.searchUserRole, 'QLND_03');
      this.infoUserRole = this.checkRole(this.infoUserRole, 'QLND_04');
      this.editUserRole = this.checkRole(this.editUserRole, 'QLND_02');

      this.appService.setTitle('user.list');
    }

    console.log('qlnd 02');
    console.log(this.addUserRole);

    // this.searchUser();

    this.cols = [
      { header: 'user.name', style: 'text-align: left;' },
      { header: 'user.email', style: 'text-align: left;' },
      { header: 'user.phone', style: 'text-align: left;' },
    ];

    if (this.editUserRole === true) {
      this.cols.push({
        header: 'unit.manage',
        style: 'text-align: center;',
      });
    }
  }

  checkRole(flag: boolean, code: string) {
    console.log('length ', this.permissions.length);

    console.log('permission ', this.permissions);

    const selectedRoleConvert: { code: any }[] = [];

    this.permissions.forEach((key: any) => {
      let jsonData = { code: key.code, name: key.name };
      selectedRoleConvert.push(jsonData);
    });

    for (let i = 0; i < selectedRoleConvert.length; i++) {
      let role = selectedRoleConvert[i].code;

      if (role.includes(code)) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  searchUser() {
    this.adminUserService
      .getUserList(this.name, this.email, this.phone, 0, this.rows)
      .subscribe((response) => {
        this.list = response.entities;
        this.totalRecords = response.total_elements;
      });
  }

  loadUser(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.adminUserService
        .getUserList(
          this.name,
          this.email,
          this.phone,
          this.page,
          this.rows
        )
        .subscribe((res) => {
        
          this.list = res.entities;

          this.totalRecords = res.total_elements;
          this.loading = false;
        });
    }, 1000);

    this.page = JSON.parse(JSON.stringify(event)).first / 20;
  }

  addUser() {
    const data = {
      title: 'THÊM MỚI NGƯỜI DÙNG',
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUserComponent, {
      width: '620px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  editUser(id: any) {
    const data = {
      title: 'CẬP NHẬT NGƯỜI DÙNG',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUserComponent, {
      width: '620px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      console.log("result ",result);

      console.log('the close dialog');

      
    });
  }

  detailUser(id: any) {
    if (this.infoUserRole === true) {
      const data = {
        title: 'THÔNG TIN NGƯỜI DÙNG',
        id: id,
      };
      // @ts-ignore
      const dialogRef = this.dialog.open(AdminDetailUserComponent, {
        width: '620px',
        backdrop: 'static',
        keyboard: false,
        data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        let is_data = result;
      });
    }
  }

  deleteUser(id: any) {
    const data = {
      title: 'XÓA NGƯỜI DÙNG',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDeleteUserComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }
}
