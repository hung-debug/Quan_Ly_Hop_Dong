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
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };
@NgModule({
  declarations: [
    ShareContractTemplateDialogComponent,
    StopContractTemplateDialogComponent,
    ReleaseContractTemplateDialogComponent,
    DeleteContractTemplateDialogComponent
  ],
  imports: [  
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
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

