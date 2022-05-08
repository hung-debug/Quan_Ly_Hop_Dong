import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-confirm-contract-form',
    templateUrl: './confirm-contract-form.component.html',
    styleUrls: ['./confirm-contract-form.component.scss']
})

export class ConfirmContractFormComponent implements OnInit {
    @Input() datasForm: any;
    @Input() stepForm: any;
    @Output() stepChangeConfirmInforContractform = new EventEmitter<any>();
    @Input() save_draft_infor_form: any;

    constructor(
        private formBuilder: FormBuilder,
        public datepipe: DatePipe,
        private contractService: ContractService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private toastService: ToastService
    ) { this.stepForm = variable.stepSampleContractForm.step4 }

    contractFileName: string = '';
    dateDeadline: string = '';
    comment: string = '';
    userViews: string = '';
    userSigns: string = '';
    userDocs: string = '';
    partnerLeads: string = '';
    partnerViews: string = '';
    partnerSigns: string = '';
    partnerDocs: string = '';
    partnerUsers: string = '';

    connUserViews: string = '';
    connUserSigns: string = '';
    connUserDocs: string = '';
    connPartnerLeads: string = '';
    connPartnerViews: string = '';
    connPartnerSigns: string = '';
    connPartnerDocs: string = '';
    connPartnerUsers: string = '';
    isOrg: boolean = true;
    data_sample_contract: any = [];

    conn: string;
    ngOnInit(): void {
        this.contractFileName = this.datasForm.filename;
        this.dateDeadline = this.datepipe.transform(this.datasForm.end_time, 'dd/MM/yyyy') || '';
        this.comment = this.datasForm.notes;

        if (this.datasForm.is_determine_clone && this.datasForm.is_determine_clone.length > 0) {
            let data_user_sign = [...this.datasForm.is_determine_clone];
            console.log(data_user_sign);
            data_user_sign.forEach((element: any) => {
                if (element.type == 1) {
                    element.recipients.forEach((item: any) => {
                        if (item.role == 2 && item.name) {
                            this.userViews += this.connUserViews + item.name + " - " + item.email;
                            this.connUserViews = "<br>";
                        }
                        else if (item.role == 3 && item.name) {
                            this.userSigns += this.connUserSigns + item.name + " - " + item.email;
                            this.connUserSigns = "<br>";
                        }
                        else if (item.role == 4 && item.name) {
                            this.userDocs += this.connUserDocs + item.name + " - " + item.email;
                            this.connUserDocs = "<br>";
                        }
                    })
                } else if (element.type == 2) {
                    this.isOrg = true;
                    element.recipients.forEach((item: any) => {
                        if (item.role == 1 && item.name) {
                            this.partnerLeads += this.connPartnerLeads + item.name + " - " + item.email;
                            this.connPartnerLeads = "<br>";
                        }
                        else if (item.role == 2 && item.name) {
                            this.partnerViews += this.connPartnerViews + item.name + " - " + item.email;
                            this.connPartnerViews = "<br>";
                        }
                        else if (item.role == 3 && item.name) {
                            this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
                            this.connPartnerSigns = "<br>";
                        }
                        else if (item.role == 4 && item.name) {
                            this.partnerDocs += this.connPartnerDocs + item.name + " - " + item.email;
                            this.connPartnerDocs = "<br>";
                        }
                    })
                } else if (element.type == 3) {
                    this.isOrg = false;
                    element.recipients.forEach((item: any) => {
                        if (item.role == 3 && item.name) {
                            this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
                            this.connPartnerSigns = "<br>";
                        }
                    })
                }
            })
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.step == 'confirm-contract-form') {
            this.SaveContract('saveDraft_contract');
        }
    }

    back(e: any, step?: any) {
        this.nextOrPreviousStep(step);
    }

    nextOrPreviousStep(step: string) {
        this.datasForm.stepLast = step;
        this.stepChangeConfirmInforContractform.emit(step);
    }

    saveDraft() {
        this.toastService.showSuccessHTMLWithTimeout("Lưu nháp thành công!", "", 3000);
        void this.router.navigate(['/main/contract/create/draft']);
    }

