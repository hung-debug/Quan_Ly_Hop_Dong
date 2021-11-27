import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string;
  private sub: any;
  resetPasswordForm:any = FormGroup;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;
  closeResult:string= '';
  status:number = 1;
  notification:string = '';
  error:boolean = false;
  errorDetail:string = '';
  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private userService: UserService,
              public translate: TranslateService,) {

  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

  initResetPasswordgForm() {
    this.resetPasswordForm = this.fb.group({
      password: ["", Validators.required],
      confirmpassword: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    console.log(this.token);
    this.initResetPasswordgForm();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  //open popup reset password
  open(content:any) {
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
      return  `with: ${reason}`;
    }
  }

  sendResetPassword() {
    let password = this.resetPasswordForm.value.password;
    let confirmpassword = this.resetPasswordForm.value.confirmpassword;
    if(password == ''){
      this.error = true;
      this.errorDetail = 'Mật khẩu mới không được để trống!';
    }else if(confirmpassword == ''){
      this.error = true;
      this.errorDetail = 'Xác nhận mật khẩu mới không được để trống!';
    }else{
      if(password != confirmpassword){
        this.error = true;
        this.errorDetail = 'Xác nhận mật khẩu mới không khớp!';
      }else{
        this.error = false;
        let token = this.token;
        this.userService.sendResetPassword(token, password).subscribe((data) => {

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

  //return login
  returnLogin() {
    this.router.navigate(['/login']);
  }

}
