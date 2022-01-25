import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../service/authentication.service';
import {HttpErrorResponse} from "@angular/common/http";
import {DeviceDetectorService} from "ngx-device-detector";
import {FilterListDialogComponent} from "../main/contract/dialog/filter-list-dialog/filter-list-dialog.component";
import {ActionDeviceComponent} from "../action-device/action-device.component";
import { MatDialog } from '@angular/material/dialog';

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
  deviceInfo: any;

  constructor(
    private authService: AuthenticationService,
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
      if (sessionStorage.getItem('urlLoginType')) {
        this.type = 1;
      } else this.type = 0;
      this.authService.loginAuthencation(this.loginForm.value.username, this.loginForm.value.password, this.type).subscribe((data) => {
          if (this.authService.isLoggedInSuccess() == true) {
            if (sessionStorage.getItem("url")) {
              let urlLink = sessionStorage.getItem("url");
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
                  this.router.navigate(['main/contract-signature/secretary/' + isContractId],
                    {
                      queryParams: {'recipientId': isRecipientId}
                    });
                } else {
                  this.router.navigate(['/main/contract-signature/signatures/' + isContractId],
                    {
                      queryParams: {'recipientId': isRecipientId}
                    });
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
          console.log(localStorage.getItem('checkUser'));
          if(localStorage.getItem('checkUser') == 'error'){
            this.error = true;
            this.errorDetail = "error.username.password";
          }else{
            this.error = true;
            this.errorDetail = "error.server";
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
      if (!this.router.url.endsWith('login')) {
        this.sub = this.route.params.subscribe(params => {
          this.type = params['loginType'];
        });
      }
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      console.log(this.deviceService.isMobile(), this.deviceService.deviceType, this.deviceService);
      // @ts-ignore
      const dialogRef = this.dialog.open(ActionDeviceComponent, {
        width: '580px',
        backdrop: 'static',
        keyboard: false,
        panelClass: 'custom-modalbox'
      })
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        if (!this.router.url.endsWith('login')) {
          this.sub = this.route.params.subscribe(params => {
            this.type = params['loginType'];
          });
        }
        // let is_data = result
      })
    }
  }

}
