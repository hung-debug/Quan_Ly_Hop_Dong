import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminActiveUnitComponent } from './admin-active-unit/admin-active-unit.component';
import { AdminAddUnitComponent } from './admin-add-unit/admin-add-unit.component';
import { AdminDetailUnitComponent } from './admin-detail-unit/admin-detail-unit.component';

@Component({
  selector: 'app-admin-unit',
  templateUrl: './admin-unit.component.html',
  styleUrls: ['./admin-unit.component.scss'],
})
export class AdminUnitComponent implements OnInit {
  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private adminUnitService: AdminUnitService,
    private adminUserService: AdminUserService,
    private toastService: ToastService
  ) {}

  code: any = '';
  name: any = '';
  list: any[];
  listData: any[];
  cols: any[];
  files: any[];
  test: any;
  total: any;
  orgId: any;
  isAdmin: boolean = false;
  adminUnit: boolean = true;

  addUnitRole: boolean = false;
  searchUnitRole: boolean = false;

  ngOnInit(): void {
    this.addUnitRole = this.checkRole(this.addUnitRole, 'QLTC_01');
    this.searchUnitRole = this.checkRole(this.searchUnitRole,'QLTC_03');

    const permissions =  JSON.parse(localStorage.getItem('currentAdmin') || '').user.permissions;

    if(permissions.length === 1 && permissions[0].code.includes("QLTB")) {
      console.log("vao day");
      this.adminUnit = false;
      this.appService.setTitle('');
    } else {
      this.appService.setTitle('unit.list')
    };
    this.searchUnit();

    this.cols = [
      { field: 'name', header: 'unit.name', style: 'text-align: left;' },
      { field: 'code', header: 'unit.code', style: 'text-align: left;' },
      { field: 'phone', header: 'Số điện thoại', style: 'text-align: left;' },
      { field: 'active', header: 'Kích hoạt', style: 'text-align: left;' },
      { field: 'email', header: 'Email đăng ký', style: 'text-align: left;' },
      { field: 'id', header: 'unit.manage', style: 'text-align: center;' },
    ];
  }
  checkRole(flag: boolean, code: string): boolean {
    const permissions = JSON.parse(localStorage.getItem('currentAdmin') || '')
      .user.permissions;

    const selectedRoleConvert: { code: any }[] = [];

    permissions.forEach((key: any) => {
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

  array_empty: any = [];

  //Tìm kiếm tổ chức
  searchUnit() {
    this.adminUnitService
      .getUnitList(this.code, this.name)
      .subscribe((response) => {
        this.listData = response.entities;
        this.total = this.listData.length;
      });
  }

  //Thêm mới tổ chức
  addUnit() {
    const data = {
      title: 'unit.add',
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  editUnit(id: any) {
    const data = {
      title: 'unit.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  detailUnit(id: any) {
    const data = {
      title: 'unit.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDetailUnitComponent, {
      width: '80%',
      height: '80%',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  activeUnit(id: any) {
    const data = {
      title: 'KÍCH HOẠT TỔ CHỨC',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminActiveUnitComponent, {
      width: '400px',
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
