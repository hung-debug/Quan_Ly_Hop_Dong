import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminDeleteUnitComponent } from '../admin-delete-unit/admin-delete-unit.component';
import { AdminDetailUnitComponent } from '../admin-detail-unit/admin-detail-unit.component';

@Component({
  selector: 'app-admin-delete-pack-unit',
  templateUrl: './admin-delete-pack-unit.component.html',
  styleUrls: ['./admin-delete-pack-unit.component.scss'],
})
export class AdminDeletePackUnitComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AdminDeleteUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
    private adminUnitService: AdminUnitService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log('t', this.data);
    this.adminUnitService
      .deletePackUnit(this.data.id, this.data.idPack)
      .subscribe(
        (response) => {
          this.toastService.showSuccessHTMLWithTimeout(
            'Xóa gói dịch vụ cho tổ chức thành công!',
            '',
            3000
          );

          this.dialog.closeAll();

          const data = {
            title: 'unit.information',
            id: this.data.id,
          };
          // @ts-ignore
          const dialogRef1 = this.dialog.open(AdminDetailUnitComponent, {
            width: '80%',
            height: '80%',
            backdrop: 'static',
            keyboard: false,
            data,
          });
          dialogRef1.afterClosed().subscribe((result: any) => {
            console.log('the close dialog');
          });
        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout(
            'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
            '',
            3000
          );
        }
      );
  }
}
