import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmInforContractComponent } from '../shared/model/confirm-infor-contract/confirm-infor-contract.component';
import { ContractHeaderComponent } from '../shared/model/contract-header/contract-header.component';
import { DetermineSignerComponent } from '../shared/model/determine-signer/determine-signer.component';
import { InforContractComponent } from '../shared/model/infor-contract/infor-contract.component';
import { SampleContractComponent } from '../shared/model/sample-contract/sample-contract.component';
import { variable } from '../../../config/variable';
import { AppService } from 'src/app/service/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../service/contract.service';
import { UploadService } from '../../../service/upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
import * as moment from 'moment';
// import * as from moment;
import { ContractFormHeaderComponent } from '../form-contract/contract-form-header/contract-form-header.component';
import { InforContractFormComponent } from '../form-contract/infor-contract-form/infor-contract-form.component';
import { PartyContractFormComponent } from '../form-contract/party-contract-form/party-contract-form.component';
import { SampleContractFormComponent } from '../form-contract/sample-contract-form/sample-contract-form.component';
import { ConfirmContractFormComponent } from '../form-contract/confirm-contract-form/confirm-contract-form.component';
import { ContractBatchHeaderComponent } from '../batch-contract/contract-batch-header/contract-batch-header.component';
import { InforContractBatchComponent } from '../batch-contract/infor-contract-batch/infor-contract-batch.component';
import { ConfirmContractBatchComponent } from '../batch-contract/confirm-contract-batch/confirm-contract-batch.component';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss', '../../main.component.scss'],
})
export class AddContractComponent implements OnInit {
  // create contract
  @ViewChild('contractHeader') ContractHeaderComponent:
    | ContractHeaderComponent
    | unknown;
  @ViewChild('determineSigner') DetermineSignerComponent:
    | DetermineSignerComponent
    | unknown;
  @ViewChild('sampleContract') SampleContractComponent:
    | SampleContractComponent
    | unknown;
  @ViewChild('infoContract') InforContractComponent:
    | InforContractComponent
    | unknown;
  @ViewChild('confirmInforContract') ConfirmInforContractComponent:
    | ConfirmInforContractComponent
    | unknown;

  // form contract
  @ViewChild('contractFormHeader') ContractFormHeaderComponent:
    | ContractFormHeaderComponent
    | unknown;
  @ViewChild('InforContractForm') InforContractFormComponent:
    | InforContractFormComponent
    | unknown;
  @ViewChild('PartyContractForm') PartyContractFormComponent:
    | PartyContractFormComponent
    | unknown;
  @ViewChild('SampleContractForm') SampleContractFormComponent:
    | SampleContractFormComponent
    | unknown;
  @ViewChild('ConfirmContractForm') ConfirmContractFormComponent:
    | ConfirmContractFormComponent
    | unknown;

  // form contract
  @ViewChild('contractBatchHeader') ContractBatchHeaderComponent:
    | ContractBatchHeaderComponent
    | unknown;
  @ViewChild('inforContractBatch') InforContractBatchComponent:
    | InforContractBatchComponent
    | unknown;
  @ViewChild('confirmContractBatch') ConfirmContractBatchComponent:
    | ConfirmContractBatchComponent
    | unknown;

  //type = 1 => Hop dong don le khong theo mau
  //type = 2 => Hop dong don le theo mau
  //type = 3 => Hop dong theo lo
  type: number = 1;
  action: string;
  id: string;
  private sub: any;

  datas: any = {
    stepLast: variable.stepSampleContract.step1,
    save_draft: {
      infor_contract: false,
      determine_signer: false,
      sample_contract: false,
      confirm_infor_contract: false,
    },
    flagDigitalSign: false,
  };

  datasForm: any = {
    stepFormLast: variable.stepSampleContractForm.step1,
    save_draft_form: {
      'infor-contract-form': false,
      'party-contract-form': false,
      'sample-contract-form': false,
      'confirm-contract-form': false,
    },
  };

