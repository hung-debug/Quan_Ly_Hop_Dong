import { DetailContractComponent } from './main/contract/detail-contract/detail-contract.component';
import { AddContractBatchComponent } from './main/contract/add-contract-batch/add-contract-batch.component';
import { AddContractTemplateComponent } from './main/contract-template/add-contract-template/add-contract-template.component';
import { SignupComponent } from './login/signup/signup.component';
import { ContractTemplateComponent } from './main/contract-template/contract-template.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { AddContractComponent } from './main/contract/add-contract/add-contract.component';
import { ContractComponent } from './main/contract/contract.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserGroupComponent } from './main/user-group/user-group.component';
import { UserComponent } from './main/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './help/auth.guard';
import {NoAuthGuard} from "./main/contract-signature/shared/no-auth.guard";
import {IndexComponent} from "./main/contract-signature/components/index/index.component";
import {ContractSignatureComponent} from "./main/contract-signature/contract-signature.component";
import { UnitComponent } from './main/unit/unit.component';
import { InforUserComponent } from './main/user/infor-user/infor-user.component';
import { ContractTypeComponent } from './main/contract-type/contract-type.component';
import { RoleComponent } from './main/role/role.component';
import { AddUserComponent } from './main/user/add-user/add-user.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'contract-signature/signatures/:data',
    data: { type: 'notAccess'},
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
        path: 'user-infor',
        component: InforUserComponent,
      },
      {
        path: 'user-group',
        component: UserGroupComponent,
      },
      {
        path: 'contract/:action/:status',
        component: ContractComponent,
      },
      {
        path: 'contract-signature',
        loadChildren: () => import('./main/contract-signature/contract-signature.module').then(m => m.ContractSignatureModule)
      },
      {
        path: 'form-contract/:action',
        component: AddContractComponent,
      },
      {
        path: 'form-contract/detail/:id',
        component: DetailContractComponent,
      },
      {
        path: 'form-contract-batch/:action',
        component: AddContractBatchComponent
      },
      {
        path: 'form-contract-batch/:action/:id',
        component: AddContractBatchComponent,
      },
      {
        path: 'contract-template',
        component: ContractTemplateComponent,
      },
      {
        path: 'form-contract-template/:action',
        component: AddContractTemplateComponent,
      },
      {
        path: 'form-contract-template/:action/:id',
        component: AddContractTemplateComponent,
      },
      {
        path: 'unit',
        component: UnitComponent,
      },
      {
        path: 'form-contract/:action',
        component: AddContractComponent,
      },
      {
        path: 'contract-type',
        component: ContractTypeComponent,
      },
      {
        path: 'role',
        component: RoleComponent,
      },
    ],
  },
  // {
  //   path: 'contract-signature',
  //   // loadChildren: () => import('./main/contract-signature/contract-signature.module').then(m => m.ContractSignatureModule),
  //   // component: ContractSignatureComponent,
  //   component: IndexComponent,
  //   data: {type: 'notAccess'},
  //   canActivate: [NoAuthGuard]
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
