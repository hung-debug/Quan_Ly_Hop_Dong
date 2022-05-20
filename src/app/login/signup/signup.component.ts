import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import {parttern_input} from "../../config/parttern";
import { NotifiSignupDialogComponent } from '../dialog/notifi-signup-dialog/notifi-signup-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login.component.scss']
})
export class SignupComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(private modalService: NgbModal,
              private router: Router,
              public translate: TranslateService,
              private toastService: ToastService,
              private fbd: FormBuilder,
              private userService: UserService,
              private dialog: MatDialog,
              ) {
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
      name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      size: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      address: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
      tax_code: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      representatives: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      position: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      email: this.fbd.control("", [Validators.required, Validators.email]),
      phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
    });
  }   

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      name: this.addForm.value.name,
      size: this.addForm.value.size,
      address: this.addForm.value.address,
      tax_code: this.addForm.value.tax_code,
      representatives: this.addForm.value.representatives,
      position: this.addForm.value.position,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone
    }
    console.log(data);
    
    //them to chuc
    this.userService.signup(data).subscribe(
      data => {
        this.sendNotifi("Bạn đã đăng ký thành công dịch vụ hệ thống eContract.<br>Vui lòng chờ liên hệ của nhà cung cấp!");
        console.log(data);        
      }, error => {
        this.sendNotifi("Đăng ký thất bại<br>Vui lòng liên hệ nhà phát triển để được xử lý!");
      }
    )
  }

  sendNotifi(message:any) {
    const data = {
      title: 'notification',
      message: message,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(NotifiSignupDialogComponent, {
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

  //return login
  returnLogin() {
    this.router.navigate(['/login']);
  }

}