  datasBatch: any = {
    stepBatchLast: variable.stepSampleContractBatch.step1,
    save_draft_batch: {
      'infor-contract-batch': false,
      'confirm-contract-batch': false,
    },
  };

  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  confirmDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  education_step = false;
  confirm_step = false;
  // step = 1;
  step: any;
  stepForm: any;
  stepBatch: any;
  message: any;
  shareData: object;
  is_disable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private router: Router,
    private contractTemplateService: ContractTemplateService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  isQLHD_01: boolean = true;
  isQLHD_14: boolean = true;
  isQLHD_15: boolean = true;
  isQLHD_02: boolean = true;
  isQLHD_08: boolean = true;
  isQLHD_11: boolean = true;

  ngOnInit() {

    console.log("$env ", environment.flag);

    this.userService.checkServiceStatus().subscribe((response) => {

      if (response.status == 'Using' || environment.flag == 'NB') {
        //title
        this.sub = this.route.params.subscribe((params) => {
          this.action = params['action'];

          //lay id user
          let userId = this.userService.getAuthCurrentUser().id;
          this.userService.getUserById(userId).subscribe(
            (data) => {
              //lay id role
              this.roleService.getRoleById(data?.role_id).subscribe(
                (data) => {
                  console.log(data);
                  let listRole: any[];
                  listRole = data.permissions;
                  this.isQLHD_01 = listRole.some(
                    (element) => element.code == 'QLHD_01'
                  );
                  this.isQLHD_14 = listRole.some(
                    (element) => element.code == 'QLHD_14'
                  );
                  this.isQLHD_15 = listRole.some(
                    (element) => element.code == 'QLHD_15'
                  );
                  // this.isQLHD_02 = listRole.some(element => element.code == 'QLHD_02');
                  // this.isQLHD_08 = listRole.some(element => element.code == 'QLHD_08');
                  this.isQLHD_11 = listRole.some(
                    (element) => element.code == 'QLHD_11'
                  );

                  if (
                    (this.action == 'add' || this.action == 'add-batch') &&
                    this.isQLHD_15
                  ) {
                    this.type = 3;
                  }
                  if (
                    (this.action == 'add' || this.action == 'add-form') &&
                    this.isQLHD_14
                  ) {
                    this.type = 2;
                  }
                  if (this.action == 'add' && this.isQLHD_01) {
                    this.type = 1;
                  }
                },
                (error) => {
                  // this.toastService.showErrorHTMLWithTimeout(
                  //   'Lỗi lấy thông tin phân quyền',
                  //   '',
                  //   3000
                  // );
                  this.router.navigate(['/login'])
                }
              );
            },
            (error) => {
              // this.toastService.showErrorHTMLWithTimeout(
              //   'Lỗi lấy thông tin phân quyền',
              //   '',
              //   3000
              // );
              this.router.navigate(['/login'])
            }
          );

          //set title
          this.type = 1;
          if (this.action == 'add') {
            this.appService.setTitle('contract.add');
          } else if (this.action == 'add-form') {
            this.type = 2;
            this.appService.setTitle('contract.add');
            this.datasForm.template_contract_id = Number(params['id']);
            this.getDataContractForm(this.datasForm.template_contract_id);
          } else if (this.action == 'add-batch') {
            this.type = 3;
            this.appService.setTitle('contract.add');
            this.datasBatch.idContractTemplate = Number(params['id']);
          } else if (this.action == 'add-contract-connect') {
            this.appService.setTitle('contract.add');
            const array_empty: any[] = [];
            array_empty.push({ ref_id: Number(params['id']) });
            this.datas.contractConnect = array_empty;
            console.log(this.datas.contractConnect);
          } else if (this.action == 'edit') {
            this.id = params['id'];
            this.appService.setTitle('contract.edit');
          } else if (this.action == 'copy') {
            this.id = params['id'];
            this.appService.setTitle('contract.copy');
          }

          if (this.action == 'edit') {
            // || this.action == 'copy'
            this.spinner.show();
            this.contractService.getDetailContract(this.id).subscribe(
              (rs: any) => {
                let data_api = {
                  is_data_contract: rs[0],
                  i_data_file_contract: rs[1],
                  is_data_object_signature: rs[2],
                };

                console.log("rs ",rs);

                this.getDataContractCreated(data_api);
              },
              () => {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout(
                  'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
                  '',
                  3000
                );
              },
              () => {
                this.spinner.hide();
              }
            );
          } else {
            if (this.type == 1) {
              this.step = variable.stepSampleContract.step1;
            } else if (this.type == 2) {
              this.stepForm = variable.stepSampleContractForm.step1;
            } else if (this.type == 3) {
              this.stepBatch = variable.stepSampleContractBatch.step1;
            }
          }
         });
     } else {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức chưa đăng ký sử dụng gói dịch vụ nào hoặc gói dịch vụ đã hết hạn','',3000);
    }
     });
  }

