import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../service/app.service';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title:String;
  closeResult:string= '';
  resetPasswordForm:any = FormGroup;
  fieldTextTypeOld: boolean = false;
  fieldTextTypeNew: boolean = false;
  repeatFieldTextTypeNew: boolean = false;

  constructor(private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private appService: AppService,
              public sidebarservice: SidebarService,
              private changeDetectorRef: ChangeDetectorRef) {
                this.title = 'err';
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

  //form reset password
  initResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      passwordOld: ["", [Validators.required]],
      passwordNew: ["", Validators.required],
      confirmPasswordNew: ["", Validators.required]
    });
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

  ngOnInit(): void {
    //update title by component
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle);
    this.initResetPasswordForm();
  }

  //apply change title
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  //click logout
  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  //click reset password
  sendResetPassword() {
    this.router.navigate(['/login']);
  }

  //side bar menu
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
  toggleBackgroundImage() {
    this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage;
  }
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }
}
