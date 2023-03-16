import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-report-contract-number-follow-status',
  templateUrl: './report-contract-number-follow-status.component.html',
  styleUrls: ['./report-contract-number-follow-status.component.scss']
})
export class ReportContractNumberFollowStatusComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.number.contracts.status.full');
  }

}
