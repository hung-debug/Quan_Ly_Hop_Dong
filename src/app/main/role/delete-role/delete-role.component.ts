import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.dialogRef.close();
    this.toastService.showSuccessHTMLWithTimeout("Xóa vai trò thành công!", "", 3000);
  }
}
