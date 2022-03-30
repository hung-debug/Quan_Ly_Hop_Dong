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
    @Input() datas: any;
    @Input() step: any;
    @Output() stepChangeConfirmInforContractform = new EventEmitter<any>();
    @Input() save_draft_infor: any;

    constructor(
        private formBuilder: FormBuilder,
        public datepipe: DatePipe,
        private contractService: ContractService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private toastService: ToastService
    ) { this.step = variable.stepSampleContract.step4 }

    contractFileName: string = 'hopDongTheoMau.pdf';
    dateDeadline: string = '29/04/2022';
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

    ngOnInit(): void {

    }

    back(e: any, step?: any) {
        // this.nextOrPreviousStep(step);
    }

    async SaveContract(action: string) {
        if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
            let isHaveFieldId: any[] = [];
            let isNotFieldId: any[] = [];
            let isUserSign_clone = JSON.parse(JSON.stringify(this.datas.contract_user_sign));
            isUserSign_clone.forEach((res: any) => {
                res.sign_config.forEach((element: any) => {
                    if (element.id_have_data) {
                        isHaveFieldId.push(element)
                    } else isNotFieldId.push(element);
                })
            })
            // this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId, action);
        } else {
            this.data_sample_contract = [];
            let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "value"];
            let isContractUserSign_clone = JSON.parse(JSON.stringify(this.datas.contract_user_sign));
            isContractUserSign_clone.forEach((element: any) => {
                if (element.sign_config.length > 0) {
                    element.sign_config.forEach((item: any) => {
                        item['font'] = 'Arial';
                        item['font_size'] = 14;
                        item['contract_id'] = this.datas.contract_id;
                        item['document_id'] = this.datas.document_id;
                        if (item.text_attribute_name) {
                            item.name = item.text_attribute_name;
                        }

                        if (item.sign_unit == 'chu_ky_anh') {
                            item['type'] = 2;
                        } else if (item.sign_unit == 'chu_ky_so') {
                            item['type'] = 3;
                        } else if (item.sign_unit == 'so_tai_lieu') {
                            item['type'] = 4;
                            if (this.datas.contract_no) {
                                if (!item.name)
                                    item.name = null;

                                if (!item.recipient_id)
                                    item.recipient_id = null;

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
                    // this.callAPIFinish();
                } else {
                    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                        this.save_draft_infor.close_header = false;
                        this.save_draft_infor.close_modal.close();
                    }
                    this.router.navigate(['/main/contract/create/draft']);
                    this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                }
            },
                (error) => {
                    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                        this.save_draft_infor.close_header = false;
                        this.save_draft_infor.close_modal.close();
                    }
                    this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý.", "", 3000);
                    this.spinner.hide();
                }, () => {
                    this.spinner.hide();
                }
            );

        }
    }
}