import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-role',
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss']
})
export class DeleteRoleComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<DeleteRoleComponent>,
  public router: Router,
  public dialog: MatDialog,
  private roleService: RoleService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.roleService.deleteRole(this.data.id).subscribe(
      data => {
        if(data.code == '00'){
          this.toastService.showSuccessHTMLWithTimeout("Xóa vai trò thành công!", "", 3000);
        }else if(data.code == '10'){
          this.toastService.showErrorHTMLWithTimeout("Vai trò đã được gán cho người dùng!", "", 3000);
        }else if(data.code == '20'){
          this.toastService.showErrorHTMLWithTimeout("Vai trò không tông tại trên hệ thống!", "", 3000);
        }else {
          this.toastService.showErrorHTMLWithTimeout("Lỗi hệ thống!", "", 3000);
        }
        
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/role']);
        });
            
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
}
