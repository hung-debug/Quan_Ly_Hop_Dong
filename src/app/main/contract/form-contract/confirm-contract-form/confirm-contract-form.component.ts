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
import { ContractTemplateService } from 'src/app/service/contract-template.service';

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
    private dialog: MatDialog,
    private ContractTemplateService: ContractTemplateService
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
  userSignType: any;
    
  address_cc: any = [];
  emailPhoneList: string[] = []; // Danh sách email
  currentInput: string = ''; // Giá trị hiện tại trong ô input
  errorMessage: string | null = null;
  
  ngOnInit(): void {    
    this.spinner.hide();
    this.ContractTemplateService.addInforContractTemplate(null,this.datasForm.template_contract_id,'get-form-data').subscribe((contract:any)=>{
      if(this.datasForm.address_cc && this.datasForm.address_cc.length) {
        this.emailPhoneList = this.datasForm.address_cc;
      } else {
        if(contract.address_cc && contract.address_cc.length) {
          this.emailPhoneList = contract.address_cc;  
        }
      }
    });
    
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

    if (!this.datasForm.contract_user_sign) {
      if (this.datasForm.is_data_object_signature && this.datasForm.is_data_object_signature.length && this.datasForm.is_data_object_signature.length > 0) {
        this.datasForm.is_data_object_signature.forEach((res: any) => {
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
  
  addEmail(): void {
    if (this.currentInput.trim()) {
      const inputs  = this.currentInput.split(','); // Hỗ trợ nhập nhiều email 1 lần, ngăn cách bằng dấu phẩy
      for (let input of inputs) {
        input = input.trim();
        if (!this.isValidInput(input)) {
          this.errorMessage = `"${input}" không đúng định dạng email`;
          return; // Ngừng lại nếu có lỗi
        }
        if (!this.emailPhoneList.includes(input)) {
          this.emailPhoneList.push(input);
        }
        console.log("emailPhoneList",this.emailPhoneList);
        
      }
      this.currentInput = ''; // Xóa nội dung input sau khi thêm
      this.errorMessage = null; // Xóa thông báo lỗi nếu không có lỗi
    }
  }
  
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      // Ngăn hành vi mặc định nếu cần (như xuống dòng với Enter)
      event.preventDefault();
      this.addEmail(); // Gọi hàm thêm email/phone
    }
  }
  
  // Hàm kiểm tra định dạng email
  isValidInput(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^(?:\+[0-9]{11}|[0-9]{10,11})$/;
    // return emailRegex.test(input) || phoneRegex.test(input);
    return emailRegex.test(input.trim());
  }
  
  removeEmail(input: string): void {
    this.emailPhoneList = this.emailPhoneList.filter(e => e !== input);
  }
  
  async callAPIFinish() {
    try{
      this.spinner.show();
      // Gọi API addContractStep1 lần đầu    
      const contract: any = await this.contractService.addContractStep1(
        this.datasForm,
        this.datasForm.contract_id ? this.datasForm.contract_id : null,
        'template_form'
      ).toPromise();
      
      contract.address_cc = this.emailPhoneList;
      
      const result: any = await this.contractService.addContractStep1(
        contract,
        this.datasForm.contract_id ? this.datasForm.contract_id : null,
        'template_form'
      ).toPromise();
      
      // Sau khi addContractRelease thành công, gọi API changeStatusContract
      const statusResponse: any = await this.contractService
        .changeStatusContract(this.datasForm.id, 10, '')
        .toPromise(); // Đợi kết quả từ API
        
      // Kiểm tra kết quả trả về từ changeStatusContract
      if (statusResponse.errors?.length > 0) {
        if (statusResponse.errors[0].code === 1017) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('contract.no.existed', '', 3000);
          return;
        }
      } else {
        // Điều hướng nếu thành công
        this.router.navigate(['/main/contract/create/processing']);
        await this.router.navigateByUrl('/', { skipLocationChange: true });
        this.router.navigate(['/main/contract/create/processing']);
  
        // Hiển thị thông báo thành công
        this.toastService.showSuccessHTMLWithTimeout('create.contract.success', '', 3000);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
      this.toastService.showErrorHTMLWithTimeout('no.push.information.contract.error', '', 3000);
    } finally {
      this.spinner.hide(); // Đảm bảo spinner được ẩn dù có lỗi hay không
    } 
      
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
    //             'Lỗi lưu thông tin xác nhận đẩy file tài liệu lên Bộ Công Thương',
    //             '',
    //             3000
    //           );
    //         }
    //       );
    //     //this.SaveContract(action);
    //   }
    // });
  }

  setValueForContractNo(dataSign: any) {
    dataSign.forEach((item:any) => {
      if (item.type === 4) {
        item.value = this.datasForm.contract_no;
      }
    });
  }

  isButtonDisabled: boolean = false;
  async SaveContract(action: string) {
    if (this.router.url.includes('edit')) {
      let isHaveFieldId: any[] = [];
      let isNotFieldId: any[] = [];
      let isUserSign_clone = _.cloneDeep(this.datasForm.contract_user_sign);

      isUserSign_clone.forEach((res: any) => {
        if(res.sign_unit == "chu_ky_so") {
          res.type.forEach((element: any) => {
            element.sign_config.forEach((item: any) => {
              if(item.sign_unit == "chu_ky_so_con_dau") {
                item.width = item.width - 10;
                item.height = item.height - 10;
              }
              if (item.id_have_data) {
                item.type = 3;
                isHaveFieldId.push(item);
              } else isNotFieldId.push(item);
            })
          })
        } else {
          res.sign_config.forEach((element: any) => {
            if(!element.type) {
              if(element.sign_unit == 'chu_ky_anh') {
                element.type = 2;
              } else if(element.sign_unit == 'chu_ky_so') {
                element.type = 3;
              } else if(element.sign_unit == 'so_tai_lieu') {
                element.type = 4;
              } else {
                element.type = 1;
              }
            }
  
            if (element.id_have_data) {
              isHaveFieldId.push(element);
            } else isNotFieldId.push(element);
          });
        }

      });
      this.getDefinddatasFormignEdit(isHaveFieldId, isNotFieldId, action);
    } else {
      this.data_sample_contract = [];
      let isContractUserSign_clone = _.cloneDeep(
        this.datasForm.contract_user_sign
      );
      isContractUserSign_clone.forEach((element: any) => {
        if(element.sign_unit == "chu_ky_so") {
          element.type.forEach((res: any) => {
            if (res.sign_config.length > 0) {
              res.sign_config.forEach((item: any) => {
                item['font'] = item.font ? item.font : 'Times New Roman';
                item['font_size'] = item.font_size ? item.font_size : 12;
                item['contract_id'] = this.datasForm.contract_id;
                item['document_id'] = this.datasForm.document_id;
                if (item.text_attribute_name) {
                  item.name = item.text_attribute_name;
                }
    
                if (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin') {
                  item['type'] = 3;
                  item['type_image_signature'] = 3;
                } else if (item.sign_unit == 'chu_ky_so_con_dau') {
                  item.width = item.width - 10;
                  item.height = item.height - 10;
                  item['type'] = 3;
                  item['type_image_signature'] = 2;
                } else if (item.sign_unit == 'chu_ky_so_thong_tin') {
                  item['type'] = 3;
                  item['type_image_signature'] = 1;
                }
    
                this.arrVariableRemove.forEach((item_remove: any) => {
                  delete item[item_remove];
                });
              });
              Array.prototype.push.apply(
                this.data_sample_contract,
                res.sign_config
              );
            }
          })
        } else {
          if (element.sign_config.length > 0) {
            element.sign_config.forEach((item: any) => {
              item['font'] = item.font ? item.font : 'Times New Roman';
              item['font_size'] = item.font_size ? item.font_size : 12;
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
  
                  if(item.contract_no) item.contract_no = item.contract_no.trim();
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
        }
      });

      this.spinner.show();

      this.data_sample_contract.forEach((element: any) => {
        if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datasForm.difX;
        }
      })

      this.setValueForContractNo(this.data_sample_contract);
      this.contractService.getContractSample(this.data_sample_contract).subscribe(
          (data) => {
            if (action == 'finish_contract') {
              this.isButtonDisabled = true;
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
              'Vui lòng liên hệ đội hỗ trợ để được xử lý.',
              '',
              3000
            );
            this.spinner.hide();
          },
          () => {
            // this.spinner.hide();
          }
        );
    }
  }

  async getDefinddatasFormignEdit(datasFormignId: any,datasFormignNotId: any,action: any) {
    let datasFormample_contract: any[] = [];
    if (datasFormignId.length > 0) {
      datasFormignId.forEach((res: any) => {
        this.arrVariableRemove.forEach((itemRemove: any) => {
          if (itemRemove !== 'id_have_data') {
            delete res[itemRemove];
          }
        });
      });

      let countIsSignId = 0;
      this.spinner.show();

      datasFormignId.forEach((element: any) => {
        if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datasForm.difX;
        }
      })

      this.setValueForContractNo(datasFormignId);
      for (let i = 0; i < datasFormignId.length; i++) {
        let id = datasFormignId[i].id_have_data;
        delete datasFormignId[i].id_have_data;
        datasFormignId[i].contract_no = datasFormignId[i].contract_no?.trim();

        await this.contractService.getContractSampleEdit(datasFormignId[i], id).toPromise().then((data: any) => {
              datasFormample_contract.push(data);
            },
            (error) => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout(
                'Vui lòng liên hệ đội hỗ trợ để được xử lý',
                '',
                3000
              );
              countIsSignId++;
            }
          );
          
        const contract: any = await this.contractService.addContractStep1(
          this.datasForm,
          this.datasForm.contract_id ? this.datasForm.contract_id : null,
          'template_form'
        ).toPromise();
        contract.address_cc = this.emailPhoneList;
        const result: any = await this.contractService.addContractStep1(contract,this.datasForm.contract_id ? this.datasForm.contract_id : null,'template_form').toPromise();
        
        if (countIsSignId > 0) {
          break;
        }
      }
      // this.spinner.hide();
    }

    let isErrorNotId = false;
    if (datasFormignNotId.length > 0) {
      datasFormignNotId.forEach((item: any) => {
        item['font'] = item.font ? item.font : 'Times New Roman';
        item['font_size'] = item.font_size ? item.font_size : 12;
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
        } else if (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 3;
        } else if (item.sign_unit == 'chu_ky_so_con_dau') {
          item['type'] = 3;
          item['type_image_signature'] = 2;
        } else if (item.sign_unit == 'chu_ky_so_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 1;
        } else {
          item['type'] = 1;
        }

        this.arrVariableRemove.forEach((item_remove: any) => {
          delete item[item_remove];
        });
      });

      datasFormignNotId.forEach((element: any) => {
        if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datasForm.difX;
        }
      })
      await this.contractService.getContractSample(datasFormignNotId).toPromise().then(
          (data) => {
            this.spinner.hide();
          },
          (error) => {
            isErrorNotId = true;
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout(
              'Vui lòng liên hệ đội hỗ trợ để được xử lý',
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
