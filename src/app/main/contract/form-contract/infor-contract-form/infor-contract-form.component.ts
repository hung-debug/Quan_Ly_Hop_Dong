import { ContractService } from 'src/app/service/contract.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from "moment";
import { HttpErrorResponse } from '@angular/common/http';
import { UploadService } from 'src/app/service/upload.service';
import { variable } from 'src/app/config/variable';
import { AddContractComponent } from '../../add-contract/add-contract.component';

@Component({
    selector: 'app-infor-contract-form',
    templateUrl: './infor-contract-form.component.html',
    styleUrls: ['./infor-contract-form.component.scss']
})

export class InforContractFormComponent implements OnInit {
    @Input() stepForm: any;
    @Input() datasForm: any;
    @Output() stepChangeInfoContractForm = new EventEmitter<string>();
    typeList: Array<any> = [];
    type_id: any;
    name: any;
    sign_time: Date;
    minDate: Date = moment().toDate();

    constructor() {

    }
    
    ngOnInit(): void {
        
    }

    next() {
        this.stepForm = variable.stepSampleContractForm.step2;
              this.datasForm.stepFormLast = this.stepForm;
              // this.datas.document_id = '1';
              this.nextOrPreviousStep(this.stepForm);
              // console.log(this.datas);
    }

    saveDraft() {
        this.stepForm = variable.stepSampleContractForm.step2;
              this.datasForm.stepFormLast = this.stepForm;
              // this.datas.document_id = '1';
              this.nextOrPreviousStep(this.stepForm);
              // console.log(this.datas);
    }

    nextOrPreviousStep(step: string) {
        // this.datas.documents.document.step = step;
        this.datasForm.stepFormLast = step;
        this.stepChangeInfoContractForm.emit(step);
      }
}

