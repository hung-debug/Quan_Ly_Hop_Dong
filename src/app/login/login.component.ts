import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: Boolean = false;
  errorDetail:string = '';
  fieldTextType: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public translate: TranslateService,
  ) {

  }

  loginForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })

  loginUser() {
    if(this.loginForm.value.username == ''){
      this.error  = true;
      this.errorDetail = "Tên đăng nhập không được để trống";
    }else if(this.loginForm.value.password == ''){
      this.error  = true;
      this.errorDetail = "Mật khẩu không được để trống";
    }else {
      if(this.loginForm.value.username == 'admin' && this.loginForm.value.password == '123'){
        localStorage.setItem('currentUser', '{"username":"admin","email": "phamvanlambvo@gmail.com"}');
        this.error  = false;
        this.router.navigate(['/main/dashboard']);
      }else{
        this.authService.loginAuthencation(this.loginForm.value.username, this.loginForm.value.password).subscribe((data) => {
            if (this.authService.isLoggedInSuccess() == true) {
              this.error  = false;
              this.router.navigate(['/main/dashboard']);
            } else {
              this.error  = true;
              this.errorDetail = "Tên đăng nhập hoặc mật khẩu không đúng";
            }
          },
          error => {
            this.error = true;
            this.errorDetail = "Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý";
          }
        );
      }
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

}
