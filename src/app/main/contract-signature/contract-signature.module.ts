import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
// import {routing} from "./contract-signature.routing";
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
import {MatDialogModule} from "@angular/material/dialog";
import { ForwardContractComponent } from './shared/model/forward-contract/forward-contract.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ImageSignContractComponent } from './components/consider-contract/image-sign-contract/image-sign-contract.component';
import { ConfirmSignOtpComponent } from './components/consider-contract/confirm-sign-otp/confirm-sign-otp.component';
import { PkiDialogSignComponent } from './components/consider-contract/pki-dialog-sign/pki-dialog-sign.component';
import { ImageDialogSignComponent } from './components/consider-contract/image-dialog-sign/image-dialog-sign.component';
import {NgxSelectModule} from "ngx-select-ex";
import { HsmDialogSignComponent } from './components/consider-contract/hsm-dialog-sign/hsm-dialog-sign.component';
import {AngularSignaturePadModule} from "@almothafar/angular-signature-pad";

export const contractSignatureRoutes: Routes = [
  { path: 'receive/wait-processing/consider-contract/:id', component: ConsiderContractComponent },
  { path: 'receive/wait-processing/personal-signature-contract/:id', component: ConsiderContractComponent },
  // { path: 'receive/wait-processing/coordinates-contract/:id', component: CoordinatesContractComponent },
  { path: 'receive/wait-processing/coordinates-contract/:id', component: IndexComponent },
  { path: 'receive/wait-processing/secretary-contract/:id', component: SecretaryContractComponent },
  { path: 'receive/wait-processing', component: ContractSignatureComponent },
  { path: 'receive/processed', component: ContractSignatureComponent }
];

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
    HeaderContractComponent,
    FooterSignatureComponent,
    ProcessingHandleEcontractComponent,
    ContractSignatureComponent,
    ConsiderContractComponent,
    SignaturePersonalContractComponent,
    CoordinatesContractComponent,
    SecretaryContractComponent,
    SignContractComponent,
    ForwardContractComponent,
    ImageSignContractComponent,
    ConfirmSignOtpComponent,
    PkiDialogSignComponent,
    ImageDialogSignComponent,
    HsmDialogSignComponent,
    // AddContractComponent
  ],
    imports: [
        CommonModule,
        DatepickerModule,
        NgbModule,
        NgxPaginationModule,
        MdbTabsModule,
        RouterModule.forChild(contractSignatureRoutes),
        ReactiveFormsModule,
        NgMultiSelectDropDownModule,
        // routing,
        FormsModule,
        MatDialogModule,
        SweetAlert2Module,
        NgxSelectModule,
        AngularSignaturePadModule,
        // ContractModule
    ],
  providers: [NoAuthGuard]
})
export class ContractSignatureModule { }
