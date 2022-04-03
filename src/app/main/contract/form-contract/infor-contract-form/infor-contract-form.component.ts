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
    form_id: any;
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
    id_form: number;

    attachFormFileNameArr: any[] = [];
    attachFileArr: any[] = [];
    uploadFileAttachAgain: boolean = false;

    constructor(
        private contractService: ContractService,
        private contractTemplateService: ContractTemplateService,
        private toastService: ToastService,
        private spinner: NgxSpinnerService,
        private uploadService: UploadService
    ) { }

    ngOnInit(): void {
        this.datasForm.end_time = this.datasForm.end_time ? moment(this.datasForm.timeDateSign).toDate() : moment(new Date()).add(30, 'day').toDate();
        // this.datasForm.type_id = this.datasForm.type_id ? this.datasForm.type_id : null;
        // this.form_id = this.datasForm.form_id ? this.datasForm.form_id : null;
        this.contractConnect = this.datasForm.contractConnect ? this.datasForm.contractConnect : null;

        if (this.datasForm.attachFormFileNameArr) {
            this.attachFormFileNameArr = this.datasForm.attachFormFileNameArr
        }

        this.getListTypeContract(); // ham get loai hop dong
        this.getContractList(); // ham lay danh sach hop dong
        this.getContractTemplateForm(); // ham lay mau hop dong
        this.convertData();
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

    OnChangeForm(e: any) {
        // console.log(e);
        this.spinner.show();
        this.contractService.getDetailContractFormInfor(e.value).subscribe((res: any) => {
            console.log(res);
            this.datasForm['id_form'] = e.value;
            let dataContractForm = res.filter((p: any) => p.type == 1 && p.status == 1)[0];
            let dataContractAttachForm = res.filter((p: any) => p.type == 3);
            let isDataInfo = this.typeListForm.filter((data: any) => data.id == e.value)[0];
            if (dataContractForm && isDataInfo) {
                this.datasForm.file_content = dataContractForm.path;
                this.datasForm.pdfUrl = dataContractForm.path;
                this.datasForm.contract_no = isDataInfo.code;
                if (isDataInfo.end_time) {
                    this.datasForm.end_time = moment(isDataInfo.end_time).toDate();
                }
                this.datasForm.start_time = isDataInfo.start_time;
                this.datasForm.name = dataContractForm.name;
                this.datasForm.notes = isDataInfo.notes;
                this.datasForm.type_id = isDataInfo.type_id;
            }
            if (dataContractAttachForm) {
                this.datasForm.attachFormFileNameArr = dataContractAttachForm;
                // this.attachFormFileNameArr = dataContractAttachForm
            } else {
                this.datasForm.attachFormFileNameArr = [];
            }
        }, (error) => {
            console.log(error);
            this.spinner.hide();
        }, () => {
            this.spinner.hide();
        });

    }

    onChangeType(e: any) {
        console.log(e);

    }

    onChangeContractConnect(e: any) {
        console.log(e);

    }

    convertData() {
        if (this.datasForm.contractConnect && this.datasForm.contractConnect.length && this.datasForm.contractConnect.length > 0) {
            const array_empty: any[] = [];
            this.datasForm.contractConnect.forEach((element: any, index: number) => {
                console.log(element);
                const data = element.ref_id;
                array_empty.push(data);
            })
            this.contractConnect = array_empty;
            console.log(array_empty);
        }
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
                    // if (this.attachFileArr.filter((p: any) => p.filename == file_name).length == 0) {
                    //     const extension = file.name.split('.').pop();
                    //     this.attachFileArr.push(file);
                    //     this.datasForm.attachFormFileArr = this.attachFileArr;
                    //     if (!this.datasForm.attachFormFileNameArr || this.datasForm.attachFormFileNameArr.length && this.datasForm.attachFormFileNameArr.length == 0) {
                    //         this.datasForm.attachFormFileNameArr = [];
                    //     }
                    //     this.datasForm.attachFormFileNameArr = this.attachFileArr;
                    //     // console.log(this.datasForm.attachFileArr);
                    //     // this.attachFormFileNameArr.push({ filename: file.name });
                        
                    //     this.datasForm.attachFormFileNameArr.push({ filename: file.name })
                    //     // if (this.datasForm.is_action_contract_created) {
                    //     //     this.uploadFileAttachAgain = true;
                    //     // }
                    // }

                    if (this.attachFormFileNameArr.filter((p: any) => p.filename == file_name).length == 0) {
                        const extension = file.name.split('.').pop();
                        //this.datas.file_name_attach = file_name;
                        //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
                        this.attachFileArr.push(file);
                        this.datasForm.attachFileArr = this.attachFileArr;
                        console.log(this.datasForm.attachFileArr);
                        this.attachFormFileNameArr.push({ filename: file.name });
                        if (!this.datasForm.attachFormFileNameArr || this.datasForm.attachFormFileNameArr.length && this.datasForm.attachFormFileNameArr.length == 0) {
                          this.datasForm.attachFormFileNameArr = [];
                        }
                        this.datasForm.attachFormFileNameArr.push({ filename: file.name })
                        // Array.prototype.push.apply(this.datas.attachFileNameArr, this.attachFileNameArr);
            
                        // if (this.datasForm.is_action_contract_created) {
                        //   this.uploadFileAttachAgain = true;
                        // }
                        //this.datas.attachFile = e.target.files;
                      }

                } else {
                    this.datasForm.file_name_attach = '';
                    this.datasForm.attachFile = '';
                    this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu có dung lượng nhỏ hơn 5MB", "", 3000);
                    break;
                }
            }
        }
    }

    deleteFileAttach(item: any, index_dlt: number) {
        if (item.id) {
            this.spinner.show();
            // let data = this.datasForm.i_data_file_contract.filter((p: any) => p.id == item.id)[0];
            let data = this.datasForm.attachFormFileNameArr.filter((p: any) => p.id == item.id)[0];
            if (data) data.status = 0;
            this.contractService.updateFileAttach(item.id, data).subscribe((res: any) => {
                this.datasForm.attachFormFileNameArr.splice(index_dlt, 1);
                this.datasForm.attachFileArr.splice(index_dlt, 1);
                this.toastService.showSuccessHTMLWithTimeout("Xóa file đính kèm thành công!", "", 3000);
            }, error => {
                this.toastService.showErrorHTMLWithTimeout("Lỗi xoá file đính kèm!", "", 3000);
                this.spinner.hide();
            }, () => {
                this.spinner.hide();
            })
        } else {
            this.datasForm.attachFormFileNameArr.splice(index_dlt, 1);
            this.datasForm.attachFileArr.splice(index_dlt, 1);
        }
        // this.attachFileArr.forEach((element, index) => {
        //     if (element.name == item) this.attachFileArr.splice(index, 1);
        // });
        // this.datasForm.attachFileArr = this.attachFileArr;
        // this.datasForm.attachFormFileNameArr = this.attachFileArr;
    }

    validDataForm() {
        if (!this.datasForm.form_id) {
            this.toastService.showWarningHTMLWithTimeout("Vui lòng chọn mẫu hợp đồng!", "", "3000");
            return false;
        }
        if (!this.datasForm.name) {
            this.toastService.showWarningHTMLWithTimeout("Vui lòng nhập tên hợp đồng!", "", "3000");
            return false;
        }

        let isDateSign = new Date(moment(this.datasForm.end_time).format('YYYY-MM-DD'));
        let isDateNow = new Date(moment().format('YYYY-MM-DD'));

        if (Number(isDateSign) < Number(isDateNow)) {
            this.toastService.showErrorHTMLWithTimeout('Ngày hết hạn ký không được nhỏ hơn ngày hiện tại!', "", 3000);
            return false;
        }

        return true;

    }

    async next() {
        if (this.validDataForm()) {
            this.spinner.show();
            let coutError = false;

            if (this.datasForm.contract_no) {
                //check so hop dong da ton tai hay chua
                await this.contractTemplateService.checkCodeUnique(this.datasForm.contract_no, this.datasForm.start_time, this.datasForm.end_time).toPromise().then(
                    dataCode => {
                        if (!dataCode.success) {
                            this.toastService.showErrorHTMLWithTimeout('Số hợp đồng đã tồn tại', "", 3000);
                            this.spinner.hide();
                            coutError = true;
                        }
                    }, (error) => {
                        coutError = true;
                        this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
                        this.spinner.hide();
                    });
            }

            if (!coutError) {
                await this.contractService.addContractStep1(this.datasForm).toPromise().then((data) => {
                    this.datasForm.id = data?.id;
                    this.datasForm.contract_id = data?.id;
                }, (error) => {
                    coutError = true;
                    this.errorData();
                })

                if (this.datasForm.file_content) {
                    if (this.datasForm.file_content && (typeof this.datasForm.file_content == 'string')) {
                        await this.contractService.getDataBinaryFileUrlConvert(this.datasForm.file_content).toPromise().then((res: any) => {
                            if (res)
                                this.datasForm.file_content = res;
                        })
                    }
                }
            }

            if (!coutError) {
                await this.uploadService.uploadFile(this.datasForm.file_content).toPromise().then((data: any) => {
                    this.datasForm.filePath = data.file_object.file_path;
                    this.datasForm.fileName = data.file_object.filename;
                    this.datasForm.fileBucket = data.file_object.bucket;
                }, (error) => {
                    coutError = true;
                    this.errorData();
                })
            }

            if (!coutError) {
                await this.contractService.addDocument(this.datasForm).toPromise().then((res) => {

                }, (error) => {
                    coutError = true;
                    this.errorData();
                })
            }

            if (!coutError) {
                await this.uploadService.uploadFile(this.datasForm.file_content).toPromise().then((data: any) => {
                    this.datasForm.filePathDone = data.file_object.file_path;
                    this.datasForm.fileNameDone = data.file_object.filename;
                    this.datasForm.fileBucketDone = data.file_object.bucket;
                }, (error) => {
                    coutError = true;
                    this.errorData();
                })
            }

            if (!coutError) {
                await this.contractService.addDocumentDone(this.datasForm).toPromise().then((res: any) => {
                    this.datasForm.document_id = res?.id;
                }, () => {
                    coutError = true;
                    this.errorData();
                })
            }

            if (!coutError) {
                await this.contractService.getDataNotifyOriganzation().toPromise().then((data: any) => {
                    this.datasForm.name_origanzation = data.name;
                }, () => {
                    coutError = true;
                    this.errorData();
                })
            }

            if (!coutError) {
                if (this.datasForm.attachFileArr && this.datasForm.attachFileArr.length && this.datasForm.attachFileArr.length > 0) {
                    for (let i = 0; i < this.datasForm.attachFileArr.length; i++) {
                        await this.uploadService.uploadFile(this.datasForm.attachFileArr[i]).toPromise().then((data) => {
                            this.datasForm.filePathAttach = data.file_object.file_path;
                            this.datasForm.fileNameAttach = data.file_object.filename;
                            this.datasForm.fileBucketAttach = data.file_object.bucket;
                        },
                            (error) => {
                                coutError = true;
                                this.spinner.hide();
                                this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);

                            }
                        );

                        if (coutError) {
                            break;
                        }

                        await this.contractService.addDocumentAttach(this.datasForm).toPromise().then((data) => {
                            this.datasForm.document_attach_id = data?.id;
                        },
                            error => {
                                coutError = true;
                                this.spinner.hide();
                                this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                            }
                        );

                        if (coutError) {
                            break;
                        }
                    }

                    if (!coutError) {
                        // if (action != "save_draft") {
                        this.getDataContractForm();
                        // } else {
                        //     if (this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                        //         this.save_draft_infor.close_header = false;
                        //         this.save_draft_infor.close_modal.close();
                        //     }
                        //     this.router.navigate(['/main/contract/create/draft']);
                        //     this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                        // }
                        // this.spinner.hide();
                    }

                } else {
                    // if (action == "save_draft") {
                    //     this.router.navigate(['/main/contract/create/draft']);
                    //     this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                    //   } else {
                    //next step
                    this.getDataContractForm();
                    //   }
                    // this.spinner.hide();
                }
            }
        }
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

    errorData() {
        this.spinner.hide();
        this.toastService.showWarningHTMLWithTimeout("no.push.information.contract.error", "", "3000");
    }

    async getDataContractForm() {
        await this.contractTemplateService.addInforContractTemplate(null, this.datasForm.id_form, 'get-form-data').toPromise().then((res: any) => {
            this.datasForm.is_determine_clone = res.participants;
            this.datasForm.contract_id_action = res.id;
            this.nextForm();
        }, (error) => {
            this.errorData();
        })
    }

    nextForm() {
        this.stepForm = variable.stepSampleContractForm.step2;
        this.datasForm.stepFormLast = this.stepForm;
        this.nextOrPreviousStep(this.stepForm);
        this.spinner.hide();
    }
}

