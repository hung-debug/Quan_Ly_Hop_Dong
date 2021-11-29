import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from '../service/app.service';
import { UserService } from '../service/user.service';
import {SidebarService} from './sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title: string;
  closeResult: string = '';
  resetPasswordForm: any = FormGroup;
  fieldTextTypeOld: boolean = false;
  fieldTextTypeNew: boolean = false;
  repeatFieldTextTypeNew: boolean = false;
  isShowCopyRight: boolean = true;
  isRouterContractNew: boolean = true;
  error:boolean = false;
  errorDetail:string = '';
  status:number = 1;
  notification:string = '';

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }
  constructor(private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private appService: AppService,
              public sidebarservice: SidebarService,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef,
              public translate: TranslateService,
              private toastService : ToastService) {
    this.title = 'err';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
  }

  //open popup reset password
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //close popup reset password
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //form reset password
  initResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      passwordOld: ["", [Validators.required]],
      passwordNew: ["", Validators.required],
      confirmPasswordNew: ["", Validators.required]
    });
  }

  //hien thi password dang text, dang ma
  toggleFieldTextTypeOld() {
    this.fieldTextTypeOld = !this.fieldTextTypeOld;
  }

  //hien thi password dang text, dang ma
  toggleFieldTextTypeNew() {
    this.fieldTextTypeNew = !this.fieldTextTypeNew;
  }

  //hien thi password dang text, dang ma
  toggleRepeatFieldTextTypeNew() {
    this.repeatFieldTextTypeNew = !this.repeatFieldTextTypeNew;
  }

  ngOnInit(): void {
    //update title by component
    if (this.router.url.includes('/main/form-contract/add') ||
      this.router.url.includes('/coordinates-contract') ||
      this.router.url.includes('/consider-contract') ||
      this.router.url.includes('/personal-signature-contract')
    ) {
      this.isRouterContractNew = false;
    } else this.isRouterContractNew = true;
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle.toString());
    this.initResetPasswordForm();
  }

  //apply change title
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  //click logout
  logout() {

    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  //click reset password
  sendResetPassword() {
    let passwordOld = this.resetPasswordForm.value.passwordOld;
    let passwordNew = this.resetPasswordForm.value.passwordNew;
    let confirmPasswordNew = this.resetPasswordForm.value.confirmPasswordNew;
    if(passwordOld == ''){
      this.error = true;
      this.errorDetail = 'Mật khẩu cũ không được để trống!';
    }else if(passwordNew == ''){
      this.error = true;
      this.errorDetail = 'Mật khẩu mới không được để trống!';
    }else if(confirmPasswordNew == ''){
      this.error = true;
      this.errorDetail = 'Xác nhận mật khẩu mới không được để trống!';
    }else{
      if(passwordNew != confirmPasswordNew){
        this.error = true;
        this.errorDetail = 'Xác nhận mật khẩu mới không khớp!';
      }else{
        this.userService.sendResetPasswordToken(passwordOld, passwordNew).subscribe((data) => {
          this.error = false;
          if(data != null){
            this.status = 1;
          }else{
            this.status = 0;
          }
          if(this.status == 0){
            this.toastService.showErrorHTMLWithTimeout("Đổi mật khẩu mới thất bại!", "", 10000);
          }else{
            this.toastService.showSuccessHTMLWithTimeout("Đổi mật khẩu mới thành công. Vui lòng đăng nhập để tiếp tục!", "", 10000);
            this.logout();
          }
        },
        (error:any) => {
          this.status = 0;
          this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để được xử lý", "", 10000);
        }
        );
      }
    }
  }

  //side bar menu
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  toggleBackgroundImage() {
    this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage;
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  getName(e: any) {
    if (e && e == "create-contract-new" || e == "contract-signature") {
      this.isShowCopyRight = false;
      this.isRouterContractNew = false
    } else {
      this.isShowCopyRight = true;
      this.isRouterContractNew = true;
    }
  }

  getStyle() {
    if (this.isShowCopyRight && this.isRouterContractNew) {
      return {
        'margin-top': '60px'
      }
    } else return {
      'margin-top': '40px'
    }
  }
}
