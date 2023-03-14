import {DetailContractComponent} from './main/contract/detail-contract/detail-contract.component';
import {SignupComponent} from './login/signup/signup.component';
import {ContractTemplateComponent} from './main/contract-template/contract-template.component';
import {ResetPasswordComponent} from './login/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './login/forgot-password/forgot-password.component';
import {AddContractComponent} from './main/contract/add-contract/add-contract.component';
import {ContractComponent} from './main/contract/contract.component';
import {DashboardComponent} from './main/dashboard/dashboard.component';
import {MainComponent} from './main/main.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UserComponent} from './main/user/user.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './help/auth.guard';
import {UnitComponent} from './main/unit/unit.component';
import {InforUserComponent} from './main/user/infor-user/infor-user.component';
import {ContractTypeComponent} from './main/contract-type/contract-type.component';
import {RoleComponent} from './main/role/role.component';
import {AddUserComponent} from './main/user/add-user/add-user.component';
import {DetailUserComponent} from './main/user/detail-user/detail-user.component';
import {CheckSignDigitalComponent} from './main/check-sign-digital/check-sign-digital.component';

import { NotificationComponent } from './main/notification/notification.component';
import { AddContractTemplateComponent } from './main/contract-template/add-contract-template/add-contract-template.component';
import { DetailContractTemplateComponent } from './main/contract-template/detail-contract-template/detail-contract-template.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminAuthGuard } from './help/admin-auth.guard';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { AdminUnitComponent } from './admin/admin-main/admin-unit/admin-unit.component';
import { AdminUserComponent } from './admin/admin-main/admin-user/admin-user.component';
import { AdminPackComponent } from './admin/admin-main/admin-pack/admin-pack.component';
import { AdminInfoUserComponent } from './admin/admin-main/admin-user/admin-info-user/admin-info-user.component';
import { MultiSignListComponent } from './main/contract-signature/components/multi-sign-list/multi-sign-list.component';
import { ReportComponent } from './main/report/report.component';

const contract_signatures = "c";
const signatures = "s9";
const consider = "c9";
const secretary = "s8";
const coordinates = "c8";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'handle/:data',
    data: {type: 'notAccess'},
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: contract_signatures+'/'+signatures+'/:data',
    data: {type: 'notAccess'},
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contract-signature'+'/'+'signatures'+'/:data',
    data: {type: 'notAccess'},
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contract-template/form/detail/:data',
    data: {type: 'notAccess'},
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form-contract/detail/:data',
    data: {type: 'notAccess'},
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'form-user/:action',
        component: AddUserComponent,
      },
      {
        path: 'form-user/:action/:id',
        component: AddUserComponent,
      },
      {
        path: 'user-detail/:id',
        component: DetailUserComponent,
      },
      {
        path: 'user-infor',
        component: InforUserComponent,
      },
      {
        path: 'contract/:action/:status',
        component: ContractComponent,
      },
      {
        path: contract_signatures,
        loadChildren: () => import('./main/contract-signature/contract-signature.module').then(m => m.ContractSignatureModule)
      },
      {
        path: 'contract-signature',
        loadChildren: () => import('./main/contract-signature/contract-signature.module').then(m => m.ContractSignatureModule)
      },
      {
        path: 'form-contract/detail/:id',
        component: DetailContractComponent,
      },
      {
        path:'form-contract/multi-sign-list',
        component: MultiSignListComponent
      },
      {
        path: 'form-contract/detail/forward/:id',
        component: DetailContractComponent,
      },
      {
        path: 'form-contract/detail/reject/:id',
        component: DetailContractComponent,
      },
      {
        path: 'form-contract/detail/verify/:id',
        component: DetailContractComponent,
      },
      {
        path: 'form-contract/:action',
        component: AddContractComponent,
      },
      {
        path: 'form-contract/:action/:id',
        component: AddContractComponent,
      },
      {
        path: 'contract-template',
        component: ContractTemplateComponent,
      },
      {
        path: 'contract-template/form/:action',
        component: AddContractTemplateComponent,
      },
      {
        path: 'contract-template/form/detail/:id',
        component: DetailContractTemplateComponent,
      },
      {
        path: 'contract-template/form/:action/:id',
        component: AddContractTemplateComponent,
      },
      {
        path: 'unit',
        component: UnitComponent,
      },
      {
        path: 'contract-type',
        component: ContractTypeComponent,
      },
      {
        path: 'role',
        component: RoleComponent,
      },
      {
        path: 'check-sign-digital',
        component: CheckSignDigitalComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
      {
        path:'report',
        component: ReportComponent
      }
    ],
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin-main',
    canActivate: [AdminAuthGuard],
    component: AdminMainComponent,
    children: [
      {
        path: 'unit',
        component: AdminUnitComponent,
      },
      {
        path: 'user',
        component: AdminUserComponent,
      },
      {
        path: 'pack',
        component: AdminPackComponent,
      },
      {
        path: 'user-infor',
        component: AdminInfoUserComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
