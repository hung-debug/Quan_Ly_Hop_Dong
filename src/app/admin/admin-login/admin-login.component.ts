import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActionDeviceComponent } from 'src/app/action-device/action-device.component';
import { AdminAuthenticationService } from 'src/app/service/admin/admin-authentication.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  error: Boolean = false;
  errorDetail: string = '';
  fieldTextType: boolean = false;
  private sub: any;
  type: any = 0;
  deviceInfo: any;

  constructor(
    private adminAuthService: AdminAuthenticationService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
    localStorage.setItem('lang', 'vi');
  }

  loginForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  loginUser() {
    if (this.loginForm.value.username == '') {
      this.error = true;
      this.errorDetail = 'error.username.required';
    } else if (this.loginForm.value.password == '') {
      this.error = true;
      this.errorDetail = 'error.password.required';
    } else {
      this.adminAuthService
        .loginAuthencation(
          this.loginForm.value.username,
          this.loginForm.value.password
        )
        .subscribe(
          (data) => {
            if (data?.code == '00') {
              if (this.adminAuthService.isLoggedInSuccess() == true) {
                this.error = false;

                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => {

                    let flag = 0;
                  
                    if(data.user.permissions.length === 1) {
                        if(data.user.permissions[0].code.includes('QLND') || data.user.permissions[0].code.includes('QLTB')) {
                          this.router.navigate(['/admin-main/user']);
                        } else if(data.user.permissions[0].code.includes('QLTC') ) {
                          this.router.navigate(['/admin-main/unit']);
                        } else if(data.user.permissions[0].code.includes('QLGDV')) {
                          this.router.navigate(['/admin-main/pack']);
                        }
                        flag = 1;
                    } else {
                      for(let i = 0; i < data.user.permissions.length; i++) {
                        if(data.user.permissions[i].code.includes('QLTC')) {
                          this.router.navigate(['/admin-main/unit']);
                          flag = 2;
                          break;
                        } 
                      }
                    }

                    if(flag == 0) {
                      for (let i = 0; i < data.user.permissions.length; i++) {
                        if (data.user.permissions[i].code.includes('QLND')) {
                          this.router.navigate(['/admin-main/user']);
                          break;
                        } else {
                          this.router.navigate(['/admin-main/pack']);
                          break;
                        }
                      }
                    }

                  });
              } else {
                this.error = true;
                this.errorDetail = 'error.username.password';
              }
            } else if (data?.code == '01') {
              this.error = true;
              this.errorDetail = 'Tài khoản không hoạt động';
            } else if (data?.code == '02') {
              this.error = true;
              this.errorDetail = 'Tổ chức không hoạt động';
            } else {
              this.error = true;
              this.errorDetail = 'error.username.password';
            }
          },
          (error) => {
            console.log(localStorage.getItem('checkUser'));
            if (localStorage.getItem('checkUser') == 'error') {
              this.error = true;
              this.errorDetail = 'error.username.password';
            } else {
              this.error = true;
              this.errorDetail = 'error.server';
            }
          }
        );
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.getDeviceApp();
    } else {
      // if (!this.router.url.endsWith('login')) {
      //   this.sub = this.route.params.subscribe(params => {
      //     this.type = params['loginType'];
      //   });
      // }
      if (sessionStorage.getItem('urlLoginType')) {
        this.type = 1;
      } else this.type = 0;

      //neu dang nhap bang user co tai khoan va da dang nhap thanh cong truoc do thi khong phai dang nhap lai nua
      //comment do chua check token het han
      // if(this.type == 0 && JSON.parse(localStorage.getItem('currentUser') || '')?.code == '00'){
      //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      //     this.router.navigate(['/admin-main/dashboard']);
      //   });
      // }
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      console.log(
        this.deviceService.isMobile(),
        this.deviceService.deviceType,
        this.deviceService
      );
      // @ts-ignore
      const dialogRef = this.dialog.open(ActionDeviceComponent, {
        width: '580px',
        backdrop: 'static',
        keyboard: false,
        panelClass: 'custom-modalbox',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        if (!this.router.url.endsWith('login')) {
          this.sub = this.route.params.subscribe((params) => {
            this.type = params['loginType'];
          });
        }
        // let is_data = result
      });
    }
  }
}
