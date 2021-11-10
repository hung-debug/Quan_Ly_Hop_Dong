import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import {routing} from "./contract-signature.routing";
import {NoAuthGuard} from "./shared/no-auth.guard";
import { AddContractComponent } from './components/contract-coordination/add-contract/add-contract.component';
import { InforContractComponent } from './components/contract-coordination/shared/model/infor-contract/infor-contract.component';
import { DetermineSignerComponent } from './components/contract-coordination/shared/model/determine-signer/determine-signer.component';
import { SampleContractComponent } from './components/contract-coordination/shared/model/sample-contract/sample-contract.component';
import { ConfirmInfoContractComponent } from './components/contract-coordination/shared/model/confirm-info-contract/confirm-info-contract.component';
import { ContractHeaderComponent } from './components/contract-coordination/shared/model/contract-header/contract-header.component';
import { InforCoordinationComponent } from './components/contract-coordination/shared/infor-coordination/infor-coordination.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {DatepickerModule} from "ng2-datepicker";
import {SignContractComponent} from "./shared/model/sign-contract/sign-contract.component";

@NgModule({
  declarations: [
    IndexComponent,
    AddContractComponent,
    InforContractComponent,
    DetermineSignerComponent,
    SampleContractComponent,
    ConfirmInfoContractComponent,
    ContractHeaderComponent,
    InforCoordinationComponent,
    SignContractComponent
  ],
    imports: [
        CommonModule,
        routing,
        FormsModule,
        NgMultiSelectDropDownModule,
        DatepickerModule,
        ReactiveFormsModule,
    ],
  providers: [NoAuthGuard]
})
export class ContractSignatureModule { }
