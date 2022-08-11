import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ResetPasswordDialogComponent } from 'src/app/main/dialog/reset-password-dialog/reset-password-dialog.component';
import { AppService } from 'src/app/service/app.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { AdminSidebarService } from './admin-sidebar/admin-sidebar.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

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
  selectedRoleConvert: any[];
  qltb: boolean = false;
  adminUnit: boolean = true;


  constructor(private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private appService: AppService,
              public sidebarservice: AdminSidebarService,
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

  ngOnInit(): void {

    console.log("info");
    console.log(JSON.parse(localStorage.getItem('currentAdmin') || ''));

    const permissions =  JSON.parse(localStorage.getItem('currentAdmin') || '').user.permissions;

    if(permissions.length === 0) {
      this.adminUnit = false;
    } 

    this.selectedRoleConvert = [];

    permissions.forEach((key: any) => {
      let jsonData = { code: key.code, name: key.name};
      this.selectedRoleConvert.push(jsonData);
    });

    for(let i = 0; i < this.selectedRoleConvert.length; i++) {
      let role = this.selectedRoleConvert[i].code;

      if(role.includes("QLTB") && this.qltb === false) {
        this.qltb = true;
        break;
      }
    }

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

    this.nameCurrentUser = JSON.parse(localStorage.getItem('currentAdmin') || '').user.name;

    // this.dashboardService.getNotification(0, '', '', 5, '').subscribe(data => {
    //   this.numberNotification = data.total_elements;
    // });
  }

  //apply change title
  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  //click logout
  logout() {
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('');
    localStorage.removeItem('url');
    this.router.navigate(['/admin/login']);
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
      this.router.navigate(['/admin-main/user-infor']);
    });

  }

  openLinkNotification(link:any, id:any) {
    // window.location.href = link.replace('&loginType=', '').replace('&loginType=1', '');
    // this.dashboardService.updateViewNotification(id).subscribe(data => {
    //   console.log(data);
    // });
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

}
