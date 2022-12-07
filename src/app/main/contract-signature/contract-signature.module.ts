import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
// import {routing} from "./contract-signature.routing";
import { DatepickerModule } from "ng2-datepicker";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {MdbTabsModule} from "mdb-angular-ui-kit/tabs";
import { ConsiderContractComponent } from './components/consider-contract/consider-contract.component';
import {RouterModule, Routes} from "@angular/router";
import { SignaturePersonalContractComponent } from './components/signature-personal-contract/signature-personal-contract.component';
import { CoordinatesContractComponent } from './components/coordinates-contract/coordinates-contract.component';
import { SecretaryContractComponent } from './components/secretary-contract/secretary-contract.component';
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
import { HeaderContractComponent } from './components/header-contract/header-contract.component';
import { FooterSignatureComponent } from './components/footer-signature/footer-signature.component';
import { ProcessingHandleEcontractComponent } from './shared/model/processing-handle-econtract/processing-handle-econtract.component';
import {SignContractComponent} from "./components/contract-coordination/shared/sign-sample-contract/sign-contract/sign-contract.component";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { ForwardContractComponent } from './shared/model/forward-contract/forward-contract.component';
import {TranslateModule} from "@ngx-translate/core";
import { InfoSignContractComponent } from './shared/info-sign-contract/info-sign-contract.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ImageSignContractComponent } from './components/consider-contract/image-sign-contract/image-sign-contract.component';
import { ConfirmSignOtpComponent } from './components/consider-contract/confirm-sign-otp/confirm-sign-otp.component';
import { PkiDialogSignComponent } from './components/consider-contract/pki-dialog-sign/pki-dialog-sign.component';
import { ImageDialogSignComponent } from './components/consider-contract/image-dialog-sign/image-dialog-sign.component';
import {NgxSelectModule} from "ngx-select-ex";
import { HsmDialogSignComponent } from './components/consider-contract/hsm-dialog-sign/hsm-dialog-sign.component';
import {AngularSignaturePadModule} from "@almothafar/angular-signature-pad";
import {ChooseTypeSignComponent} from "./components/consider-contract/choose-type-sign/choose-type-sign.component";
import {NgxSpinnerModule} from "ngx-spinner";
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';

import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import { DisplayDigitalSignatureComponent } from './display-digital-signature/display-digital-signature.component';
import {TextSignatureImageComponent} from './components/text-signature-image/text-signature-image.component';
import { ContractSignatureComponent } from './contract-signature.component';
import { DisplaySignatureImageComponent } from './display-signature-image/display-signature-image.component';
import { NotificationExpireComponent } from './components/contract-coordination/shared/model/dialog/notification-expire/notification-expire.component';
import { DialogSignManyComponentComponent } from './dialog/dialog-sign-many-component/dialog-sign-many-component.component';
import { EkycDialogSignComponent } from './components/consider-contract/ekyc-dialog-sign/ekyc-dialog-sign.component';
import { WebcamModule } from 'ngx-webcam';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DialogReasonRejectedComponent } from './shared/model/dialog-reason-rejected/dialog-reason-rejected.component';

const signatures = "s9";
const consider = "c9";
const secretary = "s8";
const coordinates = "c8";

export const contractSignatureRoutes: Routes = [
  { path: consider+'/:id', component: ConsiderContractComponent },
  { path: signatures+'/:id', component: ConsiderContractComponent },
  // { path: 'receive/wait-processing/coordinates-contract/:id', component: CoordinatesContractComponent },
  { path: coordinates+'/:id', component: IndexComponent },
  { path: secretary+'/:id', component: ConsiderContractComponent },
  { path: 'receive/:status', component: ContractSignatureComponent }
];

export const contractSignatureRoutes1: Routes = [
  { path: 'consider'+'/:id', component: ConsiderContractComponent },
  { path: 'signatures'+'/:id', component: ConsiderContractComponent },
  // { path: 'receive/wait-processing/coordinates-contract/:id', component: CoordinatesContractComponent },
  { path: 'coordinates'+'/:id', component: IndexComponent },
  { path: 'secretary'+'/:id', component: ConsiderContractComponent },
  { path: 'receive/:status', component: ContractSignatureComponent }
];

@NgModule({
  declarations: [
    DisplayDigitalSignatureComponent,
    IndexComponent,
    AddContractComponent,
    InforContractComponent,
    DetermineSignerComponent,
    SampleContractComponent,
    ConfirmInfoContractComponent,
    ContractHeaderComponent,
    InforCoordinationComponent,
    HeaderContractComponent,
    FooterSignatureComponent,
    ProcessingHandleEcontractComponent,
    ConsiderContractComponent,
    SignaturePersonalContractComponent,
    CoordinatesContractComponent,
    SecretaryContractComponent,
    SignContractComponent,
    ForwardContractComponent,
    ImageSignContractComponent,
    ConfirmSignOtpComponent,
    PkiDialogSignComponent,
    ChooseTypeSignComponent,
    ImageDialogSignComponent,
    HsmDialogSignComponent,
    FilterListDialogComponent,
    DisplayDigitalSignatureComponent,
    TextSignatureImageComponent,
    DisplaySignatureImageComponent,
    NotificationExpireComponent,
    DialogSignManyComponentComponent,
    EkycDialogSignComponent,
    DialogReasonRejectedComponent,
    // AddContractComponent
  ],
  imports: [
    CommonModule,
    DatepickerModule,
    NgbModule,
    NgxPaginationModule,
    MdbTabsModule,
    RouterModule.forChild(contractSignatureRoutes),
    RouterModule.forChild(contractSignatureRoutes1),
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    // routing,
    FormsModule,
    MatDialogModule,
    SweetAlert2Module,
    NgxSelectModule,
    AngularSignaturePadModule,
    TranslateModule,
    NgxSpinnerModule,
    // ContractModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,

    WebcamModule,
    PdfViewerModule,
    TranslateModule
  ],
  providers: [
    NoAuthGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]

})
export class ContractSignatureModule { }
