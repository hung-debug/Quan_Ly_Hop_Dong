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
import {DeviceDetectorService} from "ngx-device-detector";
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title: string;

  isShowCopyRight: boolean = true;
  isRouterContractNew: boolean = true;
  error: boolean = false;
  errorDetail: string = '';
  status: number = 1;
  notification: string = '';
  numberNotification:any=0;

  urlLoginType: any;
  nameCurrentUser:any;
  listNotification: any[] = [];

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
              private userService: UserService,
              private deviceService: DeviceDetectorService,
              ) {
    this.title = 'err';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(localStorage.getItem('lang') || 'vi');
  }

  ngOnInit(): void {
    this.getDeviceApp();

    //update title by component
    this.urlLoginType = JSON.parse(JSON.stringify(sessionStorage.getItem('type')));
   
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle.toString());

    this.userService.getUserById(JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id).subscribe(
      data => {
        this.nameCurrentUser = data?.name;
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
    // localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('myTaxCode');
    localStorage.removeItem('url');
    this.router.navigate(['/login']);
  }

  resetPassword(){
    const data = {
      title: 'ĐỔI MẬT KHẨU'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '420px',
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
    let urlLoginType = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));

    if (this.urlLoginType || this.mobile === true) {
      return {
        'padding-left': '0px'
      };
    }
     else return {
      'padding-left': '220px'
    }
  }

  //get style header
  getStyleSideBar() {
    let urlLoginType = JSON.parse(JSON.stringify(localStorage.getItem('urlLoginType')));

    if (this.urlLoginType || this.mobile === true) {
      return {
        "width": "100%",
        'left': '0px'
      };
    }
     else return {
      "width": "calc(100% - 220px)",
      'left': '220px'
    }
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      console.log("la mobile ");
      this.mobile = true;
    } else {
      console.log("la pc");
      this.mobile = false;
    }

    console.log("mobile ", this.mobile);
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
    window.location.href = link.replace('&type=', '').replace('&type=1', '').replace('?id','?recipientId').replace('contract-signature','c').replace('signatures','s9').replace('consider','c9').replace('secretary','s8').replace('coordinates','c8');
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

  viewAllNotification(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/notification']);
    });
    //this.router.navigate(['/main/notification']);
  }

  viewLink(){
    window.open("https://drive.google.com/drive/folders/1NHaCYOMCMsLvrw1uPbX2ezsC-Uo9huW3");
  }
}