  getDataContractCreated(data: any) {
    let fileNameAttach = data.i_data_file_contract.filter(
      (p: any) => p.type == 3
    );
    
    if (data) {
      // sua hop dong don le theo mau
      if (data.is_data_contract.is_template) {
        let fileName = data.i_data_file_contract.filter(
          (p: any) => p.type == 2 && p.status == 1
        )[0];
        this.type = 2;
        this.stepForm = variable.stepSampleContractForm.step1;
        this.datasForm.name = data.is_data_contract.name;
        this.datasForm.contractConnect = data.is_data_contract.refs;
        this.datasForm.contract_no = data.is_data_contract.contract_no;
        this.datasForm.sign_time = data.is_data_contract.sign_time;
        this.datasForm.notes = data.is_data_contract.notes;
        this.datasForm.type_id = data.is_data_contract.type_id;
        this.datasForm.is_determine_clone = data.is_data_contract.participants;
        this.datasForm.is_data_object_signature = data.is_data_object_signature;
        this.datasForm.contract_id = data.is_data_contract.id;
        this.datasForm.pdfUrl = fileName.path;
        this.datasForm.document_id = fileName.id;
        this.datasForm.template_contract_id =
          data.is_data_contract.template_contract_id;
        if (fileNameAttach) {
          this.datasForm.fileAttachForm = fileNameAttach;
        }
      } else {
        let fileName = data.i_data_file_contract.filter(
          (p: any) => p.type == 2 && p.status == 1
        )[0];
        
        if (fileName) {
          data.is_data_contract['file_name'] = fileName.filename;
          data.is_data_contract['contractFile'] = fileName.path;
          data.is_data_contract['document_id'] = fileName.id;
        }

        if (fileNameAttach) {
          data.is_data_contract['file_name_attach'] = fileNameAttach.map(
            (p: any) => ({ filename: p.filename, id: p.id })
          );
          data.is_data_contract['attachFile'] = fileNameAttach.map(
            (p: any) => p.path
          );
        }
        this.datas.contractConnect = data.is_data_contract.refs;
        data.is_data_contract['is_action_contract_created'] = true;

        this.datas.is_determine_clone = data.is_data_contract.participants;

        this.datas.contract_id_action = data.is_data_contract.id;
        this.datas.i_data_file_contract = data.i_data_file_contract;
        this.datas['is_data_object_signature'] = data.is_data_object_signature;

        this.datas = Object.assign(this.datas, data.is_data_contract);
        this.step = variable.stepSampleContract.step1;
      }
    }
  }

  changeType(e: any) {
    console.log('a');
    console.log(this.type);
    console.log(this.isQLHD_14);
    if (this.type == 1) {
      this.step = variable.stepSampleContract.step1;
    } else if (this.type == 2) {
      this.stepForm = variable.stepSampleContractForm.step1;
    } else if (this.type == 3) {
      this.stepBatch = variable.stepSampleContractBatch.step1;
    }
    if (this.type == 1) {
      this.datas = {
        stepLast: variable.stepSampleContract.step1,
        save_draft: {
          infor_contract: false,
          determine_signer: false,
          sample_contract: false,
          confirm_infor_contract: false,
        },
      };
    } else if (this.type == 2) {
      this.datasForm = {
        stepFormLast: variable.stepSampleContractForm.step1,
        save_draft_form: {
          'infor-contract-form': false,
          'party-contract-form': false,
          'sample-contract-form': false,
          'confirm-contract-form': false,
        },
      };
    }
  }

