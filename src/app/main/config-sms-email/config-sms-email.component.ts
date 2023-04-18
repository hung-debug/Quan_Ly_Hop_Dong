import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-config-sms-email',
  templateUrl: './config-sms-email.component.html',
  styleUrls: ['./config-sms-email.component.scss']
})
export class ConfigSmsEmailComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("menu.config-sms-email");
  }

}
