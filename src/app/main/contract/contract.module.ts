import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// @ts-ignore
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerModule } from 'ng2-datepicker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ContractHeaderComponent } from './shared/model/contract-header/contract-header.component';
import {InforContractComponent} from "./shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "./shared/model/sample-contract/sample-contract.component";
import {ConfirmInforContractComponent} from "./shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {DetermineSignerComponent} from "./shared/model/determine-signer/determine-signer.component";
import { SignContractComponent } from './shared/sign-sample-contract/sign-contract/sign-contract.component';
import { DetailContractComponent } from './detail-contract/detail-contract.component';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AddContractBatchComponent } from './add-contract-batch/add-contract-batch.component';
import { ContractBatchHeaderComponent } from './shared-batch/model/contract-batch-header/contract-batch-header.component';
import { ConfirmInforContractBatchComponent } from './shared-batch/model/confirm-infor-contract-batch/confirm-infor-contract-batch.component';
import { InforContractBatchComponent } from './shared-batch/model/infor-contract-batch/infor-contract-batch.component';
// import {NotificationService} from "../../service/notification/notification.service";


@NgModule({
  declarations: [
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    DetermineSignerComponent,
    SignContractComponent,
    DetailContractComponent,
    AddContractBatchComponent,
    ContractBatchHeaderComponent,
    ConfirmInforContractBatchComponent,
    InforContractBatchComponent
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
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    DatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    ConfirmInforContractComponent,
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    DetermineSignerComponent,
    SignContractComponent
  ],
  providers: []
})
export class ContractModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
