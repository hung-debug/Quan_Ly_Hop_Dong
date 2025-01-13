import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import {AppService} from '../service/app.service';
import {SidebarService} from './sidebar/sidebar.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from '../service/toast.service';
import{ ResetPasswordDialogComponent } from '../../app/main/dialog/reset-password-dialog/reset-password-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../service/dashboard.service';
import { UserService } from '../service/user.service';
import {DeviceDetectorService} from "ngx-device-detector";
import { ContractService } from '../service/contract.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from '../service/authentication.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title: string;
  subTitle: string;

  isShowCopyRight: boolean = true;
  isRouterContractNew: boolean = true;
  error: boolean = false;
  errorDetail: string = '';
  status: number = 1;
  notification: string = '';
  numberNotification:any=0;
  isSsoSync: boolean = false;

  urlLoginType: any;
  nameCurrentUser:any;
  phoneCurrentUser: any;
  listNotification: any[] = [];
  getAlllistNotification: any[] = [];
  messageNotification: string;
  isMessageNotificationSet = false;
  logoWeb: string;
  @ViewChild('scrollingText', { static: false }) scrollingTextElement: ElementRef<any>;
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
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private keycloakService: KeycloakService,
              private authenticationService: AuthenticationService
              ) {
    this.title = 'err';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(localStorage.getItem('lang') || 'vi');
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     const currentRoute = event.urlAfterRedirects;
    //     if (currentRoute.includes('/main/contract/create/')) {
    //       this.sidebarservice.triggerReloadSidebar();
    //     }
    //   }
    // });
  }


  ngAfterViewInit() {
    if (this.isMessageNotificationSet && this.scrollingTextElement && this.scrollingTextElement.nativeElement) {
      this.updateAnimationDuration();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateAnimationDuration();
  }

  private updateAnimationDuration() {
    setTimeout(() => {
      if (this.scrollingTextElement && this.scrollingTextElement.nativeElement) {
        const scrollingTextWidth = this.scrollingTextElement.nativeElement.scrollWidth;
        const containerWidth = this.scrollingTextElement.nativeElement.parentElement.offsetWidth;
        const speed = 50;
        const duration = (scrollingTextWidth + containerWidth) / speed;
        const initialDistance = (containerWidth / scrollingTextWidth) * 100
        if (scrollingTextWidth > containerWidth) {
          this.scrollingTextElement.nativeElement.style.setProperty('--start-position', `${initialDistance}%`);
          this.scrollingTextElement.nativeElement.style.animation = `RightToLeft ${duration}s linear infinite`;
          this.scrollingTextElement.nativeElement.style.display = 'inline-block'
        } else {
          this.scrollingTextElement.nativeElement.style.animation = `RightToLeft ${duration}s linear infinite`;
        }
      }
    }, 0);
  }

  lang: any;
  async ngOnInit() {
    let url = environment.apiUrl.replace("/service", "");
    this.logoWeb = url + environment.logoWeb;
    if(localStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(localStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.getScreenResolution();
    this.getDeviceApp();

    //update title by component
    this.urlLoginType = JSON.parse(JSON.stringify(sessionStorage.getItem('type')));
    this.dashboardService.getNotificationHeader().subscribe((res:any) =>{
      if(res.result) {
        this.messageNotification = res.result.content;
      }
      this.isMessageNotificationSet = true;
      this.changeDetectorRef.detectChanges();
      this.updateAnimationDuration();
    })
    // this.appService.getTitle().subscribe(appTitle => this.title = appTitle.toString());


    this.appService.getTitle().subscribe(appTitle => {
      return this.title = appTitle.toString()});
      
    this.appService.getSubTitle().subscribe(appSubTitle => {
      return this.subTitle = appSubTitle.toString()});
  
    this.userService.getUserById(JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id).subscribe(
      data => {
        if (environment.flag == 'KD' && data.is_required_sso && environment.usedSSO) {
          this.isSsoSync = true
        } else {
          this.isSsoSync = false
        }
        
        this.nameCurrentUser = data?.name;
        this.phoneCurrentUser = data?.phone;
      });

    this.dashboardService.getNotification(0, '', '', 5, '').subscribe(data => {
      this.numberNotification = data.total_elements;

    });

    if (environment.flag == 'KD' && environment.usedSSO && await this.keycloakService.isLoggedIn()) {
      let accessToken: any = this.keycloakService.getKeycloakInstance().token
      let ssoIdToken: any = this.keycloakService.getKeycloakInstance().idToken
      localStorage.setItem('sso_id_token',ssoIdToken ?? '')
      localStorage.setItem('sso_token',accessToken ?? '')
    }

  }

  checkSubTitle() {
    return this.subTitle.length > 0;
  }

  readAll(){
    this.dashboardService.readAllViewNotification().subscribe(readAll =>{
      if(readAll.status == true){
        this.toastService.showSuccessHTMLWithTimeout('read.all.success',"",3000)
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/dashboard']);
        });
      }
    })
  }

  //apply change title
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  getScreenResolution(): void {
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
  }

  //click logout
  async logout() {
    //call api delete token
    if (environment.flag == 'NB' && environment.usedSSO) {
      this.contractService.deleteToken().subscribe((res:any) => {
     })
 
     sessionStorage.clear();
     localStorage.removeItem('currentUser');
     localStorage.removeItem('myTaxCode');
     localStorage.removeItem('url');
 
    //  this.router.navigate(['/login']);
    await this.keycloakService.login();
    } else {
     let ssoIdToken: any = localStorage.getItem('sso_id_token') || ''
     if (localStorage.getItem('sso_token')) {
       await this.authenticationService.logoutSso(ssoIdToken)
       localStorage.removeItem('sso_token');
       localStorage.clear()
       sessionStorage.clear();
       this.authenticationService.deleteAllCookies()
      //  this.router.navigate(['/login']);
      await this.keycloakService.login();
     } else {
       localStorage.removeItem('sso_token');
       localStorage.clear()
       sessionStorage.clear()
       this.router.navigate(['/login']);
     }
    }
 }

  email: string;
  checkMailMbf() {
    this.email = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.email;

    if(this.email.includes('@mobifone.vn') && environment.flag == 'NB')
      return true;

    return false;
  }

  resetPassword(){
    if ((environment.flag == 'KD' && !this.isSsoSync) || environment.flag == 'NB') {
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
    } else {
      window.open('https://auth-sso.mobifone.vn/vn/profile-information')
    }
    
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

    this.dashboardService.getNotification(0, '', '', 10, '').subscribe(data => {
      //this.numberNotification = data.total_elements;
     this.getAlllistNotification = data.entities
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
  
  backToDashboard(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/dashboard']);
    });
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
    localStorage.setItem('lang', lang);
    sessionStorage.setItem('lang', lang);
  }

}
