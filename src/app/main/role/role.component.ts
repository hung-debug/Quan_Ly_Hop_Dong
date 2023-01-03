import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { AddRoleComponent } from './add-role/add-role.component';
import { DeleteRoleComponent } from './delete-role/delete-role.component';
import {DetailRoleComponent} from './detail-role/detail-role.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService) { }

  code:any = "";
  name:any = "";
  codeError:any="";
  nameError:any="";
  list: any[] = [];
  cols: any[];
  files:any[];

  //phan quyen
  isQLVT_01:boolean=true;  //them moi vai tro
  isQLVT_02:boolean=true;  //sua vai tro
  isQLVT_03:boolean=true;  //xoa vai tro
  isQLVT_04:boolean=true;  //tim kiem vai tro
  isQLVT_05:boolean=true;  //xem thong tin chi tiet vai tro

  ngOnInit(): void {
    this.appService.setTitle("role.list");
    this.searchRole();

    this.cols = [
      {header: 'role.name', style:'text-align: left;' },
      {header: 'role.code', style:'text-align: left;' },
      {header: 'role.manage', style:'text-align: center;' },
      ];
   
    //lay id user
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data?.role_id).subscribe(
          data => {
            console.log(data);
            let listRole: any[];
            listRole = data.permissions;
            this.isQLVT_01 = listRole.some(element => element.code == 'QLVT_01');
            this.isQLVT_02 = listRole.some(element => element.code == 'QLVT_02');
            this.isQLVT_03 = listRole.some(element => element.code == 'QLVT_03');
            this.isQLVT_04 = listRole.some(element => element.code == 'QLVT_04');
            this.isQLVT_05 = listRole.some(element => element.code == 'QLVT_05');
          }, error => {
            setTimeout(() => this.router.navigate(['/login']));
            this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
            
          }
        ); 
      
      }, error => {
        setTimeout(() => this.router.navigate(['/login']));
        this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
       
      }
    )
  }
  

  searchRole(){
    this.roleService.getRoleList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });
  }

  addRole() {
    const data = {
      title: 'role.add'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '700px',
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
      title: 'role.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '700px',
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
      title: 'role.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailRoleComponent, {
      width: '700px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  deleteRole(id:any) {
    const data = {
      title: 'role.delete',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteRoleComponent, {
      width: '450px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }
}
