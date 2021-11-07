import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login.component.scss']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  signupForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })


}
