import {DatePipe} from '@angular/common';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {variable} from 'src/app/config/variable';
import {ContractService} from 'src/app/service/contract.service';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-confirm-info-contract',
  templateUrl: './confirm-info-contract.component.html',
  styleUrls: ['./confirm-info-contract.component.scss']
})
export class ConfirmInfoContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeConfirmInforContract = new EventEmitter<string>();

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
    "is_have_text",
    "id_have_data"
  ];

  constructor(private formBuilder: FormBuilder,
              public datepipe: DatePipe,
              private contractService: ContractService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,) {
    this.step = variable.stepSampleContract.step4
  }

  data_sample_contract: any = [];

  data_organization: any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];

  isFileName: string;

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
    this.data_organization = this.datas.determine_contract.filter((p: any) => p.type == 1)[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);
    this.data_parnter_organization = this.datas.determine_contract.filter((p: any) => p.type == 2 || p.type == 3);
    this.isFileName = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 1)[0].filename;
  }

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeConfirmInforContract.emit(step);
  }

  next() {
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
    this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId);
  }

  // push dữ liệu step 3
  async getDefindDataSignEdit(dataSignId: any, dataSignNotId: any) {
    let dataSample_contract: any[] = [];
    this.spinner.show();
    if (dataSignId.length > 0) {
      dataSignId.forEach((res: any) => {
        this.arrVariableRemove.forEach((itemRemove: any) => {
          if (itemRemove != 'id_have_data') {
            delete res[itemRemove];
          }
        })
      })

      let countIsSignId = 0;
      // mang update cac obj o ky da ton tai
      for (let i = 0; i < dataSignId.length; i++) {
        let id = dataSignId[i].id_have_data;
        delete dataSignId[i].id_have_data;
        await this.contractService.getContractSampleEdit(dataSignId[i], id).toPromise().then((data: any) => {
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

    // ===============================
    // if (isSuccess == 0) {
    let response_determine_contract: any = [];
      await this.contractService.getContractDetermine(this.datas.determine_contract, this.datas.data_contract_document_id.contract_id).toPromise().then((res: any) => {
          // console.log('success step confirm 2');
          if (res && res.length > 0) {
            response_determine_contract = res.filter((res: any) => res.type != 1 && res.recipients.some((val: any) => val.id == this.datas.recipient_id_coordition))[0];
          }
        },
        (error: any) => {
          isSuccess++;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout(error.error, "", 3000);
        });
    // }
// =============================

    console.log(response_determine_contract);
    // mang update cac doi tuong o ky moi (them or bi xoa)
    let isErrorNotId = false;
    if (dataSignNotId.length > 0) {
      dataSignNotId.forEach((item: any) => {
        item['font'] = 'Times New Roman';
        item['font_size'] = 11;
        item['contract_id'] = this.datas.data_contract_document_id.contract_id;
        item['document_id'] = this.datas.data_contract_document_id.document_id;
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
              item.name = "";

            if (!item.recipient_id)
              item.recipient_id = "";

            if (!item.status)
              item.status = 0;
          }
        } else {
          item['type'] = 1;
        }

        if (!item.recipient_id ) {
          let getIdRecipientObj = response_determine_contract.recipients.filter((idField: any) => idField.email == item.email && idField.role != 1)[0];
          item.recipient_id = getIdRecipientObj && getIdRecipientObj.id ? getIdRecipientObj.id : undefined;
        }

        this.arrVariableRemove.forEach((item_remove: any) => {
          delete item[item_remove]
        })
      })
      await this.contractService.getContractSample(dataSignNotId).toPromise().then((data) => {
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

    // xoa cac du lieu thay doi trong database
    if (isSuccess == 0 && this.datas.arrDelete.length > 0) {
      for (let d of this.datas.arrDelete) {
        if (parseInt(d)) {
          await this.contractService.deleteInfoContractSignature(d).toPromise().then((res: any) => {
          }, (error) => {
            isSuccess++;
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('error_delete_object_signature', "", "3000");
          })
        }
        if (isSuccess > 0)
          break;
      }
    }

    if (isSuccess == 0) {
      // api dieu phoi hop dong
      let isCheckFail = false;
      let isUserSign = this.datas.determine_contract.filter((p: any) => p.type != 1);
      let arrCoordination: any[] = [];
      let participantId = null;
      for (const d of isUserSign) {
        if (d.recipients.some((p: any) => p.id == this.datas.recipient_id_coordition)) {
          participantId = d.id;
          Array.prototype.push.apply(arrCoordination, d.recipients);
          break;
        }
      }

      if (!isCheckFail) {
        await this.contractService.getDataObjectSignatureLoadChange(this.datas.data_contract_document_id.contract_id).toPromise().then((res: any) => {
          this.datas.is_data_object_signature = res;
        }, (error) => {
          isCheckFail = true;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000);
        })
      }

      if (!isCheckFail) {
        // arrCoordination (data old, request) thay bằng response_determine_contract.recipients (response)
        await this.contractService.coordinationContract(participantId, response_determine_contract.recipients, this.datas.recipient_id_coordition).toPromise().then((data) => {
            this.toastService.showSuccessHTMLWithTimeout("Điều phối hợp đồng thành công!", "", 3000);
            // save local check khi user f5 reload lại trang sẽ ko còn action điều phối hđ
            // localStorage.setItem('coordination_complete', JSON.stringify(true));
            // this.spinner.hide();
          },
          error => {
            isCheckFail = true;
            this.spinner.hide();
            return false;
          }
        );
      }

      if (!isCheckFail) {
        // load data after when coordination success
        await this.contractService.getDataCoordination(this.datas.determine_contract[0].contract_id).toPromise().then((res: any) => {
          if (res) {
            this.datas.is_data_contract = res;
            this.datas.step = variable.stepSampleContract.step_coordination;
          }
          this.spinner.hide();
        }, (error) => {
          isCheckFail = true;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000);
        })
      }
    }
  }

}