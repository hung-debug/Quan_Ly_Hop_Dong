import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  name:any;
  email:any;
  phone:any;
  birthday:any;
  organization_id:any;

  phoneKpi:any;
  networkKpi:any;

  nameHsm:any;

  constructor(private appService: AppService,) { }

  ngOnInit(): void {
    this.appService.setTitle("user.information");

    this.name = JSON.parse(localStorage.getItem('currentUser')||'').customer.name;
    this.email = JSON.parse(localStorage.getItem('currentUser')||'').customer.email;
    this.phone = JSON.parse(localStorage.getItem('currentUser')||'').customer.phone;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser')||'').customer.organization_id;
  }

}
