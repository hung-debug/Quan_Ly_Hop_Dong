import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import {roleList} from "../../../config/variable";

@Component({
  selector: 'app-detail-role',
  templateUrl: './detail-role.component.html',
  styleUrls: ['./detail-role.component.scss']
})
export class DetailRoleComponent implements OnInit {

  name:any="";
  code:any="";
  role:any="";
  groupedRole: SelectItemGroup[];
  selectedRoleConvert: any = [];
  selectedRole: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DetailRoleComponent>,
    public router: Router,
    public dialog: MatDialog,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.roleService.getRoleById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.name = data.name,
        this.code = data.code,
        this.role = data.role,  
        this.selectedRole = this.convertRoleArr(data.permissions)
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    ); 

    this.groupedRole = roleList;
  }

  convertRoleArr(roleArr:[]){
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });
    return roleArrConvert;
  }

}
