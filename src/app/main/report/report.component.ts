import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("report");

  }

}
