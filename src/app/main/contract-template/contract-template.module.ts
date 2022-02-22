import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ShareContractTemplateDialogComponent } from './dialog/share-contract-template-dialog/share-contract-template-dialog.component';
import { StopContractTemplateDialogComponent } from './dialog/stop-contract-template-dialog/stop-contract-template-dialog.component';
import { ReleaseContractTemplateDialogComponent } from './dialog/release-contract-template-dialog/release-contract-template-dialog.component';
import { DeleteContractTemplateDialogComponent } from './dialog/delete-contract-template-dialog/delete-contract-template-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChipsModule } from 'primeng/chips';
import { InforContractComponent } from './shared/model/infor-contract/infor-contract.component';
import { DetermineSignerComponent } from './shared/model/determine-signer/determine-signer.component';
import { SampleContractComponent } from './shared/model/sample-contract/sample-contract.component';
import { ConfirmInforContractComponent } from './shared/model/confirm-infor-contract/confirm-infor-contract.component';
import { SignContractComponent } from './shared/sign-sample-contract/sign-contract/sign-contract.component';
import { AddContractComponent } from './add-contract/add-contract.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };
@NgModule({
  declarations: [
    ShareContractTemplateDialogComponent,
    StopContractTemplateDialogComponent,
    ReleaseContractTemplateDialogComponent,
    DeleteContractTemplateDialogComponent,
    InforContractComponent,
    DetermineSignerComponent,
    SampleContractComponent,
    ConfirmInforContractComponent,
    SignContractComponent,
    AddContractComponent
  ],  
  imports: [  
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    CheckboxModule,
    NgxPaginationModule,
    ChipsModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractTemplateModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

