import { DeleteFolderComponent } from './main/contract-folder/delete-folder/delete-folder.component';
import { AddFolderComponent } from './main/contract-folder/add-folder/add-folder.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartModule } from 'angular-highcharts';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatBadgeModule} from '@angular/material/badge';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { DatepickerModule } from 'ng2-datepicker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './main/user/user.component';
import { ContractComponent } from './main/contract/contract.component';
import { UnitComponent } from './main/unit/unit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AddContractComponent } from './main/contract/add-contract/add-contract.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import {ContractModule} from "./main/contract/contract.module";
import {AppService} from './service/app.service';
import {ContractTemplateComponent} from './main/contract-template/contract-template.component';
import {SignupComponent} from './login/signup/signup.component';
import {MatDialogModule} from "@angular/material/dialog";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSelectModule } from "ngx-select-ex";
import { PipeTrs } from './model/pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { AddUnitComponent } from './main/unit/add-unit/add-unit.component';
import {TreeTableModule} from 'primeng/treetable';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ListboxModule} from 'primeng/listbox';
import { BadgeModule } from "primeng/badge";
import {TreeSelectModule} from 'primeng/treeselect';
import { AddUserComponent } from './main/user/add-user/add-user.component';
import { InforUserComponent } from './main/user/infor-user/infor-user.component';
import { DetailUnitComponent } from './main/unit/detail-unit/detail-unit.component';
import { DetailUserComponent } from './main/user/detail-user/detail-user.component';
import { ContractTypeComponent } from './main/contract-type/contract-type.component';
import { AddContractTypeComponent } from './main/contract-type/add-contract-type/add-contract-type.component';
import { DetailContractTypeComponent } from './main/contract-type/detail-contract-type/detail-contract-type.component';
import { RoleComponent } from './main/role/role.component';
import { AddRoleComponent } from './main/role/add-role/add-role.component';
import { DetailRoleComponent } from './main/role/detail-role/detail-role.component';
import { ResetPasswordDialogComponent } from './main/dialog/reset-password-dialog/reset-password-dialog.component';
import { SendPasswordDialogComponent } from './login/dialog/send-password-dialog/send-password-dialog.component';
import { DeleteRoleComponent } from './main/role/delete-role/delete-role.component';
import { DeleteContractTypeComponent } from './main/contract-type/delete-contract-type/delete-contract-type.component';
import { CheckSignDigitalComponent } from './main/check-sign-digital/check-sign-digital.component';

import { ContractSignatureComponent } from './main/contract-signature/contract-signature.component';
import { NotificationComponent } from './main/notification/notification.component';
import { ActionDeviceComponent } from './action-device/action-device.component';
import { ContractTemplateModule } from './main/contract-template/contract-template.module';
import { NotifiSignupDialogComponent } from './login/dialog/notifi-signup-dialog/notifi-signup-dialog.component';
import { AdminAddUnitComponent } from './admin/admin-main/admin-unit/admin-add-unit/admin-add-unit.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { AdminUnitComponent } from './admin/admin-main/admin-unit/admin-unit.component';
import { AdminSidebarComponent } from './admin/admin-main/admin-sidebar/admin-sidebar.component';
import { AdminUserComponent } from './admin/admin-main/admin-user/admin-user.component';
import { AdminAddUserComponent } from './admin/admin-main/admin-user/admin-add-user/admin-add-user.component';
import { AdminDetailUserComponent } from './admin/admin-main/admin-user/admin-detail-user/admin-detail-user.component';
import { AdminDetailUnitComponent } from './admin/admin-main/admin-unit/admin-detail-unit/admin-detail-unit.component';
import { AdminActiveUnitComponent } from './admin/admin-main/admin-unit/admin-active-unit/admin-active-unit.component';
import { AdminAddPackUnitComponent } from './admin/admin-main/admin-unit/admin-add-pack-unit/admin-add-pack-unit.component';
import { AdminDetailPackUnitComponent } from './admin/admin-main/admin-unit/admin-detail-pack-unit/admin-detail-pack-unit.component';
import { AdminPackComponent } from './admin/admin-main/admin-pack/admin-pack.component';
import { AdminAddPackComponent } from './admin/admin-main/admin-pack/admin-add-pack/admin-add-pack.component';
import { AdminDetailPackComponent } from './admin/admin-main/admin-pack/admin-detail-pack/admin-detail-pack.component';
import { AdminDeleteUserComponent } from './admin/admin-main/admin-user/admin-delete-user/admin-delete-user.component';
import { AdminDeletePackComponent } from './admin/admin-main/admin-pack/admin-delete-pack/admin-delete-pack.component';
import { AdminFilterPackComponent } from './admin/admin-main/admin-pack/dialog/admin-filter-pack/admin-filter-pack.component';
import { AdminFilterUnitComponent } from './admin/admin-main/admin-unit/dialog/admin-filter-unit/admin-filter-unit.component';
import { AdminDeleteUnitComponent } from './admin/admin-main/admin-unit/admin-delete-unit/admin-delete-unit.component';
import { AdminDeletePackUnitComponent } from './admin/admin-main/admin-unit/admin-delete-pack-unit/admin-delete-pack-unit.component';
import { AdminInfoUserComponent } from './admin/admin-main/admin-user/admin-info-user/admin-info-user.component';
import { CustomerComponent } from './main/customer/customer.component';

