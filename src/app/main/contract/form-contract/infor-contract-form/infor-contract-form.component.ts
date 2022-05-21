import { ContractService } from 'src/app/service/contract.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from "moment";
import { HttpErrorResponse } from '@angular/common/http';
import { UploadService } from 'src/app/service/upload.service';
import { variable } from 'src/app/config/variable';
import { AddContractComponent } from '../../add-contract/add-contract.component';
import { ContractTemplateService } from 'src/app/service/contract-template.service';

export class ContractConnectArr {
    ref_id: number;

    constructor(ref_id: number) {
        this.ref_id = ref_id;
    }
}
@Component({
    selector: 'app-infor-contract-form',
    templateUrl: './infor-contract-form.component.html',
    styleUrls: ['./infor-contract-form.component.scss']
})

export class InforContractFormComponent implements OnInit, AfterViewInit {
    @Input() stepForm: any;
    @Input() datasForm: any;
    @Output() stepChangeInfoContractForm = new EventEmitter<string>();
    @Input() save_draft_infor_form: any;
    @ViewChild('nameContract') nameContract: ElementRef;
    typeList: Array<any> = [];
    typeListForm: Array<any> = [];
    type_id: any;
    // name: any;
    sign_time: Date; // ngay het han ky
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

    listFileAttach: any[] = [];
    isChangeForm: boolean = false;
    action: string;
    uploadFileContractAgain: boolean = false;

