import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { ContractService } from 'src/app/service/contract.service';
import { DatePipe } from '@angular/common';
import { optionsCeCa, variable } from '../../../../config/variable';
import { AddContractComponent } from '../../add-contract/add-contract.component';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';
import {TranslateService} from '@ngx-translate/core';
import { ContractTypeService } from 'src/app/service/contract-type.service';
@Component({
  selector: 'app-infor-contract-batch',
  templateUrl: './infor-contract-batch.component.html',
  styleUrls: ['./infor-contract-batch.component.scss'],
})
export class InforContractBatchComponent implements OnInit {
  @Input() AddComponent: AddContractComponent | unknown;
  @Input() datasBatch: any;
  @Input() step: any;

  @Output() stepChangeInfoContractBatch = new EventEmitter<string>();

  //upload file
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  fileInfos?: Observable<any>;

  //upload file attach
  selectedFilesAttach?: FileList;
  progressInfosAttach: any[] = [];
  messageAttach: string[] = [];
  fileInfosAttach?: Observable<any>;

  //dropdown
  contractTypeList: Array<any> = [];
  contractConnectList: Array<any> = [];
  dropdownTypeSettings: any = {};
  dropdownConnectSettings: any = {};
  typeListForm: Array<any> = [];

  id: any;
  name: any = '';
  code: any;
  type_id: any;
  attachFile: any;
  contractConnect: any;
  sign_time: any;
  notes: any;
  file_name: any;

  //error
  errorContractName: any = '';
  errorContractFile: any = '';

  idContractTemplate: any;
  filePathExample: any = '';
  orgId: any;
  numContractUse: any;
  eKYCContractUse: any;
  smsContractUse: any;
  numContractBuy: any;
  eKYCContractBuy: any;
  smsContractBuy: any;

  optionsCeCa: any;
  optionsCeCaValue: any;

  ceca: boolean;

  constructor(
    private uploadService: UploadService,
    private contractService: ContractService,
    private contractTemplateService: ContractTemplateService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userService: UserService,
    private unitService: UnitService,
    public translate: TranslateService,
    private contractTypeService: ContractTypeService,
  ) {
    this.step = variable.stepSampleContractBatch.step1;
  }

  getContractTemplateForm() {
    this.contractTemplateService.getListFileTemplate().subscribe((response) => {
      // 
      this.typeListForm = response;
    });
  }

  ngOnInit(): void {
    this.optionsCeCa = optionsCeCa;
    this.optionsCeCaValue = 0;
    this.idContractTemplate = this.datasBatch.idContractTemplate
      ? this.datasBatch.idContractTemplate
      : '';
    this.getContractTemplateForm();

    this.contractService.getDataNotifyOriganzation().subscribe((response) => {
      if(response.ceca_push_mode == 'NONE') {
        this.ceca = false;
      } else if(response.ceca_push_mode == 'SELECTION') {
        this.ceca = true
      }
    })

    if(this.datasBatch.idContractTemplate)
      this.onChangeForm(this.datasBatch.idContractTemplate, false);
  }

