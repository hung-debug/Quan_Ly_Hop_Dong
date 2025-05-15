import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common'; 
import { RemoteCertificate } from './remote-certificate.interface';
@Component({
  selector: 'app-remote-cert-selection-dialog',
  templateUrl: './remote-cert-selection-dialog.component.html',
  styleUrls: ['./remote-cert-selection-dialog.component.scss'],
  providers: [DatePipe] 
})
export class RemoteCertSelectionDialogComponent implements OnInit {
  certificates: RemoteCertificate[] = [];
  selectedCertSerial: string | null = null;
  displayedColumns: string[] = ['select', 'serialNumber', 'name', 'issuer', 'validTo'];

  mobile: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RemoteCertSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { certificates: RemoteCertificate[] },
    private deviceService: DeviceDetectorService,
    private translate: TranslateService,
    private datePipe: DatePipe 
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.certificates) {
      this.certificates = this.data.certificates;
    }

    this.getDeviceApp();
    // this.cols = [
    //   { field: 'select', header: this.translate.instant('choice'), style: 'text-align: center; width: 75px;' },
    //   { field: 'serialNumber', header: this.translate.instant('notation'), style: 'text-align: left;' },
    //   { field: 'name', header: this.translate.instant('subject'), style: 'text-align: left;' }, // Sử dụng 'name' từ interface
    //   { field: 'issuer', header: this.translate.instant('issuer'), style: 'text-align: left;' }, // Sử dụng 'issuer' từ interface
    //   { field: 'validTo', header: this.translate.instant('end-date'), style: 'text-align: left;' },
    // ];
  }

  getDeviceApp() {
    this.mobile = this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  onCertSelected(serialNumber: string): void {
    this.selectedCertSerial = serialNumber;
  }

  onConfirm(): void {
    if (this.selectedCertSerial) {
      this.dialogRef.close(this.selectedCertSerial);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  get isConfirmDisabled(): boolean {
    return this.selectedCertSerial === null;
  }

  formatValidityDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy HH:mm') || dateString;
  }
}