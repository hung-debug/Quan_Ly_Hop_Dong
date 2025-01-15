import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../service/authentication.service';
import {DeviceDetectorService} from "ngx-device-detector";
import {ActionDeviceComponent} from "../action-device/action-device.component";
import { MatDialog } from '@angular/material/dialog';
import { parttern_input } from '../config/parttern';
import { ResetPasswordDialogComponent } from '../main/dialog/reset-password-dialog/reset-password-dialog.component';
import { ToastService } from '../service/toast.service';
import * as moment from 'moment';
import { KeycloakService } from 'keycloak-angular';
import { AccountLinkDialogComponent } from '../main/dialog/account-link-dialog/account-link-dialog.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

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
  isSSOlogin: boolean = false;
  isNB: boolean = false;
  enviroment: any = "";
  @ViewChild('previewCaptcha') previewCaptcha: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetector : ChangeDetectorRef,
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    private spinner: NgxSpinnerService

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
    sessionStorage.removeItem('receivePageNum');
    sessionStorage.removeItem('createdPageNum');

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

            if(!this.loginForm.value.captchaName) {
              this.errorDetail = "captcha.not.blank";
            } else {
              this.errorDetail = "captcha.fail";

              this.authService.loginAuthencation(this.loginForm.value.username,"~", this.type, isContractId).subscribe((response: any) => {
                if(response.login_fail_num >= 8) {
                  this.toastService.showErrorHTMLWithTimeout("Bạn đã bị khoá tài khoản đến "+moment(response.active_at).format("YYYY/MM/DD HH:mm:ss"),'',3000);
                }
              });
            }

            this.error = true;
          }
        } else {
          this.login(urlLink, isContractId, isRecipientId);
        }
    }

  }

  backgroundLoginMobile() {
    let url = environment.apiUrl.replace("/service", "");
    let loginApp = url + environment.loginApp;
    return {
      'background': `url(${loginApp})`,
      'background-size': '100% 100%'
    }
  }

  backgroundLoginWeb() {
    let url = environment.apiUrl.replace("/service", "");
    let loginApp = url + environment.loginWeb;
    return {
      'background': `url(${loginApp}) center center`,
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      '-o-background-size': 'cover',
    }
  }

  weakPass: boolean = false;
  login(urlLink: any, isContractId: any, isRecipientId: any) {
    this.authService.loginAuthencation(this.loginForm.value.username, this.loginForm.value.password, this.type, isContractId).subscribe((data) => {

      if(data?.login_fail_num == 5) {
        this.generateCaptcha();
        return;
      }

      if(data?.customer?.info?.passwordChange == 0 && this.type == 0 && !this.loginForm.value.username.includes('@mobifone.vn')) {
        //doi mat khau
        this.toastService.showErrorHTMLWithTimeout('change.pass.first','',3000);
        this.changePassword();
        return;
      }

      if(data?.code == '00'){
        if (this.authService.isLoggedInSuccess() == true) {
          this.error = false;

          //Mật khẩu yếu + người thuộc tổ chức trong hệ thống + tài khoản không có '@mobifone.vn' => Đổi mật khẩu
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
      }else if(data?.code == '13'){
        this.countLoginFail++;
        this.error = true;

        const date = moment(data.active_at);

        this.errorDetail = "Tài khoản bị khoá đến "+moment(date).format('YYYY/MM/DD HH:mm:ss');
      }else if(data?.code == '02'){
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "Tổ chức không hoạt động";
      } else if (data?.code == '10') {
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "Tài khoản của bạn chỉ hỗ trợ đăng nhập bằng SSO, vui lòng đăng nhập bằng SSO để sử dụng hệ thống";
      } else if (data?.code == '11' && environment.usedSSO) {
        this.openAccountLinkDialog(data?.customer?.info)
      } else if (data?.code == '01') {
        this.countLoginFail++;
        this.error = true;
        this.errorDetail = "Tài khoản không hoạt động";
      }
      else {
        this.countLoginFail++;
        this.error = true;

        this.errorDetail = "error.username.password";
      }
      localStorage.setItem("fail", this.countLoginFail.toString());
      },
      error => {
        this.countLoginFail++;

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
        localStorage.setItem("countNoti","0")

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
    const fonts = ["Vesper libre","Zen Kurenaido","Old Standard TT","Roboto Slab","Dancing Script"];

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


  async ngOnInit() {
    if ((this.deviceService.isMobile() || this.deviceService.isTablet())) {
      
      if(localStorage.getItem('sign_type') == '5') {
        this.checkBrowser();
      }
      this.getDeviceApp();

      this.mobile = true;
    } else {
      this.mobile = false;
    }
    
    this.enviroment = environment
    const fullUrl = window.location.href;
    const urlOrigin: any = window.location.hostname;
    
    const parsedApiUrl = new URL(environment.apiUrl);
    
    // debugger
    if(fullUrl.includes('&type=1') || fullUrl.includes('/login?loginType=1')){
      this.router.navigate(['/login'])
      
    } else if(environment.flag == 'KD' && !this.keycloakService.getKeycloakInstance()?.authenticated && (urlOrigin === parsedApiUrl.hostname || fullUrl.includes('localhost') || fullUrl.includes('&type=0') || fullUrl.includes('/login?loginType=0') || (!fullUrl.includes('/login') && this.mobile == false))){
      this.loginSSO()
    }

    if (environment.flag == "NB") {
      this.isNB = true
    } else if(environment.flag != "NB" && environment.usedSSO) {
      this.isNB = false
    } else {
      this.isNB = true
    }
    if(Number(localStorage.getItem('fail')) >= 4) {
      this.captcha = true;
      this.generateCaptcha();
    }

    if (sessionStorage.getItem('type')) {
      this.type = 1;
    } else this.type = 0;


    if (environment.flag == 'KD' && environment.usedSSO) {
      const ssoToken: any = JSON.parse(JSON.stringify(localStorage.getItem('sso_token')) || '') ?? ''
      if ((this.keycloakService.getKeycloakInstance().authenticated || ssoToken) && (window.location.href.includes('realms/sso-mobifone') || window.localStorage.href.includes('/login?type=mobifone-sso')) ) {
        this.isSSOlogin = true
        try {
          let accessToken: any = this.keycloakService.getKeycloakInstance().token
          let ssoIdToken: any = this.keycloakService.getKeycloakInstance().idToken
          let res: any = await this.authService.getAuthencationToken(accessToken, ssoIdToken,0)
          switch(res.code) {
            case '00':
              this.toastService.showSuccessHTMLWithTimeout('Đăng nhập thành công, mở sang trang chủ hệ thống eContract.','',3000)
              setTimeout(() => {
                this.router.navigate(['/main/dashboard'])
                this.isSSOlogin = false
              }, 1000);
              break;
            case '01':
              this.toastService.showErrorHTMLWithTimeout('Tài khoản không hoạt động','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '02':
              this.toastService.showErrorHTMLWithTimeout('Tổ chức không hoạt động','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '03':
              this.toastService.showErrorHTMLWithTimeout('Tên đăng nhập hoặc mật khẩu không đúng','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '04':
              this.toastService.showErrorHTMLWithTimeout('Token đăng nhập bằng SSO không đúng','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '05':
              this.toastService.showErrorHTMLWithTimeout('Tên đăng nhập hoặc mật khẩu không được phép để trống','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '06':
              this.toastService.showErrorHTMLWithTimeout('Lấy thông tin tài khoản trên SSO thất bại','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '07':
              this.toastService.showErrorHTMLWithTimeout('Bạn chưa được cấp quyền đăng nhập vào hệ thống eContract','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '08':
              this.toastService.showErrorHTMLWithTimeout('Tài khoản không tồn tại trong hệ thống eContract','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '09':
              this.toastService.showErrorHTMLWithTimeout('Lấy thông tin từ SSO thất bại','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '14':
              this.toastService.showErrorHTMLWithTimeout('Tài khoản chưa được đồng bộ SSO','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '100':
              this.toastService.showErrorHTMLWithTimeout('Lỗi hệ thống','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
            case '101':
              this.toastService.showErrorHTMLWithTimeout('Kết nối SSO thất bại','',3000)
              this.router.navigate(['/'])
              this.isSSOlogin = false
              break;
          }
        } catch (error) {
          this.isSSOlogin = false
          this.toastService.showErrorHTMLWithTimeout("Đăng nhập SSO thất bại","",3000)
          // this.router.navigate(['/login'])
          if(environment.flag == 'KD' && !this.keycloakService.getKeycloakInstance()?.authenticated){
            localStorage.clear()
            sessionStorage.clear()
            this.loginSSO()
          }
        }
      } else {
        let storedUsername = sessionStorage.getItem("mail");
        // Kiểm tra xem tên đăng nhập đã được lưu trong sessionStorage hay chưa
        if (storedUsername) {
        // Nếu có tên đăng nhập, điền nó vào trường nhập liệu
        this.loginForm.setValue({
          tax_code: '',
          username: storedUsername,
          password: '',
          captchaName: ''
        })
      }
    }} else { 
      if(Number(localStorage.getItem('fail')) >= 4) {
        this.captcha = true;
        this.generateCaptcha();
      }
  
      // this.generateCaptcha();
  
      let storedUsername = sessionStorage.getItem("mail");
  
      // Kiểm tra xem tên đăng nhập đã được lưu trong sessionStorage hay chưa
      if (storedUsername) {
      // Nếu có tên đăng nhập, điền nó vào trường nhập liệu
        this.loginForm.setValue({
          tax_code: '',
          username: storedUsername,
          password: '',
          captchaName: ''
        })
      }
    }
  }

  checkBrowser() {
    if(this.deviceService.os == 'iOS') {
      if(this.deviceService.browser == 'Safari' && parseFloat(this.deviceService.browser_version) >= 11) {
      } else {
        alert("Trình duyệt này hiện không support tốt cho việc ký eKYC trên web. Vui lòng ký eKYC trên app để có trải nghiệm tốt nhất")
      }
    } else if(this.deviceService.os == 'Android') {
      if(this.deviceService.browser == 'Chrome' && parseFloat(this.deviceService.browser_version) >= 53) {
      } else if(this.deviceService.browser == 'Firefox' && parseFloat(this.deviceService.browser_version) >= 36) {
      } else if(this.deviceService.browser == 'Opera' && parseFloat(this.deviceService.browser_version) >= 41) {
      } else if(this.deviceService.browser == 'Samsung' && parseFloat(this.deviceService.browser_version) >= 6) {
      } else {
        alert("Trình duyệt này hiện không support tốt cho việc ký eKYC trên web. Vui lòng ký eKYC trên app để có trải nghiệm tốt nhất")
      }
    } else {
      alert("Trình duyệt này hiện không support tốt cho việc ký eKYC trên web. Vui lòng ký eKYC trên app để có trải nghiệm tốt nhất")
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.getStyleFooter();
  }

  getStyleFooter() {
    let loginForm: HTMLElement | null = document.getElementById('login-form');
    let all: HTMLElement | null = document.getElementById('all');

    let loginFormHeight: number | undefined = loginForm?.offsetHeight;
    let allOffsetHeight: number | undefined = all?.offsetHeight;

    if(loginFormHeight && allOffsetHeight) {
      if(loginFormHeight > 0.75*allOffsetHeight) {
        return {
          'display': 'none'
        }
      }
    }

    return {

    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;


    localStorage.setItem('lang', lang);
    sessionStorage.setItem('lang', lang);
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {


      // @ts-ignore
      const dialogRef = this.dialog.open(ActionDeviceComponent, {
        width: '580px',
        backdrop: 'static',
        keyboard: false,
        panelClass: 'custom-modalbox',
      })
      dialogRef.afterClosed().subscribe((result: any) => {

        if (!this.router.url.endsWith('login')) {
          this.sub = this.route.params.subscribe(params => {
            this.type = params['loginType'];
          });
        }
        // let is_data = result
      })
    }
  }
  async loginSSO() {
    await this.keycloakService.login();
  }

  openAccountLinkDialog(userData: any) {
    // @ts-ignore
    const dialogRef: any = this.dialog.open(AccountLinkDialogComponent, {
      width: '498px',
    // @ts-ignore
      // backdrop: 'static',
      data: userData,
      disableClose: true,
      autoFocus: false
    })
  }
}
