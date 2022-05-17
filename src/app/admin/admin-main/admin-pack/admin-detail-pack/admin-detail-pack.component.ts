import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-detail-pack',
  templateUrl: './admin-detail-pack.component.html',
  styleUrls: ['./admin-detail-pack.component.scss']
})
export class AdminDetailPackComponent implements OnInit {

  datas:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private adminPackService : AdminPackService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AdminDetailPackComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.adminPackService.getPackById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.datas = data
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
}
