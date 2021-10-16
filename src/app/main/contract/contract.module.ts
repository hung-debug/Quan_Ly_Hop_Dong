import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractHeaderComponent } from './shared/model/contract-header/contract-header.component';
import {InforContractComponent} from "./shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "./shared/model/sample-contract/sample-contract.component";
import {ConfirmInforContractComponent} from "./shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {DetermineSignerComponent} from "./shared/model/determine-signer/determine-signer.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    DetermineSignerComponent
  ],
  exports: [
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    DetermineSignerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ConfirmInforContractComponent,
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    DetermineSignerComponent
  ]
})
export class ContractModule { }
