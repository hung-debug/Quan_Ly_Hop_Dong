import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { SignContractComponent } from './components/sign-contract/sign-contract.component';
import {routing} from "./contract-signature.routing";
import {NoAuthGuard} from "./shared/no-auth.guard";
// import {AddContractComponent} from "./components/contract/add-contract/add-contract.component";
// import {ContractModule} from "./components/contract/contract.module";

@NgModule({
  declarations: [
    IndexComponent,
    SignContractComponent,
    // AddContractComponent
  ],
  imports: [
    CommonModule,
    routing,
    // ContractModule
  ],
  providers: [NoAuthGuard]
})
export class ContractSignatureModule { }
