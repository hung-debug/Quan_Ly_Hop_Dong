import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-detail-pack-unit',
  templateUrl: './admin-detail-pack-unit.component.html',
  styleUrls: ['./admin-detail-pack-unit.component.scss'],
})
export class AdminDetailPackUnitComponent implements OnInit {
  datas: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdminDetailPackUnitComponent>,
    private adminUnitService: AdminUnitService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminUnitService
      .getPackUnitByIdPack(this.data.id, this.data.idPack)
      .subscribe(
        (response) => {
          console.log("response ", response);
          this.datas = response;
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

  cancel() {
    this.dialogRef.close();
  }
}
