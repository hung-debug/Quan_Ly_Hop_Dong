import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ConfirmCecaFormComponent } from '../confirm-ceca-form/confirm-ceca-form.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-confirm-contract-form',
  templateUrl: './confirm-contract-form.component.html',
  styleUrls: ['./confirm-contract-form.component.scss'],
})
export class ConfirmContractFormComponent implements OnInit {
  @Input() datasForm: any;
  @Input() stepForm: any;
  @Output() stepChangeConfirmInforContractform = new EventEmitter<any>();
  @Input() save_draft_infor_form: any;

  constructor(
    public datepipe: DatePipe,
    private contractService: ContractService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.stepForm = variable.stepSampleContractForm.step4;
  }

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
  arrVariableRemove = [
    'id',
    'sign_unit',
    'position',
    'left',
    'top',
    'text_attribute_name',
    'sign_type',
    'signature_party',
    'is_type_party',
    'role',
    'recipient',
    'email',
    'is_disable',
    'selected',
    'type_unit',
    'is_have_text',
    'id_have_data',
  ];
  data_organization: any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];

  conn: string;
  ngOnInit(): void {
    this.spinner.hide();
    this.data_organization = this.datasForm.is_determine_clone.filter(
      (p: any) => p.type == 1
    )[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter(
      (p: any) => p.role == 2
    );
    this.is_origanzation_signature = this.data_organization.recipients.filter(
      (p: any) => p.role == 3
    );
    this.is_origanzation_document = this.data_organization.recipients.filter(
      (p: any) => p.role == 4
    );

    this.data_parnter_organization = this.datasForm.is_determine_clone.filter(
      (p: any) => p.type == 2 || p.type == 3
    );

    console.log("vao day ");
    console.log("dsf ", this.datasForm);
    if (!this.datasForm.contract_user_sign) {
      if (this.datasForm.is_data_object_signature && this.datasForm.is_data_object_signature.length && this.datasForm.is_data_object_signature.length > 0) {
        this.datasForm.is_data_object_signature.forEach((res: any) => {
          console.log("res ", res);
          res['id_have_data'] = res.id;
          if (res.type == 1) {
            res['sign_unit'] = 'text';
            res['text_attribute_name'] = res.name;
            res.name = res.text_attribute_name;
          }
          if (res.type == 2) {
            res['sign_unit'] = 'chu_ky_anh';
            res.name = res.recipient.name;
          }
          if (res.type == 3) {
            res['sign_unit'] = 'chu_ky_so'
            res.name = res.recipient.name;
          }
          if (res.type == 4) {
            res['sign_unit'] = 'so_tai_lieu'
          }
        })
      }
    }
  }

  getPartnerCoordinationer(item: any) {
    return item.recipients.filter((p: any) => p.role == 1);
  }

  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 2);
  }
  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3);
  }
  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.save_draft_infor_form &&
      this.save_draft_infor_form.close_header &&
      this.save_draft_infor_form.step == 'confirm-contract-form'
    ) {
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
    this.toastService.showSuccessHTMLWithTimeout(
      'Lưu nháp thành công!',
      '',
      3000
    );
    void this.router.navigate(['/main/contract/create/draft']);
  }

  callAPIFinish() {
    //call API step confirm
    //this.contractService.addConfirmContract(this.datasForm).subscribe((data) => {
    this.spinner.show();
    this.contractService
      .changeStatusContract(this.datasForm.id, 10, '')
      .subscribe(
        (data) => {
          //this.router.navigate(['/main/contract/create/processing']);
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/main/contract/create/processing']);
            });
          this.spinner.show();
          this.toastService.showSuccessHTMLWithTimeout(
            'Tạo hợp đồng thành công!',
            '',
            3000
          );
        },
        (error) => {
          this.spinner.show();
          this.toastService.showErrorHTMLWithTimeout(
            'no.push.information.contract.error',
            '',
            3000
          );
          return false;
        }
      );
  }

  user: any;
  submit(action: string) {

    this.SaveContract(action);

    //Lấy thông tin chi tiết tổ chức của tôi
    // const data = {
    //   title: 'YÊU CẦU XÁC NHẬN',
    // };
    // // @ts-ignore
    // const dialogRef = this.dialog.open(ConfirmCecaFormComponent, {
    //   width: '560px',
    //   backdrop: 'static',
    //   keyboard: false,
    //   data,
    //   autoFocus: false,
    // });
    // dialogRef.afterClosed().subscribe((isCeCA: any) => {
    //   if (isCeCA == 1 || isCeCA == 0) {
    //     this.spinner.show();
    //     this.contractService
    //       .updateContractIsPushCeCA(this.datasForm.id, isCeCA)
    //       .subscribe(
    //         (data) => {
    //           this.SaveContract(action);
    //         },
    //         (error) => {
    //           this.spinner.hide();
    //           this.toastService.showErrorHTMLWithTimeout(
    //             'Lỗi lưu thông tin xác nhận đẩy file hợp đồng lên Bộ Công Thương',
    //             '',
    //             3000
    //           );
    //         }
    //       );
    //     //this.SaveContract(action);
    //   }
    // });
  }

  async SaveContract(action: string) {
    if (this.router.url.includes('edit')) {
      let isHaveFieldId: any[] = [];
      let isNotFieldId: any[] = [];
      let isUserSign_clone = _.cloneDeep(this.datasForm.contract_user_sign);

      isUserSign_clone.forEach((res: any) => {
        console.log("res ", res);
        res.sign_config.forEach((element: any) => {
          console.log("el ", element);
          if (element.id_have_data) {
            isHaveFieldId.push(element);
          } else isNotFieldId.push(element);
        });
      });
      this.getDefinddatasFormignEdit(isHaveFieldId, isNotFieldId, action);
    } else {
      this.data_sample_contract = [];
      let isContractUserSign_clone = _.cloneDeep(
        this.datasForm.contract_user_sign
      );
      isContractUserSign_clone.forEach((element: any) => {
        if (element.sign_config.length > 0) {
          element.sign_config.forEach((item: any) => {
            item['font'] = this.datasForm.font;
            item['font_size'] = this.datasForm.size;
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
                if (!item.name) item.name = '';

                if (!item.recipient_id) item.recipient_id = '';

                if (!item.status) item.status = 0;
              }
            } else {
              item['type'] = 1;
            }

            this.arrVariableRemove.forEach((item_remove: any) => {
              delete item[item_remove];
            });
          });
          Array.prototype.push.apply(
            this.data_sample_contract,
            element.sign_config
          );
        }
      });

      this.spinner.show();
      this.contractService
        .getContractSample(this.data_sample_contract)
        .subscribe(
          (data) => {
            if (action == 'finish_contract') {
              this.callAPIFinish();
            } else {
              if (
                this.save_draft_infor_form &&
                this.save_draft_infor_form.close_header &&
                this.save_draft_infor_form.close_modal
              ) {
                this.save_draft_infor_form.close_header = false;
                this.save_draft_infor_form.close_modal.close();
              }
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout(
                'no.push.contract.draft.success',
                '',
                3000
              );
            }
          },
          (error) => {
            if (
              this.save_draft_infor_form &&
              this.save_draft_infor_form.close_header &&
              this.save_draft_infor_form.close_modal
            ) {
              this.save_draft_infor_form.close_header = false;
              this.save_draft_infor_form.close_modal.close();
            }
            this.toastService.showErrorHTMLWithTimeout(
              'Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý.',
              '',
              3000
            );
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
    }
  }

  async getDefinddatasFormignEdit(
    datasFormignId: any,
    datasFormignNotId: any,
    action: any
  ) {
    let datasFormample_contract: any[] = [];
    if (datasFormignId.length > 0) {
      console.log("dsid ", datasFormignId);
      datasFormignId.forEach((res: any) => {
        this.arrVariableRemove.forEach((itemRemove: any) => {
          console.log("itt ", itemRemove);
          if (itemRemove !== 'id_have_data') {
            delete res[itemRemove];
          }
        });
      });

      let countIsSignId = 0;
      this.spinner.show();
      for (let i = 0; i < datasFormignId.length; i++) {
        let id = datasFormignId[i].id_have_data;
        delete datasFormignId[i].id_have_data;

        // datasFormignId[i].font_size = this.datasForm.size;
        // datasFormignId[i].font = this.datasForm.font;
        await this.contractService
          .getContractSampleEdit(datasFormignId[i], id)
          .toPromise()
          .then(
            (data: any) => {
              datasFormample_contract.push(data);
            },
            (error) => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout(
                'Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý',
                '',
                3000
              );
              countIsSignId++;
            }
          );
        if (countIsSignId > 0) {
          break;
        }
      }
      // this.spinner.hide();
    }

    let isErrorNotId = false;
    if (datasFormignNotId.length > 0) {
      datasFormignNotId.forEach((item: any) => {
        item['font'] = this.datasForm.font;
        item['font_size'] = this.datasForm.size;
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
            if (!item.name) item.name = '';

            if (!item.recipient_id) item.recipient_id = '';

            if (!item.status) item.status = 0;
          }
        } else {
          item['type'] = 1;
        }

        this.arrVariableRemove.forEach((item_remove: any) => {
          delete item[item_remove];
        });
      });
      // Array.prototype.push.apply(this.data_sample_contract, datasFormignNotId);
      await this.contractService
        .getContractSample(datasFormignNotId)
        .toPromise()
        .then(
          (data) => {
            this.spinner.hide();
          },
          (error) => {
            isErrorNotId = true;
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout(
              'Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý',
              '',
              3000
            );
            return false;
          }
        );
    }

    let isSuccess = 0;
    if (
      datasFormignId.length > 0 &&
      datasFormample_contract.length != datasFormignId.length
    ) {
      isSuccess += 1;
    }

    if (datasFormignNotId.length > 0 && isErrorNotId) {
      isSuccess += 1;
    }

    if (isSuccess == 0) {
      if (action != 'saveDraft_contract') {
        this.callAPIFinish();
      } else {
        if (
          this.save_draft_infor_form &&
          this.save_draft_infor_form.close_header &&
          this.save_draft_infor_form.close_modal
        ) {
          this.save_draft_infor_form.close_header = false;
          this.save_draft_infor_form.close_modal.close();
        }
        this.router.navigate(['/main/contract/create/draft']);
        this.toastService.showSuccessHTMLWithTimeout(
          'no.push.contract.draft.success',
          '',
          3000
        );
      }
    } else {
      if (
        this.save_draft_infor_form &&
        this.save_draft_infor_form.close_header &&
        this.save_draft_infor_form.close_modal
      ) {
        this.save_draft_infor_form.close_header = false;
        this.save_draft_infor_form.close_modal.close();
      }
    }
  }
}
