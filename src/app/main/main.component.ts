import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from '../service/app.service';
import {SidebarService} from './sidebar/sidebar.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from '../service/toast.service';
import{ ResetPasswordDialogComponent } from '../../app/main/dialog/reset-password-dialog/reset-password-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../service/dashboard.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title: string;
  closeResult: string = '';
  resetPasswordForm: any = FormGroup;

  isShowCopyRight: boolean = true;
  isRouterContractNew: boolean = true;
  error: boolean = false;
  errorDetail: string = '';
  status: number = 1;
  notification: string = '';
  numberNotification:any=0;

  //user detail
  currentUserForm: any = FormGroup;
  urlLoginType: any;

  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
  }

  constructor(private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private appService: AppService,
              public sidebarservice: SidebarService,
              private dashboardService: DashboardService,
              private changeDetectorRef: ChangeDetectorRef,
              public translate: TranslateService,
              private toastService: ToastService,
              private dialog: MatDialog,
              private userService: UserService) {
    this.title = 'err';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(localStorage.getItem('lang') || 'vi');
  }

  //open popup reset password
  open(content: any) {
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
      return `with: ${reason}`;
    }
  }



  nameCurrentUser:any;
  listNotification: any[] = [];

  ngOnInit(): void {
    //update title by component
    this.urlLoginType = JSON.parse(JSON.stringify(sessionStorage.getItem('urlLoginType')));
    // if (this.router.url.includes('/main/form-contract/add') ||
    //   this.router.url.includes('/coordinates') ||
    //   this.router.url.includes('/consider') ||
    //   this.router.url.includes('/signature') ||
    //   this.router.url.includes('/secretary') ||
    //   this.router.url.includes('/form-contract/detail')
    // ) {
    //   this.isRouterContractNew = false;
    // } else this.isRouterContractNew = true;
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle.toString());

    this.userService.getUserById(JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id).subscribe(
      data => {
        this.nameCurrentUser = data.name;
      });
    this.dashboardService.getNotification(0, '', '', 5, '').subscribe(data => {
      this.numberNotification = data.total_elements;
    });
  }

  //apply change title
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  //click logout
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('url');
    this.router.navigate(['/login']);
  }

  resetPassword(){
    const data = {
      title: 'ĐỔI MẬT KHẨU'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '400px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
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

  getStyleWithSideBar() {
    // let urlLoginType = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));
    if (this.urlLoginType) {
      return {
        'padding-left': '0px'
      };
    } else return {
      'padding-left': '220px'
    }
  }

  getStyleSideBar() {
    // let urlLoginType = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));
    if (this.urlLoginType) {
      return {
        "width": "100%",
        'left': '0px'
      };
    } else return {
      "width": "calc(100% - 220px)",
      'left': '220px'
    }
  }

  getShowHideSideBar() {
    // let urlLoginType = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));
    if (this.urlLoginType) {
      return false;
    } else return true;
  }

  getName(e: any) {
    // if (e && e == "create-contract-new" || e == "contract-signature") {
    //   this.isShowCopyRight = false;
    //   this.isRouterContractNew = false
    // } else {
    //   this.isShowCopyRight = true;
    //   this.isRouterContractNew = true;
    // }
  }

  getStyle() {
    
    if (this.router.url.includes("contract-signature")) {
      return {
        'margin-top': '40px'
      }
    } else return {
      'margin-top': '60px'
    }
  }

  infoUserDetail() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user-infor']);
    });
    //this.router.navigate(['/main/user-infor']);
  }

  openLinkNotification(link:any, id:any) {
    window.location.href = link.replace('&loginType=', '').replace('&loginType=1', '');
    this.dashboardService.updateViewNotification(id).subscribe(data => {
      console.log(data);
    });
  }

  loadDataNotification(){
    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      //this.numberNotification = data.total_elements;
      this.listNotification = data.entities;
      console.log(data);
    });
    this.dashboardService.getNotification(0, '', '', 5, '').subscribe(data => {
      this.numberNotification = data.total_elements;
      //this.listNotification = data.entities;
    });
  }

  // getCheckCopyRight() {
  //   return !sessionStorage.getItem('copy_right_show');
  // }


  viewAllNotification(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/notification']);
    });
    //this.router.navigate(['/main/notification']);
  }
}
