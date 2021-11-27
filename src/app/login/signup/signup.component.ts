import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(private modalService: NgbModal,
              private router: Router,
              public translate: TranslateService,) { }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

  ngOnInit(): void {
  }

  signupForm = new FormGroup({
    tax_code: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })

  //open popup
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //close popup
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  sendSignup(){
    this.error = false;
    this.status = 1;
    this.notification = "Đăng ký thành công";
  }

  //return login
  returnLogin() {
    this.router.navigate(['/login']);
  }

}
