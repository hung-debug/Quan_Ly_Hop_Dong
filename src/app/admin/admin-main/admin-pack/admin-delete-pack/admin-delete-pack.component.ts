import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-delete-pack',
  templateUrl: './admin-delete-pack.component.html',
  styleUrls: ['./admin-delete-pack.component.scss']
})
export class AdminDeletePackComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<AdminDeletePackComponent>,
  public router: Router,
  public dialog: MatDialog,
  private adminPackService:AdminPackService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.adminPackService.deletePack(this.data.id).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout("Xóa gói cước thành công!", "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/admin-main/pack']);
        });  
          
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
