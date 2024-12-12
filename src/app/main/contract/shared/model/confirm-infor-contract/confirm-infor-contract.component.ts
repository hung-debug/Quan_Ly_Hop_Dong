import { DatePipe } from '@angular/common';
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
import { fileCeCaOptions, variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ConfirmCecaContractComponent } from '../confirm-ceca-contract/confirm-ceca-contract.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss'],
})
export class ConfirmInforContractComponent implements OnInit, OnChanges {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeConfirmInforContract = new EventEmitter<any>();
  @Input() save_draft_infor: any;

  constructor(
    private userService: UserService,
    private unitService: UnitService,
    public datepipe: DatePipe,
    private contractService: ContractService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.step = variable.stepSampleContract.step4;
  }

  data_sample_contract: any = [];

  data_organization: any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];
  temp: any = [];
  
  address_cc: any = [];
  emailPhoneList: string[] = []; // Danh sách email
  currentInput: string = ''; // Giá trị hiện tại trong ô input
  errorMessage: string | null = null;

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

  xSoTaiLieu: any;
  ngOnInit(): void {
    this.contractService.getDataPreRelease(this.datas.contract_id).subscribe((contract: any) => {
      if(contract.address_cc && contract.address_cc.length) {
        this.emailPhoneList = contract.address_cc;  
      }
    });
    this.temp = this.datas;
    this.data_organization = this.datas.is_determine_clone.filter(
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

    this.data_parnter_organization = this.datas.is_determine_clone.filter(
      (p: any) => p.type == 2 || p.type == 3
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.save_draft_infor &&
      this.save_draft_infor.close_header &&
      this.save_draft_infor.step == 'confirm-contract'
    ) {
      this.SaveContract('saveDraft_contract');
    }
  }

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    
    this.datas.stepLast = step;
    this.stepChangeConfirmInforContract.emit(step);
  }

  saveDraft() {
    this.toastService.showSuccessHTMLWithTimeout(
      'Lưu nháp thành công!',
      '',
      3000
    );
    void this.router.navigate(['/main/contract/create/draft']);
  }

  async callAPIFinish() {
    try {
      this.spinner.show();
  
      // Lấy dữ liệu từ API getDataPreRelease
      const contract: any = await this.contractService
        .getDataPreRelease(this.datas.contract_id)
        .toPromise(); // Chuyển Observable thành Promise
      
      // Gán thêm `address_cc` từ emailPhoneList
      contract.address_cc = this.emailPhoneList;
      contract.isAllowFirstHandleEdit = this.datas.isAllowFirstHandleEdit;
  
      // Gọi API addContractRelease
      await this.contractService
        .addContractRelease(contract)
        .toPromise(); // Đợi API này hoàn thành
  
      // Sau khi addContractRelease thành công, gọi API changeStatusContract
      const statusResponse: any = await this.contractService
        .changeStatusContract(this.datas.id, 10, '')
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
  

  async SaveContract(action: string) {
    if (this.datas.is_action_contract_created && this.router.url.includes('edit')) {
      let isHaveFieldId: any[] = [];
      let isNotFieldId: any[] = [];
      let isUserSign_clone = _.cloneDeep(this.datas.contract_user_sign);
      isUserSign_clone.forEach((res: any) => {
        if(res.sign_unit == "chu_ky_so") {
          res.type.forEach((element: any) => {
            element.sign_config.forEach((item: any) => {
              if(item.sign_unit == "chu_ky_so_con_dau") {
                item.width = item.width - 10;
                item.height = item.height - 10;
              }
              if (item.id_have_data) {
                isHaveFieldId.push(item)
              } else isNotFieldId.push(item);
              if (item.name && item.text_attribute_name) {
                item.name = item.text_attribute_name
              }
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
            if (element.name && element.text_attribute_name) {
              element.name = element.text_attribute_name
            }
          });
        }
      });

      this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId, action);
    } else {
      this.data_sample_contract = [];
      let data_remove_arr_request = [
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
        'value',
      ];
      let isContractUserSign_clone = _.cloneDeep(this.datas.contract_user_sign);
      isContractUserSign_clone.forEach((element: any) => {
        if(element.sign_unit == "chu_ky_so") {
          element.type.forEach((res: any) => {
            res.sign_config.forEach((item: any) => {
              item['font'] = item.font ? item.font : 'Times New Roman';
              item['font_size'] =  item.size ? item.size : 13;
              item['contract_id'] = this.datas.contract_id;
              item['document_id'] = this.datas.document_id;
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

              data_remove_arr_request.forEach((item_remove: any) => {
                delete item[item_remove];
              });
            })

            Array.prototype.push.apply(
              this.data_sample_contract,
              res.sign_config
            );
          })
        } else {
          if (element.sign_config.length > 0) {
            element.sign_config.forEach((item: any) => {
              item['font'] = item.font ? item.font : 'Times New Roman';
              item['font_size'] =  item.size ? item.size : 13;
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
                  if (!item.name) item.name = '';
  
                  if (!item.recipient_id) item.recipient_id = '';
  
                  if (!item.status) item.status = 0;
  
                  if(item.contract_no) item.contract_no = item.contract_no.trim();
                }
              } else if(item.sign_unit == 'text'){
                if(item.text_type == "currency"){
                  item['type'] = 5;} else {
                item['type'] = 1;}
              }
  
              data_remove_arr_request.forEach((item_remove: any) => {
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
        if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datas.difX;
        }
      })
      this.contractService.getContractSample(this.data_sample_contract).subscribe(
          (data) => {
            if (action == 'finish_contract') {
              this.callAPIFinish();
            } else {
              if (
                this.save_draft_infor &&
                this.save_draft_infor.close_header &&
                this.save_draft_infor.close_modal
              ) {
                this.save_draft_infor.close_header = false;
                this.save_draft_infor.close_modal.close();
              }
              this.contractService.getDataPreRelease(this.datas.contract_id).subscribe((contract: any) => {
                contract.isAllowFirstHandleEdit = this.datas.isAllowFirstHandleEdit;
                contract.address_cc = this.emailPhoneList;
                this.contractService.addContractRelease(contract).subscribe((res: any) => {
                });
              });
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
              this.save_draft_infor &&
              this.save_draft_infor.close_header &&
              this.save_draft_infor.close_modal
            ) {
              this.save_draft_infor.close_header = false;
              this.save_draft_infor.close_modal.close();
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

  async getDefindDataSignEdit(dataSignId: any,dataSignNotId: any,action: any) {
    let dataSample_contract: any[] = [];
    if (dataSignId.length > 0) {
      let data_remove_arr_signId = [
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
      ];
      dataSignId.forEach((res: any) => {
        data_remove_arr_signId.forEach((itemRemove: any) => {
          delete res[itemRemove];
        });
      });

      let countIsSignId = 0;
      this.spinner.show();

      dataSignId.forEach((element: any) => {
        if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datas.difX;
        }
      })

      for (let i = 0; i < dataSignId.length; i++) {
        let id = dataSignId[i].id_have_data;
        delete dataSignId[i].id_have_data;
        dataSignId[i].contract_no = dataSignId[i].contract_no?.trim();

        await this.contractService.getContractSampleEdit(dataSignId[i], id).toPromise().then(
          async (data: any) => {
              dataSample_contract.push(data);
              this.contractService.getDataPreRelease(this.datas.contract_id).subscribe((contract: any) => {
                contract.isAllowFirstHandleEdit = this.datas.isAllowFirstHandleEdit;
                contract.address_cc = this.emailPhoneList;
                this.contractService.addContractRelease(contract).subscribe((res: any) => {
                });
              });
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
        if (countIsSignId > 0) {
          break;
        }
      }
      // this.spinner.hide();
    }

    let isErrorNotId = false;
    if (dataSignNotId.length > 0) {
      let data_remove_arr_request = [
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
        'value',
      ];
      dataSignNotId.forEach((item: any) => {
        item['font'] = item.font ? item.font : 'Times New Roman';
        item['font_size'] = item.size ? item.size : 13;
        item['contract_id'] = this.datas.contract_id;
        item['document_id'] = this.datas.document_id;
        if (item.text_attribute_name) {
          item.name = item.text_attribute_name;
        }
        if (item.sign_unit == 'chu_ky_anh') {
          item['type'] = 2;
        } else if (item.sign_unit == 'so_tai_lieu') {
          item['type'] = 4;
        } else if(item.sign_unit == 'text'){
          if(item.text_type == "currency"){
            item['type'] = 5;} else {
          item['type'] = 1;}
        } else if (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 3;
        } else if (item.sign_unit == 'chu_ky_so_con_dau') {
          item['type'] = 3;
          item['type_image_signature'] = 2;
        } else if (item.sign_unit == 'chu_ky_so_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 1;
        }

        data_remove_arr_request.forEach((item_remove: any) => {
          delete item[item_remove];
        });
      });

      dataSignNotId.forEach((element: any) => {
        if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datas.difX;
        }
      })
      await this.contractService.getContractSample(dataSignNotId).toPromise().then(
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
      dataSignId.length > 0 &&
      dataSample_contract.length != dataSignId.length
    ) {
      isSuccess += 1;
    }

    if (dataSignNotId.length > 0 && isErrorNotId) {
      isSuccess += 1;
    }

    if (isSuccess == 0) {
      if (action != 'saveDraft_contract') {
        this.callAPIFinish();
      } else {
        if (
          this.save_draft_infor &&
          this.save_draft_infor.close_header &&
          this.save_draft_infor.close_modal
        ) {
          this.save_draft_infor.close_header = false;
          this.save_draft_infor.close_modal.close();
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
        this.save_draft_infor &&
        this.save_draft_infor.close_header &&
        this.save_draft_infor.close_modal
      ) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
    }
  }
}
