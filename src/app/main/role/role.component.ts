import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { RoleService } from 'src/app/service/role.service';
import { AddRoleComponent } from './add-role/add-role.component';
import {DetailRoleComponent} from './detail-role/detail-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private roleService: RoleService) { }

  code:any = "";
  name:any = "";
  list: any[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH VAI TRÒ");
    this.searchRole();

    this.cols = [
      { field: 'name', header: 'Tên vai trò', style:'text-align: left;' },
      { field: 'code', header: 'Mã vai trò', style:'text-align: left;' },
      { field: 'role', header: 'Chức năng vai trò', style:'text-align: left;' },
      { field: 'id', header: 'Quản lý', style:'text-align: center;' },
      ];
  }

  searchRole(){
    this.roleService.getRoleList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response;
      console.log(this.list);
    });
  }

  addRole() {
    const data = {
      title: 'THÊM MỚI VAI TRÒ'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddRoleComponent, {
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

  editRole(id:any) {
    const data = {
      title: 'CẬP NHẬT THÔNG TIN VAI TRÒ',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddRoleComponent, {
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

  detailRole(id:any) {
    const data = {
      title: 'THÔNG TIN VAI TRÒ',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailRoleComponent, {
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
}
