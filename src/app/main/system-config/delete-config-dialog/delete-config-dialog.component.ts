import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { SystemConfigService } from 'src/app/service/system-config.service';

@Component({
  selector: 'app-delete-config-dialog',
  templateUrl: './delete-config-dialog.component.html',
  styleUrls: ['./delete-config-dialog.component.scss']
})
export class DeleteConfigDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DeleteConfigDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private systemConfigService: SystemConfigService,
    ) {
    }

  ngOnInit(): void {
    console.log("data",this.data);
    
  }

  onSubmit(){
    // this.systemConfigService.getDeleteApiWebHook(this.data.api_name).subscribe((data) => {

    //   if(data.success === true){
    //     this.toastService.showSuccessHTMLWithTimeout("Xóa cấu hình webhook thành công!", "", 3000);
    //     this.dialogRef.close();
    //   }else{
    //     this.toastService.showErrorHTMLWithTimeout("Xóa cấu hình webhook không thành công!", "", 3000);
    //     this.dialogRef.close();
    //   }
    // },
    // error => {
    //   this.toastService.showErrorHTMLWithTimeout("Lỗi xóa cấu hình webhook", "", 3000);
    //   this.dialogRef.close();
    // }
    // );
    this.dialogRef.close();
  }

}
