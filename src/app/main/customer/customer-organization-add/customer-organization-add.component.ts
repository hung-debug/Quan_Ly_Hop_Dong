import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-customer-organization-add',
  templateUrl: './customer-organization-add.component.html',
  styleUrls: ['./customer-organization-add.component.scss']
})
export class CustomerOrganizationAddComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) {
      
   }

  ngOnInit(): void {
    this.appService.setTitle("unit.add");
  }

}
