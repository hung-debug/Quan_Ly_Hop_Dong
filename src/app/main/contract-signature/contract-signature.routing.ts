import {ModuleWithProviders, NgModule} from "@angular/core";
import {Router, RouterModule, Routes} from "@angular/router";
import {IndexComponent} from "./components/index/index.component";
import {NoAuthGuard} from "./shared/no-auth.guard";


const routes: Routes = [
  {
    // path: 'signature-contract',
    // data: {type: 'notAccess'},
    // component: IndexComponent,
    // canActivate: [NoAuthGuard]
  }
];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);
