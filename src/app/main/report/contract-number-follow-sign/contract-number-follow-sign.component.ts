import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-contract-number-follow-sign',
  templateUrl: './contract-number-follow-sign.component.html',
  styleUrls: ['./contract-number-follow-sign.component.scss']
})
export class ContractNumberFollowSignComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.number.contracts.type.sign.full');
  }

}
