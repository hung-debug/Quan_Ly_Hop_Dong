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

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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
        path: 'user-group',
        component: UserGroupComponent,
      },
      {
        path: 'contract/:status',
        component: ContractComponent,
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
      // {
      //   path: 'step-3-contract',
      //   component: createContractComponent
      // }
    ],
  },
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
