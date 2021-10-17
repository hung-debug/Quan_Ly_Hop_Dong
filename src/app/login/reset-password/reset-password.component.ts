import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
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
              private modalService: NgbModal,) { }

  initResetPasswordgForm() {
    this.resetPasswordForm = this.fb.group({
      password: ["", Validators.required],
      confirmpassword: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.initResetPasswordgForm();
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
        if(this.status == 0){
          this.notification = 'Đổi mật khẩu mới thất bại!';
        }else{
          this.notification = 'Đổi mật khẩu mới thành công. Vui lòng đăng nhập để tiếp tục!';
        }
        console.log(this.status + " " + this.error + " " + this.notification);
      }
    }
  }

  //return login
  returnLogin() {
    this.router.navigate(['/login']);
  }

}
