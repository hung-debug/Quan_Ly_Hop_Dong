import {AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../service/authentication.service';
import {DeviceDetectorService} from "ngx-device-detector";
import {ActionDeviceComponent} from "../action-device/action-device.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { parttern_input } from '../config/parttern';
import { ResetPasswordDialogComponent } from '../main/dialog/reset-password-dialog/reset-password-dialog.component';
import { ToastService } from '../service/toast.service';
import domtoimage from 'dom-to-image';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  mobile: boolean = true;
  error: Boolean = false;
  errorDetail: string = '';
  fieldTextType: boolean = false;
  private sub: any;
  type: any = 0;
  deviceInfo: any;

  contract_signatures: any = "c";
  signatures: any = "s9";
  consider: any = "c9";
  secretary: any = "s8";
  coordinates: any = "c8";

  @ViewChild('previewCaptcha') previewCaptcha: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetector : ChangeDetectorRef,
    private toastService: ToastService
  ) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
    localStorage.setItem('lang', 'vi');
  }
  ngAfterViewInit(): void {
    if(this.previewCaptcha)
      this.previewCaptcha.nativeElement.innerHTML = this.html;
  }

  loginForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    captchaName: new FormControl('')
  })

  kyTuCach: any = "&";
  captcha: boolean = false;
  countLoginFail: number = 0;
  loginUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('myTaxCode');
    localStorage.removeItem('url');
    
    if(!sessionStorage.getItem('lang')) {
      sessionStorage.setItem('lang','vi')
    }

    if (this.loginForm.value.username == '') {
      this.error = true;
      this.errorDetail = "error.username.required";
    } else if (this.loginForm.value.password == '') {
      this.error = true;
      this.errorDetail = "error.password.required";
    } else {
      if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
        this.type = 1;
      } else 
        this.type = 0;

        let urlLink = sessionStorage.getItem("url");
        let isContractId: any = "";
        let isRecipientId: any = "";

        if (urlLink) {
          let url_check = urlLink.split("/")[urlLink.split("/").length - 1];
          isContractId = Number(url_check.split("?")[0]);

          if (url_check.includes(this.kyTuCach)) {
            let data_contractId = url_check.split(this.kyTuCach)[0];
            let is_check_contractId = data_contractId.split("?")[url_check.split("?").length - 1];
            isRecipientId = is_check_contractId.split("=")[is_check_contractId.split("=").length - 1];
          } else {
            let is_RecipientId = url_check.split("?")[url_check.split("?").length - 1];
            isRecipientId = is_RecipientId.split("=")[is_RecipientId.split("=").length - 1];
          }
        }

        if(this.captcha) {
          if(this.loginForm.value.captchaName == this.previewCaptcha.nativeElement.innerText.replaceAll(" ","")) {
            this.login(urlLink, isContractId, isRecipientId);
          } else {
            //Nhập sai captcha

            console.log("vao day ");
            this.errorDetail = "Nhập sai captcha";
            this.error = true;
          }
        } else {
          this.login(urlLink, isContractId, isRecipientId);
        }
    }

  }

  weakPass: boolean = false;
  login(urlLink: any, isContractId: any, isRecipientId: any) {
    this.authService.loginAuthencation(this.loginForm.value.username, this.loginForm.value.password, this.type, isContractId).subscribe((data) => {

      console.log("data ", data);

      // if(data?.customer?.info?.passwordChange == 0) {
      //   //doi mat khau
      //   this.toastService.showErrorHTMLWithTimeout('change.pass.first','',3000);
      //   this.changePassword();
      //   return;
      // }

      if(data?.code == '00'){
        if (this.authService.isLoggedInSuccess() == true) {
          this.error = false;

          //Mật khẩu yếu => Đổi mật khẩu
          if(!parttern_input.weak_pass.test(this.loginForm.value.password) && this.type != 1 && !this.loginForm.value.username.includes('@mobifone.vn')) {
            this.toastService.showErrorHTMLWithTimeout('weak.pass','',3000);
            this.changePassword();
            return;
          } else {

            this.action(urlLink, isContractId, isRecipientId);
          }
        } else {
          this.countLoginFail++;
          this.error = true;
          this.errorDetail = "error.username.password";
        }
      }else if(data?.code == '01'){
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "Tài khoản không hoạt động";
      }else if(data?.code == '02'){
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "Tổ chức không hoạt động";
      }else {
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "error.username.password";
      }
      localStorage.setItem("fail", this.countLoginFail.toString());
      },
      error => {
        this.countLoginFail++;
        console.log(localStorage.getItem('checkUser'));
        if(localStorage.getItem('checkUser') == 'error'){
          this.error = true;
          this.errorDetail = "error.username.password";
        }else{
          this.error = true;
          this.errorDetail = "error.server";
        }

        localStorage.setItem("fail", this.countLoginFail.toString());
      }
    );

    if(this.countLoginFail >= 4) {
      this.captcha = true;
      this.generateCaptcha();
    }

  }

  action(urlLink: any, isContractId: any, isRecipientId: any) {
    this.countLoginFail = 0;
    this.captcha = false;
    localStorage.setItem('fail',this.countLoginFail.toString())
    if (sessionStorage.getItem("url")) {
      if (urlLink) {
        if (urlLink.includes(this.coordinates)) {
          this.router.navigate(['/main/'+this.contract_signatures+'/'+'/'+this.coordinates+'/' + isContractId]);
        } else if (urlLink.includes(this.consider)) {
          this.router.navigate(['/main/'+this.contract_signatures+'/'+'/'+this.consider+'/' + isContractId],
            {
              queryParams: {'recipientId': isRecipientId}
            });
        } else if (urlLink.includes(this.secretary)) {
          this.router.navigate(['/main/'+this.contract_signatures+'/'+'/'+this.secretary+'/' + isContractId],
            {
              queryParams: {'recipientId': isRecipientId}
            });
        } else if (urlLink.includes(this.signatures)) {
          this.router.navigate(['/main/'+this.contract_signatures+'/'+this.signatures+'/' + isContractId],
            {
              queryParams: {'recipientId': isRecipientId}
            });
        } else if (urlLink.includes('contract-template')) {
          this.router.navigate(['/main/contract-template/form/detail/' + isContractId]);
        } else if (urlLink.includes('form-contract')) {
          this.router.navigate(['/main/form-contract/detail/' + isContractId]);
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
  }

  changePassword() {
    const data = {
      title: 'ĐỔI MẬT KHẨU',
      weakPass: false
    };

    // @ts-ignore
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '420px',
      backdrop: 'static',
      keyboard: false,
      disableClose: true,
      data
    })

    dialogRef.afterClosed().subscribe((result: any) => {
    })
  }

  captchaValue: any;
  generateCaptcha() {
    let code = (Math.random() * 1000000000).toString();
    let value = window.btoa(code);

    let captchaValue = value.substring(0,5+Math.random()*5);

    this.captchaValue = captchaValue;

    this.setCaptcha();

  }

  html: any;
  async setCaptcha() {
    const fonts = ["cursive","sans-serif","serif","monospace"];
    let html = this.captchaValue.split("").map((char: any) => {
      const rotate = -20 + Math.trunc(Math.random() * 30);

      const font = Math.trunc(Math.random() * fonts.length);

      return `<span
      style="
        transform:rotate(${rotate}deg);
        font-family:${fonts[font]};
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
      "
    >${char}
    </span>`
    }).join("");

    this.changeDetector.detectChanges();

    this.html = html;

    if(this.previewCaptcha)
      this.previewCaptcha.nativeElement.innerHTML = html;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


  ngOnInit(): void {
    if(Number(localStorage.getItem('fail')) >= 4) {
      this.captcha = true;
      this.generateCaptcha();
    }    

    // this.generateCaptcha();
    if (sessionStorage.getItem('type')) {
      this.type = 1;
    } else this.type = 0;

    if ((this.deviceService.isMobile() || this.deviceService.isTablet())) {
      this.getDeviceApp();

      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;

    console.log("lang ", lang);
    // localStorage.setItem('lang', lang);
    sessionStorage.setItem('lang', lang);
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