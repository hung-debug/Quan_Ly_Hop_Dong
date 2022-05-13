import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-delete-user',
  templateUrl: './admin-delete-user.component.html',
  styleUrls: ['./admin-delete-user.component.scss']
})
export class AdminDeleteUserComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<AdminDeleteUserComponent>,
  public router: Router,
  public dialog: MatDialog,
  private adminUserService:AdminUserService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.adminUserService.deleteUser(this.data.id).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout("Xóa người dùng thành công!", "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/admin-main/user']);
        });  
          
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
