import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from '../service/app.service';
import { UserService } from '../service/user.service';
import {SidebarService} from './sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title: String;
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
  }
  constructor(private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private appService: AppService,
              public sidebarservice: SidebarService,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef,
              public translate: TranslateService) {
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
    if (this.router.url.includes('/main/form-contract/add') || this.router.url.includes('/coordinates-contract')) {
      this.isRouterContractNew = false;
    } else this.isRouterContractNew = true;
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle);
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
        this.error = false;
        this.userService.sendResetPasswordToken("", passwordOld, passwordNew).subscribe((data) => {

          if(data != null){
            this.status = 1;
          }else{
            this.status = 0;
          }
          if(this.status == 0){
            this.notification = 'Đổi mật khẩu mới thất bại!';
          }else{
            this.notification = 'Đổi mật khẩu mới thành công. Vui lòng đăng nhập để tiếp tục!';
          }
        },
        (error:any) => {
          this.status = 0;
          this.notification = 'Đổi mật khẩu mới thất bại!';
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
}
