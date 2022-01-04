import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  errorDetail:any;

  fieldTextTypeOld: boolean = false;
  fieldTextTypeNew: boolean = false;
  repeatFieldTextTypeNew: boolean = false;

  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private userService : UserService,
    ) { 
      this.addForm = this.fbd.group({
        passwordOld: ["", [Validators.required]],
        passwordNew: ["", Validators.required],
        confirmPasswordNew: ["", Validators.required]
      });
    }

  ngOnInit(): void {
    this.addForm = this.fbd.group({
      passwordOld: ["", [Validators.required]],
      passwordNew: ["", Validators.required],
      confirmPasswordNew: ["", Validators.required]
    });
    console.log(this.addForm);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      passwordOld: this.addForm.value.passwordOld,
      passwordNew: this.addForm.value.passwordNew,
      confirmPasswordNew: this.addForm.value.confirmPasswordNew,
    }
    
    if (data.passwordNew != data.confirmPasswordNew) {
      this.errorDetail = 'Xác nhận mật khẩu mới không khớp!';
    } else {
      this.userService.sendResetPasswordToken(data.passwordOld, data.passwordNew).subscribe((data) => {
          if (data != null) {
            this.dialogRef.close();
            this.toastService.showSuccessHTMLWithTimeout("Đổi mật khẩu mới thành công.<br>Vui lòng đăng nhập để tiếp tục!", "", 10000);
            this.logout();
          } else {
            this.toastService.showErrorHTMLWithTimeout("Đổi mật khẩu mới thất bại!", "", 10000);
          }
        },
        (error: any) => {
          this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để được xử lý", "", 10000);
        }
      );
    }
  }

  //click logout
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('url');
    this.router.navigate(['/login']);
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

}
