import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-contract-number-follow-type',
  templateUrl: './contract-number-follow-type.component.html',
  styleUrls: ['./contract-number-follow-type.component.scss']
})
export class ContractNumberFollowTypeComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.number.contracts.contract-type.full');
  }

}
