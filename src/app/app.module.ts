import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './main/user/user.component';
import { UserGroupComponent } from './main/user-group/user-group.component';
import { ContractComponent } from './main/contract/contract.component';
import { ReportComponent } from './main/report/report.component';
import { UnitComponent } from './main/unit/unit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AddContractComponent } from './main/contract/add-contract/add-contract.component';

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
    AddContractComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
