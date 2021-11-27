import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any =  FormGroup;
  closeResult:string= '';
  status:number = 1;
  notification:string = '';
  error:boolean = false;
  errorDetail:string = '';
  constructor(private fb: FormBuilder,
              private router: Router,
              private modalService: NgbModal,
              private userService: UserService,
              public translate: TranslateService,) {

  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

  initRegForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    this.initRegForm();
  }

  sendForgetPassword() {
    let email = this.forgotPasswordForm.value.email;
    if(email == ''){
      this.error = true;
      this.errorDetail = 'Tên email không được để trống!';
    }else{
      const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(regularExpression.test(String(email).toLowerCase()) == false){
        this.error = true;
        this.errorDetail = 'Tên email sai định dạng!';
      }else{
        this.error = false;

        this.userService.sendForgotPassword(email).subscribe((data) => {

          if(data != null){
            this.status = 1;
          }else{
            this.status = 0;
          }
          if(this.status == 0){
            this.notification = 'Gửi email thất bại. Vui lòng kiểm tra lại thông tin và thử lại!';
          }else{
            this.notification = 'Chúng tôi đã gửi thông tin về địa chỉ email '+ email +'. Vui lòng truy cập email để tiếp tục!';
          }
        },
        (error:any) => {
          this.status = 0;
          this.notification = 'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý';
        }
        );
      }
    }
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

}
