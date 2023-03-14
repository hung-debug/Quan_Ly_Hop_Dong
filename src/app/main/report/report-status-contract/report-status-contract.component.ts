import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-report-status-contract',
  templateUrl: './report-status-contract.component.html',
  styleUrls: ['./report-status-contract.component.scss']
})
export class ReportStatusContractComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.processing.status.contract.full');
  }

}
