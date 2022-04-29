import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/service/toast.service';
import {parttern_input} from "../../config/parttern";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login.component.scss']
})
export class SignupComponent implements OnInit {

  status:number = 1;
  notification:string = '';
  closeResult:string= '';
  error:boolean = false;
  errorDetail:string = '';
  addForm: FormGroup;
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(private modalService: NgbModal,
              private router: Router,
              public translate: TranslateService,
              private toastService: ToastService,
              private fbd: FormBuilder,) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
    //localStorage.setItem('lang', 'vi');

  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

  ngOnInit(): void {
    this.addForm = this.fbd.group({
      nameOrg: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      short_name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      code: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      email: this.fbd.control("", [Validators.required, Validators.email]),
      phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
      fax: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
      status: 1,
      parent_id: this.fbd.control("", [Validators.required]),
    });
  }   

  sendSignup(){
    this.toastService.showSuccessHTMLWithTimeout("no.signup.success", "", 3000);
  }

  //return login
  returnLogin() {
    this.router.navigate(['/login']);
  }

}
