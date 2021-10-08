import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:any = FormGroup;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;
  constructor(private fb: FormBuilder, private router: Router) { }

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

  sendResetPassword() {
    this.router.navigate(['/main/dashboard']);
  }
}
