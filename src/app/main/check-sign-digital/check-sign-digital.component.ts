import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-check-sign-digital',
  templateUrl: './check-sign-digital.component.html',
  styleUrls: ['./check-sign-digital.component.scss']
})
export class CheckSignDigitalComponent implements OnInit {

  cols: any[];
  list: any[];

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("menu.check.sign.digital");

    this.cols = [
      {header: 'Tên người ký', style:'text-align: left;' },
      {header: 'Thời gian ký', style:'text-align: left;' },
      {header: 'Thời gian hiệu lực của chứng thư số', style:'text-align: left;' },
      {header: 'Đơn vị cấp chứng thư số', style:'text-align: left;' },
      {header: 'Ký trong thời gian hợp lệ', style:'text-align: left;' }
      ];
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }
}
