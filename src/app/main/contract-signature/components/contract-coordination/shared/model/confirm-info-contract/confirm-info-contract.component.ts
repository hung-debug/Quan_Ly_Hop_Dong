import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-confirm-info-contract',
  templateUrl: './confirm-info-contract.component.html',
  styleUrls: ['./confirm-info-contract.component.scss']
})
export class ConfirmInfoContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeConfirmInforContract = new EventEmitter<string>();
  // @Output() stepChangeSampleContract = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private contractService: ContractService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,) {
    this.step = variable.stepSampleContract.step4
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

  conn: string;


  ngOnInit(): void {
    console.log("step4" + this.datas.contract_user_sign);

    this.contractFileName = this.datas.i_data_file_contract[0].filename;
    this.dateDeadline = this.datepipe.transform(this.datas.is_data_contract.sign_time, 'dd/MM/yyyy') || '';
    this.comment = this.datas.is_data_contract.notes;

    if (this.datas.determine_contract) {
      let data_user_sign = JSON.parse(JSON.stringify(this.datas.determine_contract));
      console.log(data_user_sign);
      // data_user_sign.forEach((element: any) => {
      if (data_user_sign.type == 1) {
        data_user_sign.recipients.forEach((item: any) => {
          if (item.role == 2 && item.name) {
            this.userViews += this.connUserViews + item.name + " - " + item.email;
            this.connUserViews = "<br>";
          } else if (item.role == 3 && item.name) {
            this.userSigns += this.connUserSigns + item.name + " - " + item.email;
            this.connUserSigns = "<br>";
          } else if (item.role == 4 && item.name) {
            this.userDocs += this.connUserDocs + item.name + " - " + item.email;
            this.connUserDocs = "<br>";
          }
        })
      } else if (data_user_sign.type == 2) {
        data_user_sign.recipients.forEach((item: any) => {
          if (item.role == 1 && item.name) {
            this.partnerLeads += this.connPartnerLeads + item.name + " - " + item.email;
            this.connPartnerLeads = "<br>";
          } else if (item.role == 2 && item.name) {
            this.partnerViews += this.connPartnerViews + item.name + " - " + item.email;
            this.connPartnerViews = "<br>";
          } else if (item.role == 3 && item.name) {
            this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
            this.connPartnerSigns = "<br>";
          } else if (item.role == 4 && item.name) {
            this.partnerDocs += this.connPartnerDocs + item.name + " - " + item.email;
            this.connPartnerDocs = "<br>";
          }
        })
      } else if (data_user_sign.type == 3) {
        data_user_sign.recipients.forEach((item: any) => {
          if (item.role == 3 && item.name) {
            this.partnerSigns += this.connPartnerSigns + item.name + " - " + item.email;
            this.connPartnerSigns = "<br>";
          }
        })
      }
    }
  }

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeConfirmInforContract.emit(step);
    // this.stepChangeSampleContract.emit(step);
  }

  next() {
    //call API step confirm
    this.datas.determine_contract.recipients.forEach((item: any) => {
      // if (!item.phone) {
      //   item.phone = null;
      // }
      delete item.id;
    })

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

    // let data_sample_contract: string | any[] = [];
    // let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "value"];
    // this.datas.contract_user_sign.forEach((element: any) => {
    //   if (element.sign_config.length > 0) {
    //     element.sign_config.forEach((item: any) => {
    //       item['font'] = 'Arial';
    //       item['font_size'] = 14;
    //       item['contract_id'] = this.datas.data_contract_document_id.contract_id;
    //       item['document_id'] = this.datas.data_contract_document_id.document_id;
    //       if (item.text_attribute_name) {
    //         item.name = item.text_attribute_name;
    //       }
    //       if (item.sign_unit == 'chu_ky_anh') {
    //         item['type'] = 2;
    //       } else if (item.sign_unit == 'chu_ky_so') {
    //         item['type'] = 3;
    //       } else if (item.sign_unit == 'so_tai_lieu') {
    //         item['type'] = 4;
    //         if (this.datas.contract_no) {
    //           if (!item.name)
    //             item.name = "";

    //           if (!item.recipient_id)
    //             item.recipient_id = "";

    //           if (!item.status)
    //             item.status = 0;
    //         }

    //       } else {
    //         item['type'] = 1;
    //       }
    //       // item['recipient_id'] = element.id;
    //       data_remove_arr_request.forEach((itemRemove: any) => {
    //         delete item[itemRemove];
    //       })
    //     })
    //     Array.prototype.push.apply(data_sample_contract, element.sign_config);
    //   }
    // })

    // this.spinner.show();
    // this.contractService.getContractSample(data_sample_contract).subscribe((data: any) => {
    //   console.log(JSON.stringify(data));
    //   this.datas.is_data_object_signature.forEach((p: any) => {
    //     data.forEach((element: any) => {
    //       if (p.recipient_id == element.recipient_id) {
    //         p = element;
    //       } else this.datas.is_data_object_signature.push(element);
    //     })
    //   })

    //   this.step = variable.stepSampleContract.step4;
    //   this.datas.stepLast = this.step
    //   this.nextOrPreviousStep(this.step);
    // },
    //   error => {
    //     this.spinner.hide();
    //     console.log("false connect file");
    //     return false;
    //   }, () => {
    //     this.spinner.hide();
    //   }
    // );


  }

  async getDefindDataSignEdit(dataSignId: any, dataSignNotId: any) {
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
      // this.spinner.hide();
    }

    let isErrorNotId = false;
    if (dataSignNotId.length > 0) {
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', 'value'];
      dataSignNotId.forEach((item: any) => {
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
        } else {
          item['type'] = 1;
        }

        data_remove_arr_request.forEach((item_remove: any) => {
          delete item[item_remove]
        })
      })
      // Array.prototype.push.apply(this.data_sample_contract, dataSignNotId);
      await this.contractService.getContractSample(dataSignNotId).toPromise().then((data) => {
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
      // api dieu phoi hop dong
      let data_determine = this.datas.determine_contract.recipients.filter((p: any) => p.role != 1);
      this.spinner.show();
      this.contractService.coordinationContract(this.datas.determine_contract.id, data_determine, this.datas.recipient_id_coordition).subscribe((data) => {
        this.contractService.getDataCoordination(this.datas.determine_contract.contract_id).subscribe((res: any) => {
          if (res) {
            this.datas.is_data_contract = res;
            this.datas.step = variable.stepSampleContract.step_coordination;
            // save local check khi user f5 reload lại trang sẽ ko còn action điều phối hđ
            localStorage.setItem('coordination_complete', JSON.stringify(true));
            this.toastService.showSuccessHTMLWithTimeout("Điều phối hợp đồng thành công!", "", 3000);
            this.spinner.hide();
            setTimeout(() => {
              // this.router.navigate(['/main/contract-signature/coordinates/' + this.datas.data_contract_document_id.contract_id]);
              // this.toastService.showSuccessHTMLWithTimeout("Điều phối hợp đồng thành công!", "", 3000);
              // this.spinner.hide();
            }, 100)
          }
        }, () => {
          this.spinner.hide();
        })
      },
        error => {
          this.spinner.hide();
          console.log("false content");
          return false;
        }, () => {
          this.spinner.hide();
        }
      );
    }
  }

}
