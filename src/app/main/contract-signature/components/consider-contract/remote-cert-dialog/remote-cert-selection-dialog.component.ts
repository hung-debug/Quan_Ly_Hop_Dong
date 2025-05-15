// src/app/main/contract-signature/components/consider-contract/remote-cert-selection-dialog/remote-cert-selection-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common'; // Import DatePipe để format ngày tháng

// Import interface từ file dùng chung
import { RemoteCertificate } from './remote-certificate.interface';
@Component({
  selector: 'app-remote-cert-selection-dialog',
  templateUrl: './remote-cert-selection-dialog.component.html',
  styleUrls: ['./remote-cert-selection-dialog.component.scss'],
  providers: [DatePipe] // Cung cấp DatePipe nếu sử dụng trong component class
})
export class RemoteCertSelectionDialogComponent implements OnInit {

  // Danh sách chứng thư nhận từ component cha
  certificates: RemoteCertificate[] = [];
  // Serial Number của chứng thư được người dùng chọn
  selectedCertSerial: string | null = null;

  // Định nghĩa các cột sẽ hiển thị trong bảng (cho web)
  // Sử dụng tên trường từ interface RemoteCertificate
  displayedColumns: string[] = ['select', 'serialNumber', 'name', 'issuer', 'validTo'];

  // Cờ kiểm tra thiết bị di động
  mobile: boolean = false;

  constructor(
    // Inject MatDialogRef để có thể đóng dialog
    public dialogRef: MatDialogRef<RemoteCertSelectionDialogComponent>,
    // Inject dữ liệu được truyền vào từ component cha
    // Dữ liệu này sẽ có dạng { certificates: RemoteCertificate[] }
    @Inject(MAT_DIALOG_DATA) public data: { certificates: RemoteCertificate[] },
    private deviceService: DeviceDetectorService,
    private translate: TranslateService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit(): void {
    // Gán dữ liệu chứng thư nhận được vào biến certificates
    if (this.data && this.data.certificates) {
      this.certificates = this.data.certificates;
    }

    // Kiểm tra thiết bị
    this.getDeviceApp();

    // Nếu sử dụng PrimeNG Table và cần định nghĩa cols ở đây:
    // this.cols = [
    //   { field: 'select', header: this.translate.instant('choice'), style: 'text-align: center; width: 75px;' },
    //   { field: 'serialNumber', header: this.translate.instant('notation'), style: 'text-align: left;' },
    //   { field: 'name', header: this.translate.instant('subject'), style: 'text-align: left;' }, // Sử dụng 'name' từ interface
    //   { field: 'issuer', header: this.translate.instant('issuer'), style: 'text-align: left;' }, // Sử dụng 'issuer' từ interface
    //   { field: 'validTo', header: this.translate.instant('end-date'), style: 'text-align: left;' },
    // ];
  }

  // Hàm kiểm tra thiết bị
  getDeviceApp() {
    this.mobile = this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  // Hàm xử lý khi người dùng chọn một radio button
  onCertSelected(serialNumber: string): void {
    this.selectedCertSerial = serialNumber;
  }

  // Hàm xử lý khi người dùng bấm nút "Xác nhận"
  onConfirm(): void {
    // Đóng dialog và trả về Serial Number của chứng thư đã chọn
    if (this.selectedCertSerial) {
      this.dialogRef.close(this.selectedCertSerial);
    }
    // Nút Xác nhận bị disable nếu selectedCertSerial là null, nên không cần kiểm tra null ở đây
  }

  // Hàm xử lý khi người dùng bấm nút "Hủy"
  onCancel(): void {
    // Đóng dialog mà không trả về dữ liệu (hoặc trả về undefined/null)
    this.dialogRef.close();
  }

  // Getter để kiểm tra xem nút Xác nhận có nên bị disable hay không
  get isConfirmDisabled(): boolean {
    return this.selectedCertSerial === null;
  }

  // Hàm format ngày tháng (nếu cần format ở đây thay vì trong template)
  formatValidityDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy HH:mm') || dateString;
  }
}