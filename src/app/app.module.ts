import { NgxPaginationModule } from 'ngx-pagination';
import { ChartModule } from 'angular-highcharts';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatBadgeModule} from '@angular/material/badge';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule, DatePipe} from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { DatepickerModule } from 'ng2-datepicker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import {ContractSignatureModule} from "./main/contract-signature/contract-signature.module";
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

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UserComponent,
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
  ],
  imports: [
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
    CommonModule,
    NgxPaginationModule,
    MdbTabsModule,
    DatepickerModule,
    ChartModule,
    AppRoutingModule,
    // ContractSignatureModule,
    MatDialogModule,
    NgxSelectModule,
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
  ],
  providers: [ AppService, DatePipe,
    {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }],
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