  async onChangeForm(e: any, isBoolean: boolean) {
    this.clearError();

    if(isBoolean)
      this.idContractTemplate = e.value;
    else
      this.idContractTemplate = e;

    let type_id = null;

    const inforContractTemplate = await this.contractTemplateService.getInfoContractTemplate(this.idContractTemplate).toPromise();

    let isCheckPerson = false;
    inforContractTemplate.participants.forEach((ele: any) => {
      if(ele.type == 3) {
        this.optionsCeCaValue = 0;
        isCheckPerson = true

        ele.recipients.forEach((ele: any) => {
          if(ele.sign_type.length > 0) {
            if(ele.sign_type[0].id == 1 || ele.sign_type[0].id == 5) {
              isCheckPerson = true;
              this.toastService.showWarningHTMLWithTimeout('ceca.reason','',3000)
              return;
            }
          }
        })
      }
    });

    type_id = inforContractTemplate.type_id;

    if(type_id) {
      const informationContractType = await this.contractTypeService.getContractTypeById(type_id).toPromise();

      if(informationContractType.ceca_push == 1) {
        this.optionsCeCa = optionsCeCa;
        this.optionsCeCaValue = 1;
        this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 1);
      } else {
        this.optionsCeCa = optionsCeCa;
        this.optionsCeCaValue = 0;
        this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 0);
      }
    } else {
      this.optionsCeCaValue = 0;
      this.optionsCeCa = optionsCeCa;
    }
  }

  downFileExample() {
    this.spinner.show();
    if (this.idContractTemplate) {
      this.contractService.getFileContractBatch(this.idContractTemplate).subscribe(
          (res: any) => {
            this.uploadService.downloadFile(res.path).subscribe((response: any) => {
                //

                let url = window.URL.createObjectURL(response);
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = res.filename;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();

                this.toastService.showSuccessHTMLWithTimeout(
                  'Tải file tài liệu mẫu thành công',
                  '',
                  3000
                );
                this.spinner.hide();
              }),
              (error: any) =>
                this.toastService.showErrorHTMLWithTimeout(
                  'no.contract.download.file.error',
                  '',
                  3000
                );

            // this.toastService.showSuccessHTMLWithTimeout("Tải file tài liệu mẫu thành công", "", 3000);
            // this.spinner.hide();
          },
          (error) => {
            
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
    } else {
      this.spinner.hide();
      this.toastService.showErrorHTMLWithTimeout(
        'Bạn chưa chọn mẫu hợp đồng',
        '',
        3000
      );
    }
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (
          extension.toLowerCase() == 'xls' ||
          extension.toLowerCase() == 'xlsx'
        ) {
          const fileInput: any = document.getElementById('file-input');
          fileInput.value = '';
          this.datasBatch.file_name = file_name;
          this.datasBatch.contractFile = file;
          this.errorDetail = [];
          this.clearError();
        } else {
          this.toastService.showErrorHTMLWithTimeout(
            'Chỉ hỗ trợ file có định dạng XLS, XLSX',
            '',
            3000
          );
        }
      } else {
        this.toastService.showErrorHTMLWithTimeout(
          'Yêu cầu file nhỏ hơn 5MB',
          '',
          3000
        );
      }
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

  //--valid data step 1
  validData() {
    this.clearError();
    if (!this.idContractTemplate || !this.datasBatch.contractFile) {
      if (!this.idContractTemplate) {
        this.errorContractName = (this.translate.instant('contract.template.name.not.blank'));
      }
      if (!this.datasBatch.contractFile) {
        this.errorContractFile = (this.translate.instant('file.not.empty'));
      }
      return false;
    }

    return true;
  }

  errorDetail: any[] = [];
  clearError() {
    if (this.idContractTemplate.id) {
      this.errorContractName = '';
    }
    if (this.datasBatch.contractFile) {
      this.errorContractFile = '';
    }
  }

  // --next step 2
  next() {
    if (!this.validData()) return;
    else {
      this.spinner.show();
      // gán value step 1 vào datasBatch
      this.datasBatch.name = this.name;
      this.datasBatch.code = this.code;
      this.datasBatch.type_id = this.type_id;
      this.datasBatch.contractConnect = this.contractConnect;
      this.datasBatch.sign_time = this.sign_time;
      this.datasBatch.notes = this.notes;
      this.datasBatch.idContractTemplate = this.idContractTemplate.id;
      this.datasBatch.ceca_push = this.optionsCeCaValue;

      this.datasBatch.idContractTemplate = this.idContractTemplate;

      let countSMS = 0;
      let countEkyc = 0;
      this.contractService.uploadFileContractBatch(this.datasBatch.contractFile,this.datasBatch.idContractTemplate).subscribe((responseUpload: any) => {
          this.contractService.getContractBatchList(this.datasBatch.contractFile,this.datasBatch.idContractTemplate,this.optionsCeCaValue).subscribe((response: any) => {
              for (
                let i = 0;
                i < response[0].participants[0].recipients.length;
                i++
              ) {
                let recipients = response[0].participants[0].recipients;

                for(let j = 0; j < recipients.length; j++) {
                  if(recipients[j].sign_type.length > 0) {
                    if (recipients[j].sign_type[0].id == 1) {
                      //Thêm điều kiện đăng nhập bằng email hoặc số điện thoại
                      countSMS++;
                    } else if (recipients[j].sign_type[0].id == 5) {
                      countEkyc++;
                    }
                  }
                    
                }
              }

              if (countSMS > 0) {
                countSMS = countSMS * response.length;
              } else if (countEkyc > 0) {
                countEkyc = countEkyc * response.length;
              }

              this.orgId = this.userService.getInforUser().organization_id;

              this.unitService
                .getUnitById(this.orgId)
                .toPromise()
                .then(
                  (data) => {
                    //chi lay so luong hop dong khi chon to chuc cha to nhat
                      //lay so luong hop dong da dung
                      this.unitService
                        .getNumberContractUseOriganzation(this.orgId)
                        .toPromise()
                        .then(
                          (data) => {
                            this.numContractUse = data.contract;
                            this.eKYCContractUse = data.ekyc;
                            this.smsContractUse = data.sms;

                            //lay so luong hop dong da mua
                            this.unitService
                              .getNumberContractBuyOriganzation(this.orgId)
                              .toPromise()
                              .then(
                                (data) => {
                                  this.numContractBuy = data.contract;
                                  this.eKYCContractBuy = data.ekyc;
                                  this.smsContractBuy = data.sms;

                                  if (
                                    Number(this.eKYCContractUse) +
                                      Number(countEkyc) >
                                    Number(this.eKYCContractBuy)
                                  ) {
                                    this.toastService.showErrorHTMLWithTimeout(
                                      'Tổ chức đã sử dụng hết số lượng eKYC đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ',
                                      '',
                                      3000
                                    );
                                  } else if (
                                    Number(this.smsContractUse) +
                                      Number(countSMS) >
                                    Number(this.smsContractBuy)
                                  ) {
                                    this.toastService.showErrorHTMLWithTimeout(
                                      'Tổ chức đã sử dụng hết số lượng SMS đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000
                                    );
                                  } else {
                                    
                                  if (responseUpload.success) {
                                    //next step
                                    this.step =
                                      variable.stepSampleContractBatch.step2;
                                    this.datasBatch.stepLast = this.step;
                                    this.nextOrPreviousStep(this.step);
                                    
                                    this.spinner.hide();
                                  } else {
                                    
                                    this.errorDetail = responseUpload.detail;
                                    this.toastService.showErrorHTMLWithTimeout(
                                      'File mẫu không hợp lệ',
                                      '',
                                      3000
                                    );
                                    this.spinner.hide();
                                  }
                                  }

                                },
                                (error) => {
                                  this.toastService.showErrorHTMLWithTimeout(
                                    'Lỗi lấy số lượng hợp đồng đã mua',
                                    '',
                                    3000
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.toastService.showErrorHTMLWithTimeout(
                              'Lỗi lấy số lượng hợp đồng đã dùng',
                              '',
                              3000
                            );
                          }
                        );
                  },
                  (error) => {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi lấy thông tin tổ chức',
                      '',
                      3000
                    );
                  }
                );
            }),
            (error: any) => {
              this.toastService.showErrorHTMLWithTimeout(
                'no.contract.download.file.error',
                '',
                3000
              );
              this.spinner.hide();
            };
        }),
        (error: any) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout(
            'Lấy thông tin hợp đồng thất bại',
            '',
            3000
          );
        };
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datasBatch.documents.document.step = step;
    this.datasBatch.stepLast = step;
    this.stepChangeInfoContractBatch.emit(step);
  }
}
