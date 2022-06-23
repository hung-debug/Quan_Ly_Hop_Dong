import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-active-unit',
  templateUrl: './admin-active-unit.component.html',
  styleUrls: ['./admin-active-unit.component.scss']
})
export class AdminActiveUnitComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<AdminActiveUnitComponent>,
  public router: Router,
  public dialog: MatDialog,
  private adminUnitService:AdminUnitService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.adminUnitService.activeUnit(this.data.id).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout("Kích hoạt thành công!", "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/admin-main/unit']);
        });  
          
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
