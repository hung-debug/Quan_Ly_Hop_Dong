import { ImageSignContractComponent } from '../contract/detail-contract/image-sign-contract/image-sign-contract.component';
import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// @ts-ignore
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerModule } from 'ng2-datepicker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { ContractHeaderComponent } from './shared/model/contract-header/contract-header.component';
import { ContractFormHeaderComponent } from './form-contract/contract-form-header/contract-form-header.component';
import {InforContractComponent} from "./shared/model/infor-contract/infor-contract.component";
import {SampleContractComponent} from "./shared/model/sample-contract/sample-contract.component";
import {ConfirmInforContractComponent} from "./shared/model/confirm-infor-contract/confirm-infor-contract.component";
import {DetermineSignerComponent} from "./shared/model/determine-signer/determine-signer.component";
import { SignContractComponent } from './shared/sign-sample-contract/sign-contract/sign-contract.component';
import { DetailContractComponent } from './detail-contract/detail-contract.component';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import {ChipsModule} from 'primeng/chips';
import { CancelContractDialogComponent } from './dialog/cancel-contract-dialog/cancel-contract-dialog.component';
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { ContractConnectDialogComponent } from './dialog/contract-connect-dialog/contract-connect-dialog.component';

import {NgxInputSearchModule} from "ngx-input-search";
import { AddConnectDialogComponent } from './dialog/add-connect-dialog/add-connect-dialog.component';
import { ShareContractDialogComponent } from './dialog/share-contract-dialog/share-contract-dialog.component';
import { DeleteContractDialogComponent } from './dialog/delete-contract-dialog/delete-contract-dialog.component';

import { ConfirmContractFormComponent } from './form-contract/confirm-contract-form/confirm-contract-form.component';
import { InforContractFormComponent } from './form-contract/infor-contract-form/infor-contract-form.component';
import { PartyContractFormComponent } from './form-contract/party-contract-form/party-contract-form.component';
import { SampleContractFormComponent } from './form-contract/sample-contract-form/sample-contract-form.component';

import { ContractBatchHeaderComponent } from './batch-contract/contract-batch-header/contract-batch-header.component';
import { InforContractBatchComponent } from './batch-contract/infor-contract-batch/infor-contract-batch.component';
import { ConfirmContractBatchComponent } from './batch-contract/confirm-contract-batch/confirm-contract-batch.component';
import { ConfirmCecaContractComponent } from './shared/model/confirm-ceca-contract/confirm-ceca-contract.component';
import { ConfirmCecaFormComponent } from './form-contract/confirm-ceca-form/confirm-ceca-form.component';
import { ConfirmCecaBatchComponent } from './batch-contract/confirm-ceca-batch/confirm-ceca-batch.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    ContractHeaderComponent,
    ContractFormHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    DetermineSignerComponent,
    SignContractComponent,
    DetailContractComponent,
    ContractBatchHeaderComponent,
    InforContractBatchComponent,
    ImageSignContractComponent,
    CancelContractDialogComponent,
    FilterListDialogComponent,
    ContractConnectDialogComponent,
    AddConnectDialogComponent,
    ShareContractDialogComponent,
    DeleteContractDialogComponent,
    ConfirmContractFormComponent,
    InforContractFormComponent,
    PartyContractFormComponent,
    SampleContractFormComponent,
    ConfirmContractBatchComponent,
    ConfirmCecaContractComponent,
    ConfirmCecaFormComponent,
    ConfirmCecaBatchComponent,
  ],
  exports: [
    ContractHeaderComponent,
    ContractFormHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    DetermineSignerComponent,
    ConfirmContractFormComponent,
    InforContractFormComponent,
    PartyContractFormComponent,
    SampleContractFormComponent,
    ContractBatchHeaderComponent,
    InforContractBatchComponent,
    ConfirmContractBatchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BrowserModule,
    NgMultiSelectDropDownModule.forRoot(),
    DatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    MatFormFieldModule,
    MatSelectModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    NgxInputSearchModule,
    CheckboxModule,
    NgxPaginationModule,
    ChipsModule,
  ],
  entryComponents: [
    ConfirmInforContractComponent,
    ContractHeaderComponent,
    InforContractComponent,
    SampleContractComponent,
    DetermineSignerComponent,
    SignContractComponent,
    ContractFormHeaderComponent,
    ConfirmContractFormComponent,
    InforContractFormComponent,
    PartyContractFormComponent,
    SampleContractFormComponent,
    ContractBatchHeaderComponent,
    InforContractBatchComponent,
    ConfirmContractBatchComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
