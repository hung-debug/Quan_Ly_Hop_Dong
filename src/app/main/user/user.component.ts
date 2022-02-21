import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private appService: AppService,
    private userService: UserService,
    private unitService: UnitService,
    private router : Router,
    private roleService: RoleService,
    private toastService: ToastService) { }

  organization_id_user_login:any;
  organization_id:any = "";
  email:any = "";
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
    this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
    //mac dinh se search theo ma to chuc minh
    this.organization_id = this.organization_id_user_login;

    this.searchUser();

    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgListTmp.push({name: "Tất cả", id:""});
      let dataUnit = data.entities.sort((a:any,b:any) => a.name.toString().localeCompare(b.name.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }
      
      this.orgList = this.orgListTmp;
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

    
    console.log(this.organization_id_user_login);
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data.role_id).subscribe(
          data => {
            console.log(data);
            let listRole: any[];
            listRole = data.permissions;
            this.isQLND_01 = listRole.some(element => element.code == 'QLND_01');
            this.isQLND_02 = listRole.some(element => element.code == 'QLND_02');
            this.isQLND_03 = listRole.some(element => element.code == 'QLND_03');
            this.isQLND_04 = listRole.some(element => element.code == 'QLND_04');
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
          }
        ); 
      
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
      }
    )
  }

  searchUser(){
    console.log(this.organization_id);
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
