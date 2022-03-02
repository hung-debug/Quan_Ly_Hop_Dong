import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { CheckSignDigitalService } from 'src/app/service/check-sign-digital.service';

@Component({
  selector: 'app-check-sign-digital',
  templateUrl: './check-sign-digital.component.html',
  styleUrls: ['./check-sign-digital.component.scss']
})
export class CheckSignDigitalComponent implements OnInit {

  cols: any[];
  list: any[];
  fileName:any='';

  constructor(
    private appService: AppService,
    private checkSignDigitalService: CheckSignDigitalService
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

  fileChangedAttach(e: any) {
    console.log(e.target.files)
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {

      const file = e.target.files[i];
      if (file) {
        this.fileName = file.name;
        this.checkSignDigitalService.getList(file).subscribe(response => {
          this.list = response.items;
        });
      }
    }
  }
}
  