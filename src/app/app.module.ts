import {NgxPaginationModule} from 'ngx-pagination';
import {ChartModule} from 'angular-highcharts';
import {MdbTabsModule} from 'mdb-angular-ui-kit/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {MatBadgeModule} from '@angular/material/badge';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {CommonModule} from '@angular/common';

import {DatepickerModule} from 'ng2-datepicker';


import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {UserComponent} from './main/user/user.component';
import {UserGroupComponent} from './main/user-group/user-group.component';
import {ContractComponent} from './main/contract/contract.component';
import {ReportComponent} from './main/report/report.component';
import {UnitComponent} from './main/unit/unit.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {DashboardComponent} from './main/dashboard/dashboard.component';
import {AddContractComponent} from './main/contract/add-contract/add-contract.component';
import {ForgotPasswordComponent} from './login/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './login/reset-password/reset-password.component';
import {SidebarComponent} from './main/sidebar/sidebar.component';
import {ContractModule} from "./main/contract/contract.module";
import {AppService} from './service/app.service';
import {ContractTemplateComponent} from './main/contract-template/contract-template.component';
import {AddContractTemplateComponent} from './main/contract-template/add-contract-template/add-contract-template.component';
import {ConfirmInforContractTemplateComponent} from './main/contract-template/shared/model/confirm-infor-contract-template/confirm-infor-contract-template.component';
import {ContractTemplateHeaderComponent} from './main/contract-template/shared/model/contract-template-header/contract-template-header.component';
import {DetermineSignerTemplateComponent} from './main/contract-template/shared/model/determine-signer-template/determine-signer-template.component';
import {InforContractTemplateComponent} from './main/contract-template/shared/model/infor-contract-template/infor-contract-template.component';
import {SampleContractTemplateComponent} from './main/contract-template/shared/model/sample-contract-template/sample-contract-template.component';
import {SignupComponent} from './login/signup/signup.component';
import {ContractSignatureModule} from "./main/contract-signature/contract-signature.module";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UserComponent,
    UserGroupComponent,
    ContractComponent,
    ReportComponent,
    UnitComponent,
    PageNotFoundComponent,
    DashboardComponent,
    AddContractComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SidebarComponent,
    ContractTemplateComponent,
    AddContractTemplateComponent,
    ConfirmInforContractTemplateComponent,
    ContractTemplateHeaderComponent,
    DetermineSignerTemplateComponent,
    InforContractTemplateComponent,
    SampleContractTemplateComponent,
    SignupComponent,
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
    // ContractSignatureModule // nguyên nhân lỗi The `Invalid configuration of route '**'. One of the following must ...
  ],
  providers: [AppService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }],

  bootstrap: [AppComponent]
})
export class AppModule {
}
