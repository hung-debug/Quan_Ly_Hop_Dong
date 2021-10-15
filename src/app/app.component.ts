import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from './model/role';
import { User } from './model/user';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {}
}
