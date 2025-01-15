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

  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' }); // Trả về action cancel
  }

  // Gửi dữ liệu khi người dùng xóa
  onDelete(): void {
    this.dialogRef.close({ action: 'delete' }); // Trả về action delete
  }

}
