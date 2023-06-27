import { CurrentFolderComponent } from './main/contract-folder/current-folder/current-folder.component';
import { CustomerAddComponent } from './main/customer/customer-add/customer-add.component';
import { ContractFolderComponent } from './main/contract-folder/contract-folder.component';
import { CustomerDetailComponent } from './main/customer/customer-detail/customer-detail.component';
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
import { ReportDetailComponent } from './main/report/report-detail/report-detail.component';
import { ReportStatusContractComponent } from './main/report/report-status-contract/report-status-contract.component';
import { ReportSoonExpireComponent } from './main/report/report-soon-expire/report-soon-expire.component';
import { ReportContractNumberFollowStatusComponent } from './main/report/report-contract-number-follow-status/report-contract-number-follow-status.component';
import { ContractNumberFollowTypeComponent } from './main/report/contract-number-follow-type/contract-number-follow-type.component';
import { ContractNumberFollowSignComponent } from './main/report/contract-number-follow-sign/contract-number-follow-sign.component';
import { ConfigSmsEmailComponent } from './main/config-sms-email/config-sms-email.component';
import { CustomerComponent } from './main/customer/customer.component';

import {DigitalCertificateComponent} from './main/digital-certificate/digital-certificate.component';
import {DigitalCertificateAddComponent} from './main/digital-certificate/digital-certificate-add/digital-certificate-add.component';
import {DigitalCertificateDetailComponent} from './main/digital-certificate/digital-certificate-detail/digital-certificate-detail.component';
import {DigitalCertificateEditComponent} from './main/digital-certificate/digital-certificate-edit/digital-certificate-edit.component';
import { ReportContractReceiveComponent } from './main/report/report-contract-receive/report-contract-receive.component';

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
        path: 'customer',
        component: CustomerComponent,
      },
      {
        path:'form-customer/:action/:type',
        component: CustomerAddComponent
      },
      {
        path: 'form-customer/:action/:type/:id',
        component: CustomerAddComponent
      },
      {
        path: 'info-customer/:type/:id',
        component: CustomerDetailComponent
      },{
        path: 'contract-folder',
        component: ContractFolderComponent
      },
      {
        path: 'my-folder/:name',
        component: CurrentFolderComponent
      },
      {
        path: 'contract/:action/:status',
        component: ContractComponent,
      },
      {
        path: 'digital-certificate',
        component: DigitalCertificateComponent,
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
        path: 'report',
        children: [
          //Báo cáo chi tiết hợp đồng
          {
            path:'detail',
            component: ReportDetailComponent
          },
          //Báo cáo hợp đồng sắp hết hạn
          {
            path:'soon-expire',
            component: ReportSoonExpireComponent
          },
          //Báo cáo trạng thái xử lý hợp đồng
          {
            path: 'status-contract',
            component: ReportStatusContractComponent
          },
          //Báo cáo số lượng hợp đồng theo trạng thái
          {
            path: 'contract-number-follow-status',
            component: ReportContractNumberFollowStatusComponent
          },
          //Báo cáo số lượng hợp đồng theo loại hợp đồng
          {
            path: 'contract-number-follow-type',
            component: ContractNumberFollowTypeComponent
          },
          //Báo cáo số lượng hợp đồng theo hình thức ký
          {
            path: 'contract-number-follow-sign',
            component: ContractNumberFollowSignComponent
          },
          //Báo cáo số lượng hợp đồng nhận
          { 
            path: 'contract-receive',
            component: ReportContractReceiveComponent
          }
        ]
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
        path:'config-sms-email',
        component: ConfigSmsEmailComponent
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