  receiveMessage(event: any) {
    console.log(event);
    this.shareData = event;
  }

  next() {
    if (this.step == 'infor-contract') {
      this.personal_step = true;
      if (this.personalDetails.invalid) {
        return;
      }
      this.step = 'determine-contract';
    } else if (this.step == 'determine-contract') {
      this.address_step = true;
      if (this.addressDetails.invalid) {
        return;
      }
      this.step = 'sample-contract';
    } else if (this.step == 'sample-contract') {
      this.education_step = true;
      if (this.educationalDetails.invalid) {
        return;
      }
      this.step = 'confirm-contract';
    }
  }

  previous() {
    // this.step--
    if (this.step == 'infor-contract') {
      this.personal_step = false;
    } else if (this.step == 'determine-contract') {
      this.address_step = false;
      this.education_step = false;
    } else if (this.step == 'sample-contract') {
      this.education_step = false;
      this.confirm_step = false;
    }
  }

  submit() {
    if (this.step == 'confirm-contract') {
      this.confirm_step = true;
      if (this.confirmDetails.invalid) {
        return;
      }
    }
  }

  getStep(e: any) {
    // if (e.isBackStep_4 && e.step) {
    //   this.datas['back_step_4'] = e.isBackStep_4;
    //   this.step = e.step;
    // } else if (e.isBackStep_2 && e.step) {
    //   this.datas['back_step_2'] = e.isBackStep_2;
    //   this.step = e.step;
    // } else
    if (this.type == 1) {
      this.step = e;
    } else if (this.type == 2) {
      this.stepForm = e;
    } else if (this.type == 3) {
      this.stepBatch = e;
    }
    this.is_disable =
      (this.type == 1 && e != 'infor-contract') ||
      (this.type == 2 && e != 'infor-contract-form') ||
      (this.type == 3 && e != 'infor-contract-batch');
  }

  t() {
    console.log(this);
  }

  getDataContractForm(idContractTemplate: any) {
    this.spinner.show();
    this.contractTemplateService
      .getListFileTemplate()
      .subscribe((response: any) => {
        let isDataInfo = response.filter(
          (data: any) => data.id == idContractTemplate
        )[0];
        this.contractService
          .getDetailContractFormInfor(idContractTemplate)
          .subscribe(
            (res: any) => {
              this.datasForm['template_contract_id'] = idContractTemplate;
              let dataContractForm = res.filter(
                (p: any) => p.type == 1 && p.status == 1
              )[0];
              let dataContractAttachForm = res.filter((p: any) => p.type == 3);

              if (dataContractForm && isDataInfo) {
                this.datasForm.fileBucket = dataContractForm.bucket;
                this.datasForm.fileName = dataContractForm.filename;
                this.datasForm.file_content = dataContractForm.path;
                this.datasForm.contract_no = '';
                this.datasForm.code = '';
                this.datasForm.name = '';
                this.datasForm.pdfUrl = dataContractForm.path;
                if (isDataInfo.sign_time) {
                  this.datasForm.sign_time = moment(
                    isDataInfo.sign_time
                  ).toDate();
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
                //this.listFileAttach = this.datasForm.fileAttachForm;
              } else {
                this.datasForm.fileAttachForm = [];
              }

              if (this.datasForm.id) {
                this.contractService
                  .deleteContract(this.datasForm.id)
                  .subscribe(
                    (data) => {
                      if (data.success) {
                        this.datasForm.id = '';
                        this.datasForm.contract_id = '';
                      } else {
                        this.toastService.showErrorHTMLWithTimeout(
                          'error_change_contract_template',
                          '',
                          3000
                        );
                      }
                    },
                    (error) => {
                      this.toastService.showErrorHTMLWithTimeout(
                        'error_change_contract_template',
                        '',
                        3000
                      );
                    }
                  );
              }

              setTimeout(() => {
                //this.nameContract.nativeElement.focus();
              }, 100);
            },
            (error) => {
              this.spinner.hide();
            },
            () => {
              this.spinner.hide();
            }
          );
      });
  }
}
