import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-report-soon-expire',
  templateUrl: './report-soon-expire.component.html',
  styleUrls: ['./report-soon-expire.component.scss']
})
export class ReportSoonExpireComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.expires-soon.contract.full');
  }

}
