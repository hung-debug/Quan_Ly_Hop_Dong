import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-detail-user',
  templateUrl: './admin-detail-user.component.html',
  styleUrls: ['./admin-detail-user.component.scss']
})
export class AdminDetailUserComponent implements OnInit {

  datas:any;
  cols: any[];
  list: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private adminUserService : AdminUserService,
    public dialogRef: MatDialogRef<AdminDetailUserComponent>,
    private toastService:  ToastService,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.adminUserService.getUserById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.datas = data;
        
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
}
