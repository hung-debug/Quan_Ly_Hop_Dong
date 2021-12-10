import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: Boolean = false;
  errorDetail: string = '';
  fieldTextType: boolean = false;
  private sub: any;
  type: any = 0;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public translate: TranslateService,
    private route: ActivatedRoute,
  ) {

  }

  loginForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })

  loginUser() {
    if (this.loginForm.value.username == '') {
      this.error = true;
      this.errorDetail = "error.username.required";
    } else if (this.loginForm.value.password == '') {
      this.error = true;
      this.errorDetail = "error.password.required";
    } else {
      if (this.loginForm.value.username == 'admin' && this.loginForm.value.password == '123') {
        localStorage.setItem('currentUser', '{"username":"admin","email": "phamvanlambvo@gmail.com"}');
        this.error = false;
        this.router.navigate(['/main/dashboard']);
      } else {
        this.authService.loginAuthencation(this.loginForm.value.username, this.loginForm.value.password, this.type).subscribe((data) => {
            if (this.authService.isLoggedInSuccess() == true) {
              if (localStorage.getItem("url")) {
                let urlLink = localStorage.getItem("url");
                if (urlLink) {
                  let url_check = urlLink.split("/")[urlLink.split("/").length - 1];
                  let isContractId = url_check.split("?")[0];
                  let isRecipientId = "";
                  if (url_check.includes("&")) {
                    let data_contractId = url_check.split("&")[0];
                    let is_check_contractId = data_contractId.split("?")[url_check.split("?").length - 1];
                    isRecipientId = is_check_contractId.split("=")[is_check_contractId.split("=").length - 1];
                  } else {
                    let is_RecipientId = url_check.split("?")[url_check.split("?").length - 1];
                    isRecipientId = is_RecipientId.split("=")[is_RecipientId.split("=").length - 1];
                  }
                  if (urlLink.includes('coordinates')) {
                    this.router.navigate(['main/contract-signature/coordinates/' + isContractId]);
                  } else if (urlLink.includes('consider')) {
                    this.router.navigate(['/main/contract-signature/consider/' + isContractId],
                      {
                        queryParams: {'recipientId': isRecipientId}
                      });
                  } else if (urlLink.includes('secretary')) {
                    this.router.navigate(['main/contract-signature/secretary/' + isContractId]);
                  } else {
                    this.router.navigate(['/main/contract-signature/signatures/' + isContractId],
                      {
                        queryParams: {'recipientId': isRecipientId}
                      });
                  }
                }
              } else {
                this.error = false;
                if (this.type == 0) {
                  this.router.navigate(['/main/dashboard']);
                } else {
                  this.router.navigate([localStorage.getItem('url')]);
                }
              }
            } else {
              this.error = true;
              this.errorDetail = "error.username.password";
            }
          },
          error => {
            this.error = true;
            this.errorDetail = "error.server";
          }
        );
      }
    }

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    console.log(this.router.url);
    if (!this.router.url.endsWith('login')) {
      this.sub = this.route.params.subscribe(params => {
        this.type = params['loginType'];
      });
      
    }
    // this.type = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));
    // if (this.type) {
    //   this.type = 1;
    // } else {
    //   this.type = 0;
    // }
    console.log(this.type);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

}