import {WebcamModule} from 'ngx-webcam';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReportDetailComponent } from './main/report/report-detail/report-detail.component';
import { ReportStatusContractComponent } from './main/report/report-status-contract/report-status-contract.component';
import { ReportSoonExpireComponent } from './main/report/report-soon-expire/report-soon-expire.component';
import { ReportStatusSendSmsEmailComponent } from './main/report/report-status-send-sms-email/report-status-send-sms-email.component';
import { ReportStatusSendEmailComponent } from './main/report/report-contract-send-email/report-contract-send-email.component';
import { ReportEKYCComponent } from './main/report/report-eKYC/report-eKYC.component';
import { ReportContractNumberFollowStatusComponent } from './main/report/report-contract-number-follow-status/report-contract-number-follow-status.component';
import { ReportContractNumberEcontractMsaleComponent } from './main/report/report-contract-number-eContract-mSale/report-contract-number-eContract-mSale.component';
import { ContractNumberFollowSignComponent } from './main/report/contract-number-follow-sign/contract-number-follow-sign.component';

import { ContractNumberFollowTypeComponent } from './main/report/contract-number-follow-type/contract-number-follow-type.component';

import { ConfigSmsEmailComponent } from './main/config-sms-email/config-sms-email.component';
import { DeleteCustomerComponent } from './main/customer/delete-customer/delete-customer.component';
import { CustomerDetailComponent } from './main/customer/customer-detail/customer-detail.component';
import { ContractFolderComponent } from './main/contract-folder/contract-folder.component';
import { ReportContractReceiveComponent } from './main/report/report-contract-receive/report-contract-receive.component';
import { CustomerAddComponent } from './main/customer/customer-add/customer-add.component';
import { CurrentFolderComponent } from './main/contract-folder/current-folder/current-folder.component';
import { AddContractFolderComponent } from './main/contract-folder/current-folder/add-contract-folder/add-contract-folder.component';
import {DigitalCertificateComponent} from './main/digital-certificate/digital-certificate.component';
import {DigitalCertificateAddComponent} from './main/digital-certificate/digital-certificate-add/digital-certificate-add.component';
import {DigitalCertificateDetailComponent} from './main/digital-certificate/digital-certificate-detail/digital-certificate-detail.component';
import {DigitalCertificateEditComponent} from './main/digital-certificate/digital-certificate-edit/digital-certificate-edit.component';
import {ContentSmsComponent} from './main/report/report-status-send-sms-email/content-sms/content-sms.component';
import { ConfigBrandnameDialogComponent } from './main/config-sms-email/config-check-brandname-dialog/config-check-brandname-dialog.component';
import {ContentEmailComponent} from './main/report/report-contract-send-email/content-email/content-email.component';
import { HeadersInterceptor } from './headers.interceptor';
import { UploadAttachFilesComponent } from './main/contract/dialog/upload-attach-files-dialog/upload-attach-files-dialog.component';
import { DeleteContractFolderComponent } from './main/contract-folder/current-folder/delete-contract-folder/delete-contract-folder.component';
import { UploadContractFileComponent } from './main/contract-folder/current-folder/upload-contract-file/upload-contract-file.component';
import { AccountLinkDialogComponent } from './main/dialog/account-link-dialog/account-link-dialog.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatMenuModule } from '@angular/material/menu';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthGuard } from './help/auth.guard';
//import { RouteInterceptorService } from './service/route-interceptor.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

