import {ContractService} from 'src/app/service/contract.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Observable, Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from "moment";
import {HttpErrorResponse} from '@angular/common/http';
import {UploadService} from 'src/app/service/upload.service';
import {optionsCeCa, variable} from 'src/app/config/variable';
import {AddContractComponent} from '../../add-contract/add-contract.component';
import {ContractTemplateService} from 'src/app/service/contract-template.service';
import { TranslateService } from '@ngx-translate/core';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';

export class ContractConnectArr {
  ref_id: number;

  constructor(ref_id: number) {
    this.ref_id = ref_id;
  }
}

@Component({
  selector: 'app-infor-contract-form',
  templateUrl: './infor-contract-form.component.html',
  styleUrls: ['./infor-contract-form.component.scss']
})

export class InforContractFormComponent implements OnInit, AfterViewInit {
  @Input() stepForm: any;
  @Input() datasForm: any;
  @Output() stepChangeInfoContractForm = new EventEmitter<string>();
  @Input() save_draft_infor_form: any;
  @ViewChild('nameContract') nameContract: ElementRef;
  typeList: Array<any> = [];
  typeListForm: Array<any> = [];
  type_id: any;
  // name: any;
  sign_time: Date; // ngay het han ky
  minDate: Date = moment().toDate();
  dataStepInfo = {}

  isShare: string = 'off';

  contractConnectList: Array<any> = [];
  contractConnect: any;
  name: any = "";
  type: any = "";
  p: number = 1;
  page: number = 5;
  code: any;
  id_form: number;

  attachFormFileNameArr: any[] = [];
  attachFileArr: any[] = [];
  uploadFileAttachAgain: boolean = false;

  listFileAttach: any[] = [];
  isChangeForm: boolean = false;
  action: string;
  uploadFileContractAgain: boolean = false;

  isArrAttachFile_delete: any = [];

  optionsCeCa: any;
  optionsCeCaValue: any;

  checkView: boolean = false;

  constructor(
    private contractService: ContractService,
    private contractTemplateService: ContractTemplateService,
    private contractTypeService: ContractTypeService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private uploadService: UploadService,
    private router: Router,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private checkViewContractService: CheckViewContractService,
    private activeRoute: ActivatedRoute,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    let idContract = Number(this.activeRoute.snapshot.paramMap.get('id'));

    this.checkView = await this.checkViewContractService.callAPIcheckViewContract(idContract);


    if(this.checkView) {
      this.actionSuccess();
    } else {
      this.router.navigate(['/page-not-found']);
    }
  }

  actionSuccess() {
    this.optionsCeCa = optionsCeCa;
    this.optionsCeCaValue = 0;
    this.datasForm.ceca_push = this.optionsCeCaValue;

    let dataRouter = this.route.params.subscribe((params: any) => {
      this.action = params.action;
    }, null, () => {
      dataRouter.unsubscribe;
    })

    this.datasForm.sign_time = this.datasForm.sign_time ? moment(this.datasForm.sign_time).toDate() : moment(new Date()).add(30, 'day').toDate();

    // this.datasForm.type_id = this.datasForm.type_id ? this.datasForm.type_id : null;
    this.contractConnect = this.datasForm.contractConnect ? this.datasForm.contractConnect : null;
    if (this.datasForm.fileAttachForm && this.datasForm.fileAttachForm.length > 0) {
      this.listFileAttach = this.datasForm.fileAttachForm;
    }

    if (this.datasForm.attachFormFileNameArr) {
      this.attachFormFileNameArr = this.datasForm.attachFormFileNameArr
    }

    if (!this.datasForm.isChangeForm) {
      this.datasForm['isChangeForm'] = false;
    }

    this.getContractTemplateForm(); // ham lay mau hop dong
    this.getListTypeContract(); // ham get contract type
    this.getContractList(); // ham lay danh sach hop dong
    this.convertData();
  }

  async changeTypeContract() {
    const informationContractType = await this.contractTypeService.getContractTypeById(this.datasForm.type_id).toPromise();

    if(informationContractType.ceca_push == 1) {
      this.optionsCeCaValue = 1;
    } else {
      this.optionsCeCaValue = 0;
    }

    this.datasForm.ceca_push = this.optionsCeCaValue;
  }

