import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-customer-personal-add',
  templateUrl: './customer-personal-add.component.html',
  styleUrls: ['./customer-personal-add.component.scss']
})
export class CustomerPersonalAddComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("unit.add");
  }

}
