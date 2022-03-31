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
import { ContractTemplateService } from 'src/app/service/contract-template.service';

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
    typeListForm: Array<any> = [];
    type_id: any;
    // name: any;
    timeDateSign: Date; // ngay het han ky
    minDate: Date = moment().toDate();
    dataStepInfo = {

    }
    isShare: string = 'off';

    contractConnectList: Array<any> = [];
    contractConnect: any;
    name: any = "";
    type: any = "";
    p: number = 1;
    page: number = 5;
    code: any;

    attachFileNameArr: any[] = [];
    attachFileArr: any[] = [];
    uploadFileAttachAgain: boolean = false;

    constructor(
        private contractService: ContractService,
        private contractTemplateService: ContractTemplateService,
        private toastService: ToastService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit(): void {
        this.timeDateSign = this.datasForm.timeDateSign ? moment(this.datasForm.timeDateSign).toDate() : moment(new Date()).add(30, 'day').toDate();
        this.type_id = this.datasForm.type_id ? this.datasForm.type_id : null;
        this.contractConnect = this.datasForm.contractConnect ? this.datasForm.contractConnect : null;

        this.getListTypeContract();
        this.getContractList();
        this.getContractTemplateForm();
    }

    getListTypeContract() {
        this.contractService.getContractTypeList().subscribe(data => {
            this.typeList = data;
        }, (error) => {
            console.log(error);
        });
    }

    getContractList() {
        this.contractService.getContractList('off', '', '', '', '', '', 30, "", "").subscribe(data => {
            // console.log(data.entities);
            this.contractConnectList = data.entities;
        }, (error) => {

        });
    }

    getContractTemplateForm() {

        this.contractTemplateService.getContractTemplateList(this.isShare, this.name, this.type, this.p, this.page).subscribe(response => {
            console.log(response);
            this.typeListForm = response.entities;
            // this.pageTotal = response.total_elements;
        })

    }

    addFileAttach() {
        // @ts-ignore
        document.getElementById('attachFile').click();
    }

    fileChangedAttach(e: any) {
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {

            const file = e.target.files[i];
            if (file) {
                // giới hạn file upload lên là 5mb
                if (file.size <= 5000000) {
                    const file_name = file.name;
                    if (this.attachFileNameArr.filter((p: any) => p.filename == file_name).length == 0) {
                        const extension = file.name.split('.').pop();
                        //this.datas.file_name_attach = file_name;
                        //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
                        this.attachFileArr.push(file);
                        this.datasForm.attachFileArr = this.attachFileArr;
                        console.log(this.datasForm.attachFileArr);
                        this.attachFileNameArr.push({ filename: file.name });
                        if (!this.datasForm.attachFileNameArr || this.datasForm.attachFileNameArr.length && this.datasForm.attachFileNameArr.length == 0) {
                            this.datasForm.attachFileNameArr = [];
                        }
                        this.datasForm.attachFileNameArr.push({ filename: file.name })
                        // Array.prototype.push.apply(this.datas.attachFileNameArr, this.attachFileNameArr);

                        if (this.datasForm.is_action_contract_created) {
                            this.uploadFileAttachAgain = true;
                        }
                        //this.datas.attachFile = e.target.files;
                    }
                    // else{
                    //   this.toastService.showErrorHTMLWithTimeout("Trùng file đính kèm", "", 3000);
                    // }

                } else {
                    this.datasForm.file_name_attach = '';
                    this.datasForm.attachFile = '';
                    this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 5MB", "", 3000);
                    break;
                }
            }
        }
    }

    deleteFileAttach(item: any, index_dlt: number) {
        // this.attachFileNameArr.forEach((element, index) => {
        //   if (element == item) this.attachFileNameArr.splice(index, 1);
        // });
        if (item.id) {
          this.spinner.show();
          let data = this.datasForm.i_data_file_contract.filter((p: any) => p.id == item.id)[0];
          if (data) data.status = 0;
          this.contractService.updateFileAttach(item.id, data).subscribe((res: any) => {
            this.datasForm.attachFileNameArr.splice(index_dlt, 1);
          }, error => {
            this.toastService.showErrorHTMLWithTimeout("Lỗi xoá file đính kèm!", "", 3000);
            this.spinner.hide();
          }, () => {
            this.spinner.hide();
          })
        } else {
          this.datasForm.attachFileNameArr.splice(index_dlt, 1);
        }
        // this.datas.attachFileNameArr = this.attachFileNameArr;
        this.attachFileArr.forEach((element, index) => {
          // console.log(element.name);
          if (element.name == item) this.attachFileArr.splice(index, 1);
        });
        this.datasForm.attachFileArr = this.attachFileArr;
        // console.log(this.datas.attachFileArr);
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

