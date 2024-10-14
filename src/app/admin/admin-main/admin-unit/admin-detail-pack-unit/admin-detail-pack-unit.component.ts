import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { paidStatusList } from 'src/app/config/variable';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-detail-pack-unit',
  templateUrl: './admin-detail-pack-unit.component.html',
  styleUrls: ['./admin-detail-pack-unit.component.scss'],
})
export class AdminDetailPackUnitComponent implements OnInit {
  datas: any;
  serviceType: any;

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
          
          this.datas = response;

          if(this.datas.serviceType == 'NORMAL') {
            this.datas.serviceType = 'Bình thường';
          } else if(this.data.serviceType == 'PROMOTION') {
            this.datas.serviceType = 'Khuyến mại';
          }

          if(this.datas.calculatorMethod == 'BY_TIME') {
            this.datas.calculatorMethod = 'Theo thời gian';
          } else if(this.datas.calcaulatorMethod == 'BY_CONTRACT_NUMBER') {
            this.datas.calculatorMethod = 'Theo số lượng tài liệu';
          }

          if(this.datas.paymentType == 'PRE') {
            this.datas.paymentType = 'Trả trước';
          } else if(this.datas.paymentType == 'POST') {
            this.datas.paymentType = 'Trả sau';
          }

          if(this.datas.paymentStatus == 'PAID') {
            this.datas.paymentStatus = 'Đã thanh toán';
          } else if(this.datas.paymentStatus == 'Chưa thanh toán') {
            this.datas.paymentStatus = 'Trả sau';
          }
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

  getPaymentStatus() {
    if(this.datas?.paymentStatus == paidStatusList[0].id) {
      return paidStatusList[0].name;
    } else if(this.datas?.paymentStatus == paidStatusList[1].id) {
      return paidStatusList[1].name;
    }
  }

  getCalculatorMethod() {
    if(this.datas?.calculatorMethod == 'BY_CONTRACT_NUMBERS') {
      this.datas.calculatorMethod = 'Theo số lượng tài liệu';
    } else if(this.datas?.calculatorMethod == 'BY_TIME') {
      this.datas.calculatorMethod = 'Theo thời gian';
    }

    return this.datas?.calculatorMethod;
  }
}
