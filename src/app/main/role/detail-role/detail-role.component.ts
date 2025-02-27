import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import {roleList,roleListParent} from "../../../config/variable";
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';

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
    private userService: UserService,
    private roleService: RoleService) { }

    async ngOnInit(): Promise<void> {
    this.roleService.getRoleById(this.data.id).subscribe(
      data => {
        
        this.name = data.name,
        this.code = data.code,
        this.role = data.description,  
        this.selectedRole = this.convertRoleArr(data.permissions)
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    ); 

    // this.groupedRole = roleList;
    let userId = this.userService.getAuthCurrentUser().id;
    const infoUser = await this.userService.getUserById(userId).toPromise();
    
    //parentid null là thằng cha còn có giá trị là thằng con

    if(infoUser.organization.parent_id === null){
      this.groupedRole = roleListParent
    }else if(environment.flag == 'KD'){
      this.groupedRole = roleList;
    }
  }

  convertRoleArr(roleArr:[]){
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });
    return roleArrConvert;
  }

}