function initializeKeycloak(keycloak: KeycloakService) {
  // const fullUrl = window.location.href
  // if (!fullUrl.includes('/login?type=mobifone-sso'))
  if (environment.flag == 'KD' && environment.usedSSO) {
    return () =>
      keycloak.init({
        config: {
          url: environment.SSO_URL,
          realm: environment.SSO_REALM,
          clientId: environment.SSO_CLIENTID,
        },
        initOptions: {
          checkLoginIframe: false,
          // pkceMethod: "S256",
          // onLoad: 'check-sso',
        },
        enableBearerInterceptor: false,
      })
      .then(
        (authenticated: any) => {
          const idToken: any = keycloak.getKeycloakInstance().idToken;
          const ssoToken: any = keycloak.getKeycloakInstance().token;
          localStorage.setItem('sso_id_token',idToken ?? '')
          localStorage.setItem('sso_token',ssoToken ?? '')
          if (!authenticated) {
            const fullUrl = window.location.href
            if (fullUrl.includes('/login?type=mobifone-sso')) {
              keycloak.login()
            }
            // if(fullUrl.includes('/type=1')){     
            //   console.log("1");
              
            //   return false;
            // }else{
            //   console.log("2");
              
            //   keycloak.login()
            // }
          } 
        }, (err: any) => {
        }
      );
  } else return () => {}
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UserComponent,
    DigitalCertificateComponent,
    DigitalCertificateAddComponent,
    DigitalCertificateDetailComponent,
    DigitalCertificateEditComponent,
    ContentSmsComponent,
    ConfigBrandnameDialogComponent,
    ContentEmailComponent,
    ContractComponent,
    ContractSignatureComponent,
    UnitComponent,
    PageNotFoundComponent,
    DashboardComponent,
    AddContractComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SidebarComponent,
    ContractTemplateComponent,
    SignupComponent,
    PipeTrs,
    AddUnitComponent,
    AddUserComponent,
    InforUserComponent,
    DetailUnitComponent,
    DetailUserComponent,
    ContractTypeComponent,
    AddContractTypeComponent,
    DetailContractTypeComponent,
    RoleComponent,
    AddRoleComponent,
    DetailRoleComponent,
    ResetPasswordDialogComponent,
    SendPasswordDialogComponent,
    DeleteRoleComponent,
    DeleteContractTypeComponent,
    CheckSignDigitalComponent,
    NotificationComponent,
    ActionDeviceComponent,
    NotifiSignupDialogComponent,

    AdminLoginComponent,
    AdminMainComponent,
    AdminSidebarComponent,
    AdminUnitComponent,
    AdminAddUnitComponent,
    AdminDetailUnitComponent,
    AdminUserComponent,
    AdminAddUserComponent,
    AdminDetailUserComponent,
    AdminActiveUnitComponent,
    AdminAddPackUnitComponent,
    AdminDetailPackUnitComponent,
    AdminPackComponent,
    AdminAddPackComponent,
    AdminDetailPackComponent,
    AdminDeleteUserComponent,
    AdminDeletePackComponent,
    AdminFilterPackComponent,
    AdminFilterUnitComponent,
    AdminDeleteUnitComponent,
    AdminDeletePackUnitComponent,
    AdminInfoUserComponent,
    CustomerComponent,

    ReportDetailComponent,
    ReportStatusContractComponent,
    ReportSoonExpireComponent,
    ReportStatusSendSmsEmailComponent,
    ReportStatusSendEmailComponent,
    ReportEKYCComponent,
    ReportContractNumberFollowStatusComponent,
    ReportContractNumberEcontractMsaleComponent,
    ContractNumberFollowSignComponent,
    ContractNumberFollowTypeComponent,

    ContractComponent,
    ConfigSmsEmailComponent,
    DeleteCustomerComponent,
    CustomerDetailComponent,
    ReportContractReceiveComponent,
    ContractFolderComponent,
    CustomerAddComponent,
    AddFolderComponent,
    DeleteFolderComponent,
    CurrentFolderComponent,
    AddContractFolderComponent,
    UploadAttachFilesComponent,
    DeleteContractFolderComponent,
    UploadContractFileComponent,
    AccountLinkDialogComponent
  ],
  imports: [
    PaginatorModule,
    TranslateModule,
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    BsDropdownModule.forRoot(),
    PerfectScrollbarModule,
    MatBadgeModule,
    ContractModule,
    NgMultiSelectDropDownModule,
    MultiSelectModule,
    CommonModule,
    NgxPaginationModule,
    MdbTabsModule,
    DatepickerModule,
    ChartModule,
    AppRoutingModule,
    // ContractSignatureModule,
    MatDialogModule,
    NgxSelectModule,
    MatMenuModule,
    MatTooltipModule,
    SweetAlert2Module.forRoot(
      {
        provideSwal: () => import('sweetalert2').then(({ default: swal }) => swal.mixin({
          confirmButtonText: `Đồng ý`,
          cancelButtonText: `Từ chối`
        }))
      }
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    TreeTableModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    SelectButtonModule,
    ListboxModule,
    BadgeModule,
    ContractTemplateModule,
    TreeSelectModule,
    WebcamModule,
    PdfViewerModule,
    KeycloakAngularModule,
    NgOtpInputModule,
    HighchartsChartModule
  ],
  providers: [ AppService, DatePipe,CurrencyPipe,KeycloakAngularModule, KeycloakService,AuthGuard,
    {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
// AOT compilation support
// export function httpTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