  async changeTemplate() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameContract.nativeElement.focus();
    }, 0)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.step == 'infor-contract-form') {
      this.next('luu_nhap');
    }
  }

  getListTypeContract() {
    this.contractService.getContractTypeList().subscribe(data => {
      this.typeList = data;
    }, (error) => {
      console.log(error);
    });
  }

  getContractList() {
    this.contractService.getContractList('off', '', '', '', '', '', '', 30, "", "").subscribe(data => {
      this.contractConnectList = data.entities;
    }, (error) => {

    });
  }

  getContractTemplateForm() {
    this.contractTemplateService.getListFileTemplate().subscribe(response => {
      this.typeListForm = response;
    })
  }

  onChangeForm(e: any) {
    this.spinner.show();
    this.contractService.getDetailContractFormInfor(e.value).subscribe((res: any) => {
      this.datasForm['template_contract_id'] = e.value;
      let dataContractForm = res.filter((p: any) => p.type == 1 && p.status == 1)[0];
      let dataContractAttachForm = res.filter((p: any) => p.type == 3);
      let isDataInfo = this.typeListForm.filter((data: any) => data.id == e.value)[0];
      if (dataContractForm && isDataInfo) {
        this.datasForm.fileBucket = dataContractForm.bucket;
        this.datasForm.fileName = dataContractForm.filename;
        this.datasForm.file_content = dataContractForm.path;
        this.datasForm.contract_no = "";
        this.datasForm.code = "";
        this.datasForm.name = "";
        this.datasForm.pdfUrl = dataContractForm.path;
        this.datasForm.end_time = isDataInfo.end_time;
        this.datasForm.start_time = isDataInfo.start_time;
        this.datasForm.notes = isDataInfo.notes;
        this.datasForm.type_id = isDataInfo.type_id;
        this.datasForm['isChangeForm'] = true;
        this.datasForm.contract_user_sign = null;
        this.datasForm.is_determine_clone = [];
        this.datasForm.is_data_object_signature = null;
        if (isDataInfo.sign_time) {
          this.datasForm.sign_time = moment(isDataInfo.sign_time).toDate();
        }
      }

      if (dataContractAttachForm) {
        this.datasForm.fileAttachForm = dataContractAttachForm; // du lieu file dinh kem tu mau
        this.listFileAttach = this.datasForm.fileAttachForm;
      } else {
        this.datasForm.fileAttachForm = [];
      }

      if (this.datasForm.id) {
        this.contractService.deleteContract(this.datasForm.id).subscribe((data) => {
            if (data.success) {
              this.datasForm.id = "";
              this.datasForm.contract_id = "";
            } else {
              this.toastService.showErrorHTMLWithTimeout("error_change_contract_template", "", 3000);
            }
          },
          error => {
            this.toastService.showErrorHTMLWithTimeout("error_change_contract_template", "", 3000);
          }
        );
      }

      if(this.datasForm.type_id) {
        this.contractTypeService.getContractTypeById(this.datasForm.type_id).subscribe((data) => {
          if(data.ceca_push == 1) {
            this.optionsCeCaValue = 1;
            this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 1);
          } else if(data.ceca_push == 0) {
            this.optionsCeCaValue = 0;
            this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 0);
          } else {
            this.optionsCeCaValue = 0;
            this.optionsCeCa = optionsCeCa;
          }
        })
      }

      setTimeout(() => {
        this.nameContract.nativeElement.focus();
      }, 100)
    }, (error) => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });

  }

  defineData(datas: any) {
    if (this.contractConnect && this.contractConnect.length && this.contractConnect.length > 0) {
      const array_empty: ContractConnectArr[] = [];
      this.contractConnect.forEach((element: any, index: number) => {
        const data = new ContractConnectArr(element);
        array_empty.push(data);
      })
      this.datasForm.contractConnect = array_empty;
    } else {
      this.datasForm.contractConnect = null;
    }
  }

  convertData() {
    if (this.datasForm.contractConnect && this.datasForm.contractConnect.length && this.datasForm.contractConnect.length > 0) {
      const array_empty: any[] = [];
      this.datasForm.contractConnect.forEach((element: any, index: number) => {
        const data = element.ref_id;
        array_empty.push(data);
      })
      this.contractConnect = array_empty;
    }
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFile').click();
  }

  uploadFileAttachForm(e: any) {
    let files = e.target.files;
    if (!this.datasForm.fileAttachForm) {
      this.datasForm.fileAttachForm = [];
    }
    for (let i = 0; i < files.length; i++) {
      const file = e.target.files[i];
      if (file) {
        if (file.size <= 10000000) {
          const file_name = file.name;
          if (this.listFileAttach.filter((p: any) => p.filename == file_name).length == 0) {
            this.listFileAttach.push(file);
          }

          if (!this.datasForm.fileAttachForm.some((p: any) => file.name == p.filename || file.name == p.name)) {
            this.datasForm.fileAttachForm.push(file);
          }
        } else {
          this.datasForm.file_name_attach = '';
          this.datasForm.attachFile = '';
          this.toastService.showWarningHTMLWithTimeout("File đính kèm yêu cầu có dung lượng nhỏ hơn 5MB", "", 3000);
          break;
        }
      }
    }
    if (this.action == 'edit') {
      this.uploadFileContractAgain = true;
    }
    const valueEmpty: any = document.getElementById('attachFile');
    valueEmpty.value = "";
  }

  deleteFileAttach(item: any, index_dlt: number) {
    if (item.id && this.action == 'edit') {
      this.spinner.show();
      let data = this.datasForm.fileAttachForm.filter((p: any) => p.id == item.id)[0];
      if (data) data.status = 0;
      this.contractService.updateFileAttach(item.id, data).subscribe((res: any) => {
        this.getListFileAfterDelete(item, index_dlt, 'edit');
      }, error => {
        this.toastService.showErrorHTMLWithTimeout("Lỗi xoá file đính kèm!", "", 3000);
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      })
    } else
      this.getListFileAfterDelete(item, index_dlt, 'create');
  }

  getListFileAfterDelete(item: any, index_dlt: number, action: string) {
    if (action == 'create') {
      this.isArrAttachFile_delete.push(item);
    }
    this.datasForm.fileAttachForm.splice(index_dlt, 1);
    if (this.listFileAttach.some((p: any) => p.filename != item.filename)) {
      this.listFileAttach = this.listFileAttach.filter((p: any) => p.filename != item.filename);
    }

    console.log(this.isArrAttachFile_delete);
  }


  validDataForm() {

    if (!this.datasForm.template_contract_id) {
      this.toastService.showWarningHTMLWithTimeout((this.translate.instant('please.choose.contract.template')), "", "3000");
      return false;
    }
    if (!this.datasForm.name) {
      this.toastService.showWarningHTMLWithTimeout((this.translate.instant('please.choose.contract.name')), "", "3000");
      return false;
    }

    let isDateSign = new Date(moment(this.datasForm.sign_time).format('YYYY-MM-DD'));
    let isDateNow = new Date(moment().format('YYYY-MM-DD'));

    if (Number(isDateSign) < Number(isDateNow)) {
      this.toastService.showWarningHTMLWithTimeout('Ngày hết hạn ký không được nhỏ hơn ngày hiện tại!', "", 3000);
      return false;
    }

    return true;

  }

  // Next step two create form contract
  async next(action: string) {
    this.spinner.show();
    let coutError = false;
    if (this.datasForm.contract_no && action != 'luu_nhap') {
      //check trung so hop dong
      await this.contractService.checkCodeUnique(this.datasForm.contract_no).toPromise().then(
        dataCode => {
          if (!dataCode.success) {
            this.toastService.showWarningHTMLWithTimeout('contract_number_already_exist', "", 3000);
            this.spinner.hide();
            coutError = true;
          }
        }, (error) => {
          coutError = true;
          this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
          this.spinner.hide();
        });
    }

    if (!coutError && (action == 'luu_nhap' || (action == 'chuyen_buoc' && this.validDataForm()))) {
      // define du lieu hop dong lien quan
      this.defineData(this.datasForm);
      if (this.action == 'edit') {
        if (this.datasForm.contractConnect && this.datasForm.contractConnect.length && this.datasForm.contractConnect.length > 0) {
          this.datasForm.contractConnect.forEach((res: any) => {
            res['contract_id'] = this.datasForm.contract_id;
          })
        }
      }
      if (!coutError) {
        // push du lieu cac thong tin tao buoc 1
        await this.contractService.addContractStep1(this.datasForm, this.datasForm.contract_id ? this.datasForm.contract_id : null, 'template_form').toPromise().then((data) => {
          this.datasForm.id = data?.id;
          this.datasForm.contract_id = data?.id;
        }, (error) => {
          coutError = true;
          this.errorData();
        })
      }

      if (!coutError) {
        await this.contractService.getDataNotifyOriganzation().toPromise().then((data: any) => {
          this.datasForm.name_origanzation = data.name;
        }, () => {
          coutError = true;
          this.errorData();
        })
      }

      // upload file dinh kem (neu add them file dinh kem)
      if (!coutError && this.datasForm.fileAttachForm && this.datasForm.fileAttachForm.length && this.datasForm.fileAttachForm.length > 0) {
        if (this.action != 'edit' || (this.action == 'edit' && this.uploadFileContractAgain)) {
          for (let i = 0; i < this.datasForm.fileAttachForm.length; i++) {
            if (!this.datasForm.fileAttachForm[i].id) {
              let isFileAttach = null;
              await this.uploadService.uploadFile(this.datasForm.fileAttachForm[i]).toPromise().then((data) => {
                  isFileAttach = {
                    name: this.datasForm.name,
                    filePathAttach: data.file_object.file_path,
                    fileNameAttach: data.file_object.filename,
                    fileBucketAttach: data.file_object.bucket,
                    id: this.datasForm.id
                  }
                },
                (error) => {
                  coutError = true;
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);

                }
              );

              if (coutError) {
                break;
              }

              if (isFileAttach) {
                await this.contractService.addDocumentAttach(isFileAttach).toPromise().then((data) => {
                    // this.datasForm.fileAttachForm[i].id = data?.id;
                    this.datasForm.fileAttachForm[i] = data;
                  },
                  error => {
                    coutError = true;
                    this.spinner.hide();
                    this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                  }
                );

                if (coutError) {
                  break;
                }
              }
            }
          }
        }

        if (!coutError) {
          if (action == "chuyen_buoc") {
            this.getDataContractForm('next_step').then();
          } else {
            if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
              this.save_draft_infor_form.close_header = false;
              this.save_draft_infor_form.close_modal.close();
            }
            this.getDataContractForm('save_temp').then();
          }
          this.spinner.hide();
        }

      } else if (!coutError) {
        if (action == "luu_nhap")
          this.getDataContractForm('save_temp');
        else
          this.getDataContractForm('next_step');
        this.spinner.hide();
      }
    } else this.spinner.hide();
  }

  saveDraft() {
    this.stepForm = variable.stepSampleContractForm.step2;
    this.datasForm.stepFormLast = this.stepForm;
    this.nextOrPreviousStep(this.stepForm);
  }

  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datasForm.stepFormLast = step;
    this.stepChangeInfoContractForm.emit(step);
  }

  errorData() {
    this.spinner.hide();
    this.toastService.showWarningHTMLWithTimeout("no.push.information.contract.error", "", "3000");
  }

  async getDataContractForm(action: string) {
    if (this.action == 'edit') { // action url edit contract
      if (action == 'next_step') {
        this.nextForm();
      } else {
        this.router.navigate(['/main/contract/create/draft']);
        this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      }
    } else {
      // create new contract
      let is_create_error = false;
      let arrFile: any[] = [];

      console.log("datasform contract id ", this.datasForm.contract_id);

      // api clone hợp đồng mẫu sang hợp đồng tạo mới => tạo hợp đồng
      await this.contractTemplateService.getFileContractFormClone(this.datasForm.template_contract_id, this.datasForm.contract_id).toPromise().then((res: any) => {
        let dataContractTemplate = res.filter((p: any) => p.type == 2 && p.status == 1)[0];
        arrFile = res;
        if (dataContractTemplate) {
          this.datasForm.document_id = dataContractTemplate.id;
        }
      }, (error) => {
        is_create_error = true;
        this.toastService.showErrorHTMLWithTimeout("error.server", "", 3000);
      })

      // xoa file dinh kem cua thao tac tao moi hop dong (chi xoa khi hop dong da duoc tao)
      if (this.isArrAttachFile_delete.length > 0 && arrFile.length > 0) {
        for (const d of this.isArrAttachFile_delete) {
          let element_delete = arrFile.filter((p: any) => p.status === d.status && p.type === d.type && p.filename === d.filename)[0];
          if (element_delete) {
            element_delete.status = 0;
            await this.contractService.updateFileAttach(element_delete.id, element_delete).toPromise().then((res: any) => {
              // delete file attach successfully
            }, error => {
              is_create_error = true;
              this.toastService.showErrorHTMLWithTimeout("not_search_file_attach", "", 3000);
              this.spinner.hide();
            })
          } else this.toastService.showWarningHTMLWithTimeout('not_search_file_attach', "", 3000);
          if (is_create_error) break;
        }
      }

      if (!is_create_error) {
        if (action == 'next_step') {
          if (this.datasForm.isChangeForm) {
            // api get dữ liệu các đối tượng trong hợp đồng mẫu bước 2.
            await this.contractTemplateService.addInforContractTemplate(null, this.datasForm.template_contract_id, 'get-form-data').toPromise().then((res: any) => {
              this.datasForm.is_determine_clone = res.participants;
              this.nextForm();
            }, (error) => {
              this.errorData();
            })
          } else this.nextForm();
        } else {
          this.router.navigate(['/main/contract/create/draft']);
          this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
        }
      }
    }
  }

  nextForm() {
    // for(let i = 0; i < this.datasForm.is_determine_clone.length; i++) {
    //   this.datasForm.is_determine_clone[i].id = null;
    // }

    this.datasForm.isChangeForm = false;
    this.stepForm = variable.stepSampleContractForm.step2;
    this.datasForm.stepFormLast = this.stepForm;
    this.nextOrPreviousStep(this.stepForm);
    this.spinner.hide();
  }
}