    callAPIFinish() {
        //call API step confirm
        //this.contractService.addConfirmContract(this.datasForm).subscribe((data) => {
        this.spinner.show();
        this.contractService.changeStatusContract(this.datasForm.id, 10, "").subscribe((data) => {
            //this.router.navigate(['/main/contract/create/processing']);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/main/contract/create/processing']);
            });
            this.spinner.show();
            this.toastService.showSuccessHTMLWithTimeout("Tạo hợp đồng thành công!", "", 3000);
        },
            error => {
                this.spinner.show();
                this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
                return false;
            }
        );

    }

    async SaveContract(action: string) {
        if (this.router.url.includes("edit")) {
            let isHaveFieldId: any[] = [];
            let isNotFieldId: any[] = [];
            let isUserSign_clone = JSON.parse(JSON.stringify(this.datasForm.contract_user_sign));
            isUserSign_clone.forEach((res: any) => {
                res.sign_config.forEach((element: any) => {
                    if (element.id_have_data) {
                        isHaveFieldId.push(element)
                    } else isNotFieldId.push(element);
                })
            })
            this.getDefinddatasFormignEdit(isHaveFieldId, isNotFieldId, action);
        } 
        else {
            this.data_sample_contract = [];
            let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text"];
    
            let isContractUserSign_clone = JSON.parse(JSON.stringify(this.datasForm.contract_user_sign));
            isContractUserSign_clone.forEach((element: any) => {
                if (element.sign_config.length > 0) {
                    element.sign_config.forEach((item: any) => {
                        item['font'] = 'Arial';
                        item['font_size'] = 14;
                        item['contract_id'] = this.datasForm.contract_id;
                        item['document_id'] = this.datasForm.document_id;
                        if (item.text_attribute_name) {
                            item.name = item.text_attribute_name;
                        }

                        if (item.sign_unit == 'chu_ky_anh') {
                            item['type'] = 2;
                        } else if (item.sign_unit == 'chu_ky_so') {
                            item['type'] = 3;
                        } else if (item.sign_unit == 'so_tai_lieu') {
                            item['type'] = 4;
                            if (this.datasForm.contract_no) {
                                if (!item.name)
                                    item.name = "";

                                if (!item.recipient_id)
                                    item.recipient_id = "";

                                if (!item.status)
                                    item.status = 0;
                            }

                        } else {
                            item['type'] = 1;
                        }

                        data_remove_arr_request.forEach((item_remove: any) => {
                            delete item[item_remove]
                        })
                    })
                    Array.prototype.push.apply(this.data_sample_contract, element.sign_config);
                }
            })

            this.spinner.show();
            this.contractService.getContractSample(this.data_sample_contract).subscribe((data) => {
                if (action == 'finish_contract') {
                    this.callAPIFinish();
                } else {
                    if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
                        this.save_draft_infor_form.close_header = false;
                        this.save_draft_infor_form.close_modal.close();
                    }
                    this.router.navigate(['/main/contract/create/draft']);
                    this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                }
            },
                (error) => {
                    if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
                        this.save_draft_infor_form.close_header = false;
                        this.save_draft_infor_form.close_modal.close();
                    }
                    this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý.", "", 3000);
                    this.spinner.hide();
                }, () => {
                    this.spinner.hide();
                }
            );

        }
    }

    async getDefinddatasFormignEdit(datasFormignId: any, datasFormignNotId: any, action: any) {
        let datasFormample_contract: any[] = [];
        if (datasFormignId.length > 0) {
            let data_remove_arr_signId = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text"];
            datasFormignId.forEach((res: any) => {
                data_remove_arr_signId.forEach((itemRemove: any) => {
                    delete res[itemRemove];
                })
            })

            let countIsSignId = 0;
            this.spinner.show();
            for (let i = 0; i < datasFormignId.length; i++) {
                let id = datasFormignId[i].id_have_data;
                delete datasFormignId[i].id_have_data;
                await this.contractService.getContractSampleEdit(datasFormignId[i], id).toPromise().then((data: any) => {
                    datasFormample_contract.push(data);
                }, (error) => {
                    this.spinner.hide();
                    this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý", "", 3000);
                    countIsSignId++;
                })
                if (countIsSignId > 0) {
                    break;
                }
            }
            // this.spinner.hide();
        }

        let isErrorNotId = false;
        if (datasFormignNotId.length > 0) {
            let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text"];
            datasFormignNotId.forEach((item: any) => {
                item['font'] = 'Arial';
                item['font_size'] = 14;
                item['contract_id'] = this.datasForm.contract_id;
                item['document_id'] = this.datasForm.document_id;
                if (item.text_attribute_name) {
                    item.name = item.text_attribute_name;
                }
                if (item.sign_unit == 'chu_ky_anh') {
                    item['type'] = 2;
                } else if (item.sign_unit == 'chu_ky_so') {
                    item['type'] = 3;
                } else if (item.sign_unit == 'so_tai_lieu') {
                    item['type'] = 4;
                    if (this.datasForm.contract_no) {
                        if (!item.name) 
                        item.name = "";
                    
                      if (!item.recipient_id) 
                        item.recipient_id = "";
                    
                      if (!item.status) 
                        item.status = 0;
                      }
                } else {
                    item['type'] = 1;
                }

                data_remove_arr_request.forEach((item_remove: any) => {
                    delete item[item_remove]
                })
            })
            // Array.prototype.push.apply(this.data_sample_contract, datasFormignNotId);
            await this.contractService.getContractSample(datasFormignNotId).toPromise().then((data) => {
                this.spinner.hide();
            }, error => {
                isErrorNotId = true;
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý", "", 3000);
                return false;
            });
        }

        let isSuccess = 0;
        if (datasFormignId.length > 0 && datasFormample_contract.length != datasFormignId.length) {
            isSuccess += 1;
        }

        if (datasFormignNotId.length > 0 && isErrorNotId) {
            isSuccess += 1;
        }

        if (isSuccess == 0) {
            if (action != 'saveDraft_contract') {
                this.callAPIFinish();
            } else {
                if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
                    this.save_draft_infor_form.close_header = false;
                    this.save_draft_infor_form.close_modal.close();
                }
                this.router.navigate(['/main/contract/create/draft']);
                this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            }
        } else {
            if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
                this.save_draft_infor_form.close_header = false;
                this.save_draft_infor_form.close_modal.close();
            }
        }
    }
}