import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: Boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) { }

  loginForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })

  loginUser() {
    this.authService.loginAuthencation(this.loginForm.value.tax_code, this.loginForm.value.username, this.loginForm.value.password).subscribe((data) => {

      if (this.authService.isLoggedInSuccess() == true) {
        this.error  = false;
        console.log("True");
        this.router.navigate(['/main/dashboard']);
      } else {
        this.error  = true;
        console.log("Incorrect");
      }
    },
    );
  }

  ngOnInit(): void {

  }

}
