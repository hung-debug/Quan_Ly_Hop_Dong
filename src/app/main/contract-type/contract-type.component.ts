import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { DetailContractComponent } from '../contract/detail-contract/detail-contract.component';
import {AddContractTypeComponent} from './add-contract-type/add-contract-type.component'
import { DeleteContractTypeComponent } from './delete-contract-type/delete-contract-type.component';
import { DetailContractTypeComponent } from './detail-contract-type/detail-contract-type.component';
@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private contractTypeService: ContractTypeService,
    private userService:UserService,
    private roleService:RoleService,
    private router: Router,
    private toastService:ToastService) { }

  code:any = "";
  name:any = "";
  list: any[] = [];
  cols: any[];

  //phan quyen
  isQLLHD_01:boolean=true;  //them moi loai hop dong
  isQLLHD_02:boolean=true;  //sua loai hop dong
  isQLLHD_03:boolean=true;  //xoa loai hop dong
  isQLLHD_04:boolean=true;  //tim kiem loai hop dong
  isQLLHD_05:boolean=true;  //xem thong tin chi tiet loai hop dong

  ngOnInit(): void {
    this.appService.setTitle("contract-type.list");
    this.searchContractType();

    this.cols = [
      {header: 'contract-type.name', style:'text-align: left;' },
      {header: 'contract-type.code', style:'text-align: left;' },
      {header: 'contract-type.manage', style:'text-align: center;' },
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
            this.isQLLHD_01 = listRole.some(element => element.code == 'QLLHD_01');
            this.isQLLHD_02 = listRole.some(element => element.code == 'QLLHD_02');
            this.isQLLHD_03 = listRole.some(element => element.code == 'QLLHD_03');
            this.isQLLHD_04 = listRole.some(element => element.code == 'QLLHD_04');
            this.isQLLHD_05 = listRole.some(element => element.code == 'QLLHD_05');
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
            setTimeout(() => this.router.navigate(['/login']), 3000);
          }
        ); 
      
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    )
  }

  searchContractType(){
    this.contractTypeService.getContractTypeList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response;
      console.log(this.list);
    });
  }

  addContractType() {
    const data = {
      title: 'contract-type.add'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddContractTypeComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  editContractType(id:any) {
    const data = {
      title: 'contract-type.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddContractTypeComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  detailContractType(id:any) {
    const data = {
      title: 'contract-type.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailContractTypeComponent, {
      width: '480px',
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

  deleteContractType(id:any) {
    const data = {
      title: 'contract-type.delete',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractTypeComponent, {
      width: '500px',
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
