import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from './toast.service';
import { UnitService } from './unit.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private unitService: UnitService,
    private spinner: NgxSpinnerService,
    public router: Router,
  ) { }

  importFile(e: any,key: string) {
       const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (
          extension.toLowerCase() == 'xls' ||
          extension.toLowerCase() == 'xlsx'
        ) {
          this.callApiImport(file, key);
        } else {
          this.toastService.showErrorHTMLWithTimeout(
            'Chỉ hỗ trợ file có định dạng XLS, XLSX',
            '',
            3000
          );
        }
      } else {
        this.toastService.showErrorHTMLWithTimeout(
          'Yêu cầu file nhỏ hơn 5MB',
          '',
          3000
        );
      }
    }
  }

  async callApiImport(file: any, key: string) {
    this.spinner.show();

    let keyService: any = null;
    let textService: any = null;
    if(key === 'unit') {
      keyService = this.unitService;
      textService = "Import tổ chức thành công";
    } else if(key === 'user') {
      keyService = this.userService;
      textService = "Import người dùng thành công";
    }

    const importUnit = await keyService.uploadFile(file);

    if(importUnit.status == 204) {
      this.spinner.hide();
      this.toastService.showSuccessHTMLWithTimeout(textService,"",3000);
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/unit']);
      });
    } else if(importUnit.status == 200) {
      this.toastService.showErrorHTMLWithTimeout("File excel không hợp lệ. Vui lòng xem chi tiết lỗi ở file excel đã download","",3000);

      let body: any = importUnit.body;
      let blob = new Blob([body], { type: 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet'});
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `report_${new Date().getTime()}.xlsx`;
      link.click();

      this.spinner.hide();
    }
  }
}
