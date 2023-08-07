import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from '../service/app.service';
import {SidebarService} from './sidebar/sidebar.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from '../service/toast.service';
import{ ResetPasswordDialogComponent } from '../../app/main/dialog/reset-password-dialog/reset-password-dialog.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DashboardService } from '../service/dashboard.service';
import { UserService } from '../service/user.service';
import {DeviceDetectorService} from "ngx-device-detector";
import { ContractService } from '../service/contract.service';
import { environment } from 'src/environments/environment';
import { ImageDialogSignComponent } from './contract-signature/components/consider-contract/image-dialog-sign/image-dialog-sign.component';
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
              private appService: AppService,
              public sidebarservice: SidebarService,
              private dashboardService: DashboardService,
              private changeDetectorRef: ChangeDetectorRef,
              public translate: TranslateService,
              private dialog: MatDialog,
              private userService: UserService,
              private deviceService: DeviceDetectorService,
              private contractService: ContractService,
              ) {
    this.title = 'err';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(localStorage.getItem('lang') || 'vi');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        if (currentRoute.includes('/main/contract/create/')) {
          this.sidebarservice.triggerReloadSidebar();
        }
      }
    });
  }

  lang: any;
  ngOnInit() {
    if(localStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(localStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.getScreenResolution();
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

  getScreenResolution(): void {
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    console.log(screenWidth, screenHeight);
  }

  //click logout
  logout() {
     //call api delete token
     this.contractService.deleteToken().subscribe((res:any) => { 
    })

    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('myTaxCode');
    localStorage.removeItem('url');
  
    this.router.navigate(['/login']);
  }

  email: string;
  checkMailMbf() {
    this.email = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.email;

    if(this.email.includes('@mobifone.vn') && environment.flag == 'NB')
      return true;

    return false;
  }

  resetPassword(){
    const data = {
      title: 'ĐỔI MẬT KHẨU',
      weakPass: false
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '420px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      
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
      this.mobile = true;
    } else {
      this.mobile = false;
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
    window.location.href = link.replace('&type=', '').replace('&type=1', '').replace('?id','?recipientId').replace('contract-signature','c').replace('signatures','s9').replace('consider','c9').replace('secretary','s8').replace('coordinates','c8');
    this.dashboardService.updateViewNotification(id).subscribe(data => {
      
    });
  }

  loadDataNotification(){
    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      //this.numberNotification = data.total_elements;
      this.listNotification = data.entities;
      
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

    // for test OTP
  imageDialogSignOpen() {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract',
      // imgSignAcc: this.datas.imgSignAcc
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
  }

}