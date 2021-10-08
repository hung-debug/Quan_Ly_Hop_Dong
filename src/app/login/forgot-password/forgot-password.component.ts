import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any =  FormGroup;
  constructor(private fb: FormBuilder, private router: Router) { }

  initRegForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    this.initRegForm();
  }

  sendForgetPassword() {
    this.router.navigate(['/reset-password']);
  }

}
