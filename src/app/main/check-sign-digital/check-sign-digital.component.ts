import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { CheckSignDigitalService } from 'src/app/service/check-sign-digital.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-check-sign-digital',
  templateUrl: './check-sign-digital.component.html',
  styleUrls: ['./check-sign-digital.component.scss']
})
export class CheckSignDigitalComponent implements OnInit {

  cols: any[];
  list: any[];
  fileName:any='';
  totalRecord:number;

  constructor(
    private appService: AppService,
    private checkSignDigitalService: CheckSignDigitalService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("menu.check.sign.digital");

    this.cols = [
      {header: 'sign.username', style:'text-align: left;' },
      {header: 'sign.time', style:'text-align: left;' },
      {header: 'sign.efective-time', style:'text-align: left;' },
      {header: 'sign.organization', style:'text-align: left;' },
      {header: 'sign.time.valid', style:'text-align: left;' }
      ];

  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }

  fileChangedAttach(e: any) {
    
    console.log(e.target.files)
    let files = e.target.files;
    this.fileName = '';
    for (let i = 0; i < files.length; i++) {

      const file = e.target.files[i];
      if (file.size <= 50000000) {
        if (file) {
          const extension = file.name.split('.').pop();
          if (extension.toLowerCase() == 'pdf') {
            this.spinner.show();
            this.fileName = file.name;
            this.checkSignDigitalService.getList(file).subscribe(response => {
              this.list = response;
              this.totalRecord = this.list.length;
              this.spinner.hide();
            },
            error => {
              this.totalRecord = -1;
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ nhà phát triển", "", 3000);
            })
          }else{
            this.totalRecord = -1;
            this.toastService.showErrorHTMLWithTimeout("File yêu cầu định dạng PDF", "", 3000);
          }
        }
      } else {
        this.totalRecord = -1;
        this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu nhỏ hơn 50MB", "", 3000);
      }
    }
  }
}
  