    constructor(
        private contractService: ContractService,
        private contractTemplateService: ContractTemplateService,
        private toastService: ToastService,
        private spinner: NgxSpinnerService,
        private uploadService: UploadService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        let dataRouter = this.route.params.subscribe((params: any) => {
            this.action = params.action;
        }, null, () => {
            dataRouter.unsubscribe;
        })

        this.datasForm.sign_time = this.datasForm.sign_time ? moment(this.datasForm.sign_time).toDate() : moment(new Date()).add(30, 'day').toDate();
        // this.datasForm.type_id = this.datasForm.type_id ? this.datasForm.type_id : null;
        this.contractConnect = this.datasForm.contractConnect ? this.datasForm.contractConnect : null;
        if (this.datasForm.fileAttachForm && this.datasForm.fileAttachForm.length > 0) {
            this.listFileAttach = this.datasForm.fileAttachForm;
        }

        if (this.datasForm.attachFormFileNameArr) {
            this.attachFormFileNameArr = this.datasForm.attachFormFileNameArr
        }

        if (!this.datasForm.isChangeForm) {
            this.datasForm['isChangeForm'] = false;
        }

        this.getContractTemplateForm(); // ham lay mau hop dong
        this.getListTypeContract(); // ham get contract type
        this.getContractList(); // ham lay danh sach hop dong
        this.convertData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.nameContract.nativeElement.focus();
        }, 0)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.step == 'infor-contract-form') {
            this.next('luu_nhap');
        }
    }

    getListTypeContract() {
        this.contractService.getContractTypeList().subscribe(data => {
            this.typeList = data;
        }, (error) => {
            console.log(error);
        });
    }

    getContractList() {
        this.contractService.getContractList('off', '', '', '', '', '', '', 30, "", "").subscribe(data => {
            this.contractConnectList = data.entities;
        }, (error) => {

        });
    }

    getContractTemplateForm() {
        this.contractTemplateService.getListFileTemplate().subscribe(response => {
            this.typeListForm = response;
        })
    }

    OnChangeForm(e: any) {
        this.spinner.show();
        this.contractService.getDetailContractFormInfor(e.value).subscribe((res: any) => {
            this.datasForm['template_contract_id'] = e.value;
            let dataContractForm = res.filter((p: any) => p.type == 1 && p.status == 1)[0];
            let dataContractAttachForm = res.filter((p: any) => p.type == 3);
            let isDataInfo = this.typeListForm.filter((data: any) => data.id == e.value)[0];
            if (dataContractForm && isDataInfo) {
                this.datasForm.fileBucket = dataContractForm.bucket;
                this.datasForm.fileName = dataContractForm.filename;
                this.datasForm.file_content = dataContractForm.path;
                this.datasForm.contract_no = "";
                this.datasForm.code = "";
                this.datasForm.name = "";
                this.datasForm.pdfUrl = dataContractForm.path;
                if (isDataInfo.sign_time) {
                    this.datasForm.sign_time = moment(isDataInfo.sign_time).toDate();
                }
                this.datasForm.end_time = isDataInfo.end_time;
                this.datasForm.start_time = isDataInfo.start_time;
                this.datasForm.notes = isDataInfo.notes;
                this.datasForm.type_id = isDataInfo.type_id;
                // this.datasForm.document_id = dataContractForm.id;
                // if (this.datasForm.is_data_object_signature) {
                //     this.datasForm.is_data_object_signature = "";
                // }

                this.datasForm['isChangeForm'] = true;

                this.datasForm.contract_user_sign = null;
                this.datasForm.is_determine_clone = [];
                this.datasForm.is_data_object_signature = null;

            }

            if (dataContractAttachForm) {
                this.datasForm.fileAttachForm = dataContractAttachForm; // du lieu file dinh kem tu mau
                this.listFileAttach = this.datasForm.fileAttachForm;
            } else {
                this.datasForm.fileAttachForm = [];
            }

            if (this.datasForm.id) {
                this.contractService.deleteContract(this.datasForm.id).subscribe((data) => {
                    if (data.success) {
                        this.datasForm.id = "";
                        this.datasForm.contract_id = "";
                    } else {
                        this.toastService.showErrorHTMLWithTimeout("error_change_contract_template", "", 3000);
                    }
                },
                    error => {
                        this.toastService.showErrorHTMLWithTimeout("error_change_contract_template", "", 3000);
                    }
                );
            }

            setTimeout(() => {
                this.nameContract.nativeElement.focus();
            }, 100)
        }, (error) => {
            this.spinner.hide();
        }, () => {
            this.spinner.hide();
        });

    }

    defineData(datas: any) {
        if (this.contractConnect && this.contractConnect.length && this.contractConnect.length > 0) {
            const array_empty: ContractConnectArr[] = [];
            this.contractConnect.forEach((element: any, index: number) => {
                const data = new ContractConnectArr(element);
                array_empty.push(data);
            })
            this.datasForm.contractConnect = array_empty;
        } else {
            this.datasForm.contractConnect = null;
        }
    }

    convertData() {
        if (this.datasForm.contractConnect && this.datasForm.contractConnect.length && this.datasForm.contractConnect.length > 0) {
            const array_empty: any[] = [];
            this.datasForm.contractConnect.forEach((element: any, index: number) => {
                const data = element.ref_id;
                array_empty.push(data);
            })
            this.contractConnect = array_empty;
        }
    }

    addFileAttach() {
        // @ts-ignore
        document.getElementById('attachFile').click();
    }

    uploadFileAttachForm(e: any) {
        let files = e.target.files;
        if (!this.datasForm.fileAttachForm) {
            this.datasForm.fileAttachForm = [];
        }
        for (let i = 0; i < files.length; i++) {
            const file = e.target.files[i];
            if (file) {
                if (file.size <= 10000000) {
                    const file_name = file.name;
                    if (this.listFileAttach.filter((p: any) => p.filename == file_name).length == 0) {
                        this.listFileAttach.push(file);
                    }

                    if (!this.datasForm.fileAttachForm.some((p: any) => file.name == p.filename || file.name == p.name)) {
                        this.datasForm.fileAttachForm.push(file);
                    }
                } else {
                    this.datasForm.file_name_attach = '';
                    this.datasForm.attachFile = '';
                    this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu có dung lượng nhỏ hơn 5MB", "", 3000);
                    break;
                }
            }
        }
        if (this.action == 'edit') {
            this.uploadFileContractAgain = true;
        }
        const valueEmpty: any = document.getElementById('attachFile');
        valueEmpty.value = "";
    }

    deleteFileAttach(item: any, index_dlt: number) {
        this.datasForm.fileAttachForm.splice(index_dlt, 1);
        if (this.listFileAttach.some((p: any) => p.filename != item.filename)) {
            this.listFileAttach = this.listFileAttach.filter((p: any) => p.filename != item.filename);
        }

    }

    validDataForm() {
        if (!this.datasForm.template_contract_id) {
            this.toastService.showWarningHTMLWithTimeout("Vui lòng chọn mẫu hợp đồng!", "", "3000");
            return false;
        }
        if (!this.datasForm.name) {
            this.toastService.showWarningHTMLWithTimeout("Vui lòng nhập tên hợp đồng!", "", "3000");
            return false;
        }

        let isDateSign = new Date(moment(this.datasForm.sign_time).format('YYYY-MM-DD'));
        let isDateNow = new Date(moment().format('YYYY-MM-DD'));

        if (Number(isDateSign) < Number(isDateNow)) {
            this.toastService.showErrorHTMLWithTimeout('Ngày hết hạn ký không được nhỏ hơn ngày hiện tại!', "", 3000);
            return false;
        }

        return true;

    }

    // Next step two create form contract
    async next(action: string) {
        this.spinner.show();
        let coutError = false;
        if (this.datasForm.contract_no && action != 'luu_nhap') {
            //check trung so hop dong
            await this.contractService.checkCodeUnique(this.datasForm.contract_no).toPromise().then(
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

        if (!coutError && (action == 'luu_nhap' || (action == 'chuyen_buoc' && this.validDataForm()))) {
            // define du lieu hop dong lien quan
            this.defineData(this.datasForm);
            if (this.action == 'edit') {
                if (this.datasForm.contractConnect && this.datasForm.contractConnect.length && this.datasForm.contractConnect.length > 0) {
                    this.datasForm.contractConnect.forEach((res: any) => {
                        res['contract_id'] = this.datasForm.contract_id;
                    })
                }
            }
            if (!coutError) {
                // push du lieu cac thong tin tao buoc 1
                await this.contractService.addContractStep1(this.datasForm, this.datasForm.contract_id ? this.datasForm.contract_id : null, 'template_form').toPromise().then((data) => {
                    this.datasForm.id = data?.id;
                    this.datasForm.contract_id = data?.id;
                }, (error) => {
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

            // upload file dinh kem (neu add them file dinh kem)
            if (!coutError && this.datasForm.fileAttachForm && this.datasForm.fileAttachForm.length && this.datasForm.fileAttachForm.length > 0) {
                if (this.action != 'edit' || (this.action == 'edit' && this.uploadFileContractAgain)) {
                    for (let i = 0; i < this.datasForm.fileAttachForm.length; i++) {
                        if (!this.datasForm.fileAttachForm[i].id) {
                            let isFileAttach = null;
                            await this.uploadService.uploadFile(this.datasForm.fileAttachForm[i]).toPromise().then((data) => {
                                isFileAttach = {
                                    name: this.datasForm.name,
                                    filePathAttach: data.file_object.file_path,
                                    fileNameAttach: data.file_object.filename,
                                    fileBucketAttach: data.file_object.bucket,
                                    id: this.datasForm.id
                                }
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

                            if (isFileAttach) {
                                await this.contractService.addDocumentAttach(isFileAttach).toPromise().then((data) => {
                                    // this.datasForm.document_attach_id = data?.id;
                                    this.datasForm.fileAttachForm[i].id = data?.id;
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
                        }
                    }
                }


                if (!coutError) {
                    if (action == "chuyen_buoc") {
                        this.getDataContractForm();
                    } else {
                        if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
                            this.save_draft_infor_form.close_header = false;
                            this.save_draft_infor_form.close_modal.close();
                        }
                        this.router.navigate(['/main/contract/create/draft']);
                        this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                    }
                    this.spinner.hide();
                }

            } else if (!coutError) {
                if (action == "luu_nhap") {
                    this.router.navigate(['/main/contract/create/draft']);
                    this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                } else {
                    //next step
                    this.getDataContractForm();
                }
                this.spinner.hide();
            }
            // }
        } else this.spinner.hide();
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
        if (this.action == 'edit') {
            this.nextForm();
        } else {
            let is_create_error = false;
            await this.contractTemplateService.getFileContractFormClone(this.datasForm.template_contract_id, this.datasForm.contract_id).toPromise().then((res: any) => {
                let dataContractTemplate = res.filter((p: any) => p.type == 2 && p.status == 1)[0];
                if (dataContractTemplate) {
                    this.datasForm.document_id = dataContractTemplate.id;
                }
            }, (error) => {
                is_create_error = true;
                this.toastService.showErrorHTMLWithTimeout("error.server", "", 3000);
            })

            if (!is_create_error) {
                if (this.datasForm.isChangeForm) {
                    await this.contractTemplateService.addInforContractTemplate(null, this.datasForm.template_contract_id, 'get-form-data').toPromise().then((res: any) => {
                        this.datasForm.is_determine_clone = res.participants;
                        // this.datasForm.contract_id = res.id;
                        this.nextForm();
                    }, (error) => {
                        this.errorData();
                    })
                } else {
                    this.nextForm();
                }
            }
        }
    }

    nextForm() {
        this.datasForm.isChangeForm = false;
        this.stepForm = variable.stepSampleContractForm.step2;
        this.datasForm.stepFormLast = this.stepForm;
        this.nextOrPreviousStep(this.stepForm);
        this.spinner.hide();
    }
}

