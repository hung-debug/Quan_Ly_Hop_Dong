import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { SignContractComponent } from './components/sign-contract/sign-contract.component';
import {NoAuthGuard} from "./shared/no-auth.guard";
import { ContractSignatureComponent } from "./contract-signature.component";
import { DatepickerModule } from "ng2-datepicker";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {MdbTabsModule} from "mdb-angular-ui-kit/tabs";
import { ConsiderContractComponent } from './components/consider-contract/consider-contract.component';
import {RouterModule, Routes} from "@angular/router";
import { SignaturePersonalContractComponent } from './components/signature-personal-contract/signature-personal-contract.component';
import { CoordinatesContractComponent } from './components/coordinates-contract/coordinates-contract.component';
import { SecretaryContractComponent } from './components/secretary-contract/secretary-contract.component';
// import {AddContractComponent} from "./components/contract/add-contract/add-contract.component";
// import {ContractModule} from "./components/contract/contract.module";

export const contractSignatureRoutes: Routes = [
  { path: 'receive/wait-processing/consider-contract/:id', component: ConsiderContractComponent },
  { path: 'receive/wait-processing/personal-signature-contract/:id', component: SignaturePersonalContractComponent },
  { path: 'receive/wait-processing/coordinates-contract/:id', component: CoordinatesContractComponent },
  { path: 'receive/wait-processing/secretary-contract/:id', component: SecretaryContractComponent },
  { path: 'receive/wait-processing', component: ContractSignatureComponent },
  { path: 'receive/processed', component: ContractSignatureComponent }
];

@NgModule({
  declarations: [
    IndexComponent,
    SignContractComponent,
    ContractSignatureComponent,
    ConsiderContractComponent,
    SignaturePersonalContractComponent,
    CoordinatesContractComponent,
    SecretaryContractComponent
    // AddContractComponent
  ],
  imports: [
    CommonModule,
    DatepickerModule,
    NgbModule,
    NgxPaginationModule,
    MdbTabsModule,
    RouterModule.forChild(contractSignatureRoutes)
    // ContractModule
  ],
  providers: [NoAuthGuard]
})
export class ContractSignatureModule { }
