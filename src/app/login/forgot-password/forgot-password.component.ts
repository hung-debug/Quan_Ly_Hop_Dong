import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/service/user.service';
import { SendPasswordDialogComponent } from '../dialog/send-password-dialog/send-password-dialog.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any =  FormGroup;
  closeResult:string= '';
  status:number = 1;
  error:boolean = false;
  errorDetail:string = '';
  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private userService: UserService,
              public translate: TranslateService,
              private dialog: MatDialog,) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
    //localStorage.setItem('lang', 'vi');
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

          if(data.status == 0){
            this.sendPassword('Chúng tôi đã gửi thông tin về địa chỉ email '+ email +'<br>Vui lòng truy cập email để tiếp tục!');
          }else{
            // if(data.code == '01'){
            //   this.sendPassword('Địa chỉ email '+ email +' không tồn tại trên hệ thống!');
            // }else if(data.code == '02'){
            //   this.sendPassword('Địa chỉ email '+ email +' có tài khoản không hoạt động!');
            // }else if(data.code == '03'){
            //   this.sendPassword('Địa chỉ email '+ email +' có tổ chức không hoạt động!');
            // }
            this.sendPassword(this.translateService.instant('email.valid'));
          }
          
        },
        (error:any) => {
          this.sendPassword('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý');
        }
        );
      }
    }
  }

  sendPassword(message:any) {
    const data = {
      title: 'notification',
      message: message,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(SendPasswordDialogComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }
}
