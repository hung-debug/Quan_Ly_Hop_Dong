import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { MatDialog } from '@angular/material/dialog';
import { PreviewContractTemplateComponent } from '../preview-contract-template/preview-contract-template.component';
@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss']
})
export class ConfirmInforContractComponent implements OnInit, OnChanges {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeConfirmInforContract = new EventEmitter<any>();
  @Input() save_draft_infor: any;

  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private contractTemplateService: ContractTemplateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private contractTypeService: ContractTypeService,
    private dialog: MatDialog,
    ) {
    this.step = variable.stepSampleContract.step4
  }

  contractType:any='';
  data_sample_contract: any = [];
  
  data_organization:any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];

  getPartnerCoordinationer(item: any) {
    return item.recipients.filter((p: any) => p.role == 1)
  }

  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 2)
  }
  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3)
  }
  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4);
  }

  ngOnInit(): void {

    if(this.datas.type_id){
      this.contractTypeService.getContractTypeById(this.datas.type_id).subscribe(data => {
        this.contractType = data.name;
      })
    }

    this.data_organization = this.datas.is_determine_clone.filter((p: any) => p.type == 1)[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);

    this.data_parnter_organization = this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);

    console.log("datas ", this.datas);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'confirm-contract') {
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
    this.toastService.showSuccessHTMLWithTimeout("Lưu nháp thành công!", "", 3000);
    void this.router.navigate(['/main/contract/create/draft']);
  }

  callAPIFinish() {
    this.spinner.show();

    this.contractTemplateService.changeStatusContract(this.datas.id, 10).subscribe((data) => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract-template']);
      });
      this.spinner.hide();
      this.toastService.showSuccessHTMLWithTimeout("Tạo mẫu hợp đồng thành công!", "", 3000);
    },
    error => {
      this.spinner.hide();
      this.toastService.showErrorHTMLWithTimeout("Tạo mẫu hợp đồng thất bại", "", 3000);
      return false;
    }
    );
  }

  async SaveContract(action: string) {
    if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
      let isHaveFieldId: any[] = [];
      let isNotFieldId: any[] = [];
      let isUserSign_clone = JSON.parse(JSON.stringify(this.datas.contract_user_sign));

      isUserSign_clone.forEach((res: any) => {
        res.sign_config.forEach((element: any) => {

          if(element.sign_unit == 'text') {
            element.name = element.text_attribute_name;
          }

          if (element.id_have_data) {
            isHaveFieldId.push(element)
          } else isNotFieldId.push(element);
        })
      })


      this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId, action);
    } else {
      this.data_sample_contract = [];
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "value"];
      let isContractUserSign_clone = JSON.parse(JSON.stringify(this.datas.contract_user_sign));
      isContractUserSign_clone.forEach((element: any) => {
        if (element.sign_config.length > 0) {
          element.sign_config.forEach((item: any) => {
            item['font'] = item.font ? item.font : 'Times New Roman';
            item['font_size'] = item.font_size ? item.font_size : 13;
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

      this.contractTemplateService.getContractSample(this.data_sample_contract).subscribe((data) => {
        if (action == 'finish_contract') {
          this.callAPIFinish();
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

  async getDefindDataSignEdit(dataSignId: any, dataSignNotId: any, action: any) {
    let dataSample_contract: any[] = [];
    if (dataSignId.length > 0) {
      let data_remove_arr_signId = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit'];
      dataSignId.forEach((res: any) => {
        data_remove_arr_signId.forEach((itemRemove: any) => {
          delete res[itemRemove];
        })
      })

      let countIsSignId = 0;
      this.spinner.show();

      for (let i = 0; i < dataSignId.length; i++) {
        let id = dataSignId[i].id_have_data;
        delete dataSignId[i].id_have_data;
        // dataSignId[i].font = this.datas.font;
        // dataSignId[i].font_size = this.datas.size ? this.datas.size : 13;

        console.log("dataSignId ", dataSignId);

        if(!dataSignId[i].type) 
          dataSignId[i].type = 4

        await this.contractTemplateService.editContractSample(dataSignId[i], id).toPromise().then((data: any) => {
          dataSample_contract.push(data);
        }, (error) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý", "", 3000);
          countIsSignId++;
        })
        if (countIsSignId > 0) {
          break;
        }
      }    
    }

    let isErrorNotId = false;
    if (dataSignNotId.length > 0) {
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', 'value'];
      dataSignNotId.forEach((item: any) => {
        item['font'] = item.font ? item.font : 'Times New Roman';
        item['font_size'] = item.font_size ? item.font_size : 13;
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
        } else {
          item['type'] = 1;
        }

        data_remove_arr_request.forEach((item_remove: any) => {
          delete item[item_remove]
        })
      })

      // Array.prototype.push.apply(this.data_sample_contract, dataSignNotId);
      await this.contractTemplateService.getContractSample(dataSignNotId).toPromise().then((data) => {
        this.spinner.hide();
      }, error => {
        isErrorNotId = true;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý", "", 3000);
        return false;
      });
    }

    let isSuccess = 0;
    if (dataSignId.length > 0 && dataSample_contract.length != dataSignId.length) {
      isSuccess += 1;
    }

    if (dataSignNotId.length > 0 && isErrorNotId) {
      isSuccess += 1;
    }

    if (isSuccess == 0) {
      if (action != 'saveDraft_contract') {
        this.spinner.hide();

        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-template']);
        });
        this.toastService.showSuccessHTMLWithTimeout("Sửa mẫu hợp đồng thành công!", "", 3000);
        
      } else {
        if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
          this.save_draft_infor.close_header = false;
          this.save_draft_infor.close_modal.close();
        }
        this.router.navigate(['/main/contract/create/draft']);
        this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      }
    } else {
      if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
    }
  }

  preview() {
    // @ts-ignore
    const dialogRef = this.dialog.open(PreviewContractTemplateComponent, {
      width: '800px',
      data: this.datas,
      backdrop: 'static',
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      
    }) 
  }

  convertToSignConfig() {
    
  }

 
}
