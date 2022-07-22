import {ContractService} from 'src/app/service/contract.service';
import {UploadService} from './../../../../../service/upload.service';
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
import {variable} from "../../../../../config/variable";
import {Observable, Subscription} from 'rxjs';
import {AddContractComponent} from "../../../add-contract/add-contract.component";
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from "moment";
import {HttpErrorResponse} from '@angular/common/http';

export class ContractConnectArr {
  ref_id: number;

  constructor(ref_id: number) {
    this.ref_id = ref_id;
  }
}

@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() AddComponent: AddContractComponent | unknown;
  @Input() datas: any;
  @Input() step: any;
  @Input() save_draft_infor: any;

  @Output() stepChangeInfoContract = new EventEmitter<string>();
  @ViewChild('nameContract') nameContract: ElementRef;


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
  typeList: Array<any> = [];
  contractConnectList: Array<any> = [];

  id: any;
  name: any;
  code: any;
  type_id: any;
  attachFile: any;
  contractConnect: any;
  sign_time: Date;
  notes: any;
  filePath: any;

  attachFileArr: any[] = [];
  attachFileNameArr: any[] = [];
  contract_no: any;

  //error
  errorContractName: any = '';
  errorContractFile: any = '';
  errorSignTime: any = '';
  errorContractNumber: any = '';

  uploadFileContractAgain: boolean = false;
  uploadFileAttachAgain: boolean = false;
  isFileAttachUploadNewEdit: any;
  public subscription: Subscription;

  minDate: Date = moment().toDate();
  public messageForSibling: string;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private contractService: ContractService,
    public datepipe: DatePipe,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
    this.step = variable.stepSampleContract.step1;
  }

  ngOnInit(): void {
    console.log("datas ", this.datas);

    this.spinner.hide();
    this.name = this.datas.name ? this.datas.name : null;
    // this.code = this.datas.contract_no ? this.datas.contract_no : null;
    this.contract_no = this.datas.contract_no ? this.datas.contract_no : this.datas.contract_no;
    this.type_id = this.datas.type_id ? this.datas.type_id : null;
    this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : null;
    this.sign_time = this.datas.sign_time ? moment(this.datas.sign_time).toDate() : moment(new Date()).add(30, 'day').toDate();
    this.notes = this.datas.notes ? this.datas.notes : null;
    if (this.datas.file_name_attach) {
      this.datas.attachFileNameArr = this.datas.file_name_attach;
      let isAttachFileClone = JSON.parse(JSON.stringify(this.datas.attachFileNameArr));
      this.attachFileNameArr = isAttachFileClone.map((p: any) => ({filename: p.filename}));
    }

    this.convertData(this.datas);

    this.contractService.getContractTypeList().subscribe(data => {
      this.typeList = data
    });

    this.contractService.getContractList('off', '', '', '', '', '', '', 30, "", "").subscribe(data => {
      this.contractConnectList = data.entities;
    });

    console.log(this.datas);


  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe(); // onDestroy cancels the subscribe request
  // }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameContract.nativeElement.focus();
    }, 0)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'infor-contract') {
      this.saveDraft();
    }
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        console.log(e.target.files[0].size);
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (extension && extension.toLowerCase() == 'pdf') {
          // const fileReader = new FileReader();
          // fileReader.readAsDataURL(file);
          // fileReader.onload = (e) => {
          //   //@ts-ignore
          //   const base64result = fileReader.result.toString().split(',')[1];
          //   const fileInput: any = document.getElementById('file-input');
          //   fileInput.value = '';
          //   this.datas.file_content = base64result;
          //   this.datas.file_name = file_name;
          //   this.datas.contractFile = file;
          //   // this.datas.documents['file_content_docx'] = null;
          //   // this.pdfSrc = Helper._getUrlPdf(base64result);
          // };
          const fileInput: any = document.getElementById('file-input');
          fileInput.value = '';
          this.datas.file_name = file_name;
          this.datas.contractFile = file;
          this.contractFileRequired();
          if (this.datas.is_action_contract_created) {
            this.uploadFileContractAgain = true;
          }

          // console.log(this.datas);
        } else if (extension && (extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'docx')) {
          this.toastService.showWarningHTMLWithTimeout("File hợp đồng chưa hỗ trợ định dạng DOC, DOCX", "", 3000);
        } else {
          this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu định dạng PDF", "", 3000);
        }
      } else {
        this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu nhỏ hơn 5MB", "", 3000);
      }
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

  fileChangedAttach(e: any) {
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = e.target.files[i];
      if (file) {
        if (file.size <= 10000000) {
          const file_name = file.name;
          if (this.attachFileNameArr.filter((p: any) => p.filename == file_name).length == 0) {
            const extension = file.name.split('.').pop();
            //this.datas.file_name_attach = file_name;
            //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
            this.attachFileArr.push(file);
            this.datas.attachFileArr = this.attachFileArr;
            // console.log(this.datas.attachFileArr);
            this.attachFileNameArr.push({filename: file.name});
            if (!this.datas.attachFileNameArr || this.datas.attachFileNameArr.length && this.datas.attachFileNameArr.length == 0) {
              this.datas.attachFileNameArr = [];
            }
            this.datas.attachFileNameArr.push({filename: file.name})
            if (this.datas.is_action_contract_created) {
              this.uploadFileAttachAgain = true;
            }
          } else {
            this.toastService.showWarningHTMLWithTimeout("Trùng file đính kèm", "", 3000);
          }
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          this.toastService.showWarningHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 5MB", "", 3000);
          break;
        }
      }
    }
    const valueEmpty: any = document.getElementById('attachFile');
    valueEmpty.value = "";
  }


  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFile').click();
  }

  //dropdown contract connect
  get getContractConnectItems() {
    return this.contractConnectList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  //--valid data step 1
  validData() {
    this.clearError();
    this.contractNameRequired();
    this.contractFileRequired();
    if (!this.contractNameRequired() || !this.contractNameCounter() || !this.contractFileRequired() || !this.contractNumberValid()) {
      // this.spinner.hide();
      return false;
    }

    let isDateSign = new Date(moment(this.sign_time).format('YYYY-MM-DD'));
    let isDateNow = new Date(moment().format('YYYY-MM-DD'));

    if (Number(isDateSign) < Number(isDateNow)) {
      this.toastService.showWarningHTMLWithTimeout('Ngày hết hạn ký không được nhỏ hơn ngày hiện tại!', "", 3000);
      return false;
    }

    return true
  }

  clearError() {
    if (this.name) {
      this.errorContractName = '';
    }
    if (this.datas.contractFile) {
      this.errorContractFile = '';
    }
    // if (Math.round((this.sign_time.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24) >= 0) {
    //   this.errorSignTime = '';
    // }
  }


  // getDataCoordination

  async callAPI(action?: string) {
    //call API step 1
    let countSuccess = 0;
    if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
      // sua hop dong
      if (this.datas.contractConnect && this.datas.contractConnect.length && this.datas.contractConnect.length > 0) {
        this.datas.contractConnect.forEach((res: any) => {
          res['contract_id'] = this.datas.contract_id_action;
        })
      }

      await this.contractService.addContractStep1(this.datas, this.datas.contract_id_action).toPromise().then((res: any) => {
        this.datas.id = res?.id;
        this.datas.contract_id = res?.id;
      }, (error: HttpErrorResponse) => {
        countSuccess++;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
        // return;
      })


      if (countSuccess == 0 && this.uploadFileContractAgain) {
        // console.log(this.datas.contractFile);
        await this.uploadService.uploadFile(this.datas.contractFile).toPromise().then((data: any) => {
          this.datas.filePath = data.file_object.file_path;
          this.datas.fileName = data.file_object.filename;
          this.datas.fileBucket = data.file_object.bucket;
        }, (error: HttpErrorResponse) => {
          countSuccess++;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
          // return;
        })
      }

      if (countSuccess == 0 && this.uploadFileContractAgain) {
        let data = {
          name: this.datas.name,
          type: 1,
          path: this.datas.filePath ? this.datas.filePath : this.datas.pdfUrl,
          filename: this.datas.fileName,
          bucket: this.datas.fileBucket,
          internal: 1,
          ordering: 1,
          status: 1,
          contract_id: this.datas.id,
        }
        let id_type_1 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 1)[0].id;
        await this.contractService.updateFileAttach(id_type_1, data, 1).toPromise().then((res: any) => {
          //this.datas.document_id = res?.id;
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000)
        })

        let id_type_2 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 2)[0].id;
        await this.contractService.updateFileAttach(id_type_2, data, 2).toPromise().then((respon: any) => {
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        this.contractService.getDataNotifyOriganzation().subscribe(async (res: any) => {
          this.datas.name_origanzation = res.name;
          // this.datas.attachFile
          if (this.datas.attachFileArr != null) {
            for (var i = 0; i < this.datas.attachFileArr.length; i++) {
              await this.uploadService.uploadFile(this.datas.attachFileArr[i]).toPromise().then((data) => {
                  // this.datas.attachFileArr[i].file_path = data.file_object.file_path;
                  // this.datas.attachFileArr[i].name = data.file_object.filename;
                  if (!this.datas.attachFileArr[i].id) {
                    this.datas.filePathAttach = data.file_object.file_path;
                    this.datas.fileNameAttach = data.file_object.filename;
                    this.datas.fileBucketAttach = data.file_object.bucket;
                    this.contractService.addDocumentAttach(this.datas).toPromise().then((data) => {
                        // this.datas.document_attach_id = data?.id;
                        this.datas.attachFileArr[i].id = data?.id;
                      },
                      error => {
                        this.spinner.hide();
                        this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                      }
                    );
                  }

                },
                error => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
                }
              );
            }

            // this.save_draft_infor.close_header

            if (action != "save_draft") {
              this.step = variable.stepSampleContract.step2;
              this.datas.stepLast = this.step;
              this.nextOrPreviousStep(this.step);

            } else {
              if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                this.save_draft_infor.close_header = false;
                this.save_draft_infor.close_modal.close();
              }
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            }
            this.spinner.hide();
          } else {
            if (action == "save_draft") {
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            } else {
              //next step
              this.step = variable.stepSampleContract.step2;
              this.datas.stepLast = this.step;
              // this.datas.document_id = '1';
              this.nextOrPreviousStep(this.step);
              // console.log(this.datas);

            }
            this.spinner.hide();
          }
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
        })
      }

      // else {
      //   this.save_draft_infor.
      // }

    } else {
      // this.contractService.addContractStep1(this.datas, this.datas.contract_id ? this.datas.contract_id : null).subscribe((data) => {
      //     this.datas.id = data?.id;
      //     this.datas.contract_id = data?.id;
      //     // upload file hop dong lan 1
      //     this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
      //         this.datas.filePath = data.file_object.file_path;
      //         this.datas.fileName = data.file_object.filename;
      //         this.datas.fileBucket = data.file_object.bucket;
      //         this.contractService.addDocument(this.datas).subscribe((data) => {
      //             //upload file hop dong lan 2
      //             this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
      //                 this.datas.filePathDone = data.file_object.file_path;
      //                 this.datas.fileNameDone = data.file_object.filename;
      //                 this.datas.fileBucketDone = data.file_object.bucket;
      //                 //
      //                 this.contractService.addDocumentDone(this.datas).subscribe((data) => {
      //                     this.datas.document_id = data?.id;
      //                     //
      //                     this.contractService.getDataNotifyOriganzation().subscribe((data: any) => {
      //                       this.datas.name_origanzation = data.name;
      //                       // file attach upload
      //                       if (this.datas.attachFileArr != null) {
      //                         for (var i = 0; i < this.datas.attachFileArr.length; i++) {
      //                           this.uploadService.uploadFile(this.datas.attachFileArr[i]).subscribe((data) => {
      //                               this.datas.filePathAttach = data.file_object.file_path;
      //                               this.datas.fileNameAttach = data.file_object.filename;
      //                               this.datas.fileBucketAttach = data.file_object.bucket;
      //                               this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
      //                                   this.datas.document_attach_id = data?.id;
      //                                 },
      //                                 error => {
      //                                   this.spinner.hide();
      //                                   this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
      //                                   return false;
      //                                 }
      //                               );
      //                             },
      //                             error => {
      //                               this.spinner.hide();
      //                               this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
      //                               return false;
      //                             }
      //                           );
      //                         }
      //
      //                         if (action == "save_draft") {
      //                           this.router.navigate(['/main/contract/create/draft']);
      //                           this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      //                         } else {
      //                           //next step
      //                           this.step = variable.stepSampleContract.step2;
      //                           this.datas.stepLast = this.step;
      //                           // this.datas.document_id = '1';
      //                           this.nextOrPreviousStep(this.step);
      //                           console.log(this.datas);
      //                           this.spinner.hide();
      //                         }
      //
      //
      //                       } else {
      //
      //                         if (action == "save_draft") {
      //                           this.router.navigate(['/main/contract/create/draft']);
      //                           this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      //                         } else {
      //                           //next step
      //                           this.step = variable.stepSampleContract.step2;
      //                           this.datas.stepLast = this.step;
      //                           // this.datas.document_id = '1';
      //                           this.nextOrPreviousStep(this.step);
      //                           this.spinner.hide();
      //                         }
      //
      //                       }
      //                     }, error => {
      //                       this.spinner.hide();
      //                       this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
      //                       return false;
      //                     })
      //                   },
      //
      //                   error => {
      //                     this.spinner.hide();
      //                     this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
      //                     return false;
      //                   }
      //                 );
      //               },
      //
      //               error => {
      //                 this.spinner.hide();
      //                 this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
      //                 return false;
      //               }
      //             );
      //           },
      //           error => {
      //             this.spinner.hide();
      //             this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
      //             return false;
      //           }
      //         );
      //       },
      //       error => {
      //         this.spinner.hide();
      //         this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
      //         return false;
      //       }
      //     );
      //   },
      //   error => {
      //     this.spinner.hide();
      //     this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
      //     return false;
      //   }
      // );
//==============================> edit code
      let error_api = false;
      await this.contractService.addContractStep1(this.datas, this.datas.contract_id ? this.datas.contract_id : null).toPromise().then((data) => {
        this.datas.id = data?.id;
        this.datas.contract_id = data?.id;
      }, (error) => {
        error_api = true;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
        return false;
      })

      // add file create new
      let dataFilePath_clone = '';
      let dataFileName_clone = '';
      if (this.datas.filePath && this.datas.fileName) {
        dataFilePath_clone = this.datas.filePath;
        dataFileName_clone = this.datas.fileName;
      }

      if (!error_api) {
        await this.uploadService.uploadFile(this.datas.contractFile).toPromise().then((data) => {
          this.datas.filePath = data.file_object.file_path;
          this.datas.fileName = data.file_object.filename;
          this.datas.fileBucket = data.file_object.bucket;
        }, () => {
          error_api = true;
          this.getErrorFile();
        })
      }

      // thay doi file ===> edit update file contract
      if (dataFilePath_clone && dataFilePath_clone != this.datas.filePath && dataFileName_clone && dataFileName_clone != this.datas.fileName) {
        let data = {
          name: this.datas.name,
          type: 1,
          path: this.datas.filePath ? this.datas.filePath : this.datas.pdfUrl,
          filename: this.datas.fileName,
          bucket: this.datas.fileBucket,
          internal: 1,
          ordering: 1,
          status: 1,
          contract_id: this.datas.id,
        }
        // let id_type_1 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 1)[0].id;
        await this.contractService.updateFileAttach(this.datas.document_id_1.id, data, 1).toPromise().then((res: any) => {
          this.datas.document_id_1 = res?.id;
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000)
        })
        // let id_type_2 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 2)[0].id;
        await this.contractService.updateFileAttach(this.datas.document_id_2.id, data, 2).toPromise().then((respon: any) => {
          this.datas.document_id_2 = respon?.id;
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
        })
      } else if (!dataFilePath_clone && !dataFileName_clone) {
        if (!error_api) {
         await this.contractService.addDocument(this.datas).toPromise().then((data) => {
            this.datas.document_id_1 = data;
          }, () => {
            error_api = true;
            this.getErrorFile();
          })
        }

        if (!error_api) {
          await this.uploadService.uploadFile(this.datas.contractFile).toPromise().then((data) => {
            this.datas.filePathDone = data.file_object.file_path;
            this.datas.fileNameDone = data.file_object.filename;
            this.datas.fileBucketDone = data.file_object.bucket;
          }, () => {
            error_api = true;
            this.getErrorFile();
          })
        }

        if (!error_api) {
          await this.contractService.addDocumentDone(this.datas).toPromise().then((data) => {
            this.datas.document_id_2 = data;
            this.datas.document_id = data?.id;
          }, () => {
            error_api = true;
            this.getErrorFile();
          })
        }
      }

      // } else { // thay doi file da upload
      //   let data = {
      //     name: this.datas.name,
      //     type: 1,
      //     path: this.datas.filePath ? this.datas.filePath : this.datas.pdfUrl,
      //     filename: this.datas.fileName,
      //     bucket: this.datas.fileBucket,
      //     internal: 1,
      //     ordering: 1,
      //     status: 1,
      //     contract_id: this.datas.id,
      //   }
      //   let id_type_1 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 1)[0].id;
      //   await this.contractService.updateFileAttach(id_type_1, data, 1).toPromise().then((res: any) => {
      //     this.datas.document_id = res?.id;
      //   }, (error: HttpErrorResponse) => {
      //     this.spinner.hide();
      //     this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000)
      //   })
      //   let id_type_2 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 2)[0].id;
      //   await this.contractService.updateFileAttach(id_type_2, data, 2).toPromise().then((respon: any) => {
      //     this.datas.document_id = respon?.id;
      //   }, (error: HttpErrorResponse) => {
      //     countSuccess++
      //     this.spinner.hide();
      //     this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
      //   })
      // }


      if (!error_api) {
        await this.contractService.getDataNotifyOriganzation().toPromise().then((data: any) => {
          this.datas.name_origanzation = data.name;
          // file attach upload
          if (this.datas.attachFileArr != null) {
            for (var i = 0; i < this.datas.attachFileArr.length; i++) {
              this.uploadService.uploadFile(this.datas.attachFileArr[i]).subscribe((data) => {
                  this.datas.filePathAttach = data.file_object.file_path;
                  this.datas.fileNameAttach = data.file_object.filename;
                  this.datas.fileBucketAttach = data.file_object.bucket;
                  this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
                      this.datas.document_attach_id = data?.id;
                    },
                    error => {
                      this.spinner.hide();
                      this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                      return false;
                    }
                  );
                },
                error => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
                  return false;
                }
              );
            }

            if (action == "save_draft") {
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            } else {
              //next step
              this.step = variable.stepSampleContract.step2;
              this.datas.stepLast = this.step;
              // this.datas.document_id = '1';
              this.nextOrPreviousStep(this.step);
              console.log(this.datas);
              this.spinner.hide();
            }
          } else {
            if (action == "save_draft") {
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            } else {
              //next step
              this.step = variable.stepSampleContract.step2;
              this.datas.stepLast = this.step;
              // this.datas.document_id = '1';
              this.nextOrPreviousStep(this.step);
              this.spinner.hide();
            }

          }
        }, () => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
          return false;
        })
      }

    }

  }

  getErrorFile() {
    this.spinner.hide();
    this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
    return false;
  }

  // --next step 2
  async next() {
    if (!this.validData()) {
      return;
    } else {
      this.spinner.show();

      console.log("this datas ", this.datas);

      // set value to datas
      this.datas.name = this.name;
      this.datas.contract_no = this.contract_no;
      this.datas.sign_time = this.sign_time;
      this.datas.notes = this.notes;
      this.defineData(this.datas);
      const fileReader = new FileReader();
      if (this.datas.is_action_contract_created) {
        // file hợp đồng chính không thay đổi => convert url sang dạng blob
        if (!this.uploadFileContractAgain && this.datas.contractFile && (typeof this.datas.contractFile == 'string')) {
          // await this.contractService.getDataBinaryFileUrlConvert(this.datas.contractFile).toPromise().then((res: any) => {
          //   if (res)
          //     this.datas.contractFile = res;
          // })
        } else if (this.uploadFileContractAgain && this.datas.contractFile) { // dữ liệu file hợp đồng chính bị thay đổi
          fileReader.readAsDataURL(this.datas.contractFile);
          fileReader.onload = (e) => {
            if (fileReader.result)
              this.datas.file_content = fileReader.result.toString().split(',')[1];
            this.datas.uploadFileContractAgain = true;
          };
        }
      } else {
        fileReader.readAsDataURL(this.datas.contractFile);
        fileReader.onload = (e) => {
          if (fileReader.result)
            this.datas.file_content = fileReader.result.toString().split(',')[1];
        };
      }

      if (this.datas.contract_no) {
        //check so hop dong da ton tai hay chua
        this.contractService.checkCodeUnique(this.datas.contract_no).subscribe(
          dataCode => {
            if (dataCode.success) {
              this.callAPI();
            } else {
              this.toastService.showErrorHTMLWithTimeout('Số hợp đồng đã tồn tại', "", 3000);
              this.spinner.hide();
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
            this.spinner.hide();
          }
        )
      } else {
        this.callAPI();
      }

    }
  }

  // async getConvertToFileBinary(res: any, file_type: string) {
  //   await this.contractService.convertUrltoBinary(res).toPromise().then((res) => {
  //     this.datas[file_type] = res;
  //   }, () => {
  //     this.toastService.showErrorHTMLWithTimeout('Có lỗi xảy ra!', "", 3000);
  //   })
  // }

  convertData(datas: any) {
    // console.log(this.datas.contractConnect);
    if (this.datas.contractConnect != null && this.datas.contractConnect != '') {
      const array_empty: any[] = [];
      this.datas.contractConnect.forEach((element: any, index: number) => {
        console.log(element);
        const data = element.ref_id;
        array_empty.push(data);
      })
      this.contractConnect = array_empty;
      console.log(array_empty);
    }
  }

  defineData(datas: any) {
    this.datas.name = this.name;
    this.datas.sign_time = this.sign_time;
    if (this.datas.contract_no == '') {
      this.datas.contract_no = null;
    }
    if (this.datas.notes == '') {
      this.datas.notes = null;
    }
    this.datas.type_id = this.type_id;

    console.log(this.contractConnect);
    if (this.contractConnect && this.contractConnect.length && this.contractConnect.length > 0) {
      const array_empty: ContractConnectArr[] = [];
      this.contractConnect.forEach((element: any, index: number) => {
        const data = new ContractConnectArr(element);
        array_empty.push(data);
      })
      this.datas.contractConnect = array_empty;
      console.log(array_empty);
    } else {
      this.datas.contractConnect = null;
    }
  }

  async saveDraft() {
    if (!this.validData()) {
      if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
      return;
    }
    // else {
    this.spinner.show();
    // set value to datas
    this.datas.name = this.name;
    this.datas.contract_no = this.contract_no;
    this.datas.sign_time = this.sign_time;
    this.datas.notes = this.notes;
    this.defineData(this.datas);
    const fileReader = new FileReader();
    if (this.datas.is_action_contract_created) {
      console.log(typeof this.datas.contractFile)
      // file hợp đồng chính không thay đổi => convert url sang dạng blob
      if (!this.uploadFileContractAgain && this.datas.contractFile && (typeof this.datas.contractFile == 'string')) {
        await this.contractService.getDataBinaryFileUrlConvert(this.datas.contractFile).toPromise().then((res: any) => {
          if (res)
            this.datas.contractFile = res;
        })
      } else if (this.uploadFileContractAgain && this.datas.contractFile) { // dữ liệu file hợp đồng chính bị thay đổi
        fileReader.readAsDataURL(this.datas.contractFile);
        fileReader.onload = (e) => {
          if (fileReader.result)
            this.datas.file_content = fileReader.result.toString().split(',')[1];
          this.datas.uploadFileContractAgain = true;
        };
      }
    } else {
      if (this.datas.contractFile) {
        fileReader.readAsDataURL(this.datas.contractFile);
        fileReader.onload = (e) => {
          if (fileReader.result)
            this.datas.file_content = fileReader.result.toString().split(',')[1];
        };
      }

    }

    if (this.datas.contract_no != null && this.datas.contract_no != '') {
      //check so hop dong da ton tai hay chua
      this.contractService.checkCodeUnique(this.datas.contract_no).subscribe(
        dataCode => {
          if (dataCode.success) {
            if (this.datas.is_action_contract_created && this.router.url.includes("edit"))
              this.callAPI("save_draft");
            else
              this.callAPI_Draft();
          } else {
            this.toastService.showErrorHTMLWithTimeout('Số hợp đồng đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
          this.spinner.hide();
        }
      )
    } else {
      this.callAPI("save_draft");
      // if (this.datas.is_action_contract_created && this.router.url.includes("edit"))
      //   this.callAPI("save_draft");
      // else
      //   this.callAPI_Draft();
    }
    //
    // }
  }

  callAPI_Draft() {
    //call API step 1
    this.contractService.addContractStep1(this.datas).subscribe((data) => {
        // console.log(JSON.stringify(data));
        this.datas.id = data?.id;
        this.datas.contract_id = data?.id;
        if (this.datas.contractFile) {
          this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
              console.log(JSON.stringify(data));
              this.datas.filePath = data.file_object.file_path;
              this.datas.fileName = data.file_object.filename;
              this.datas.fileBucket = data.file_object.bucket;
              this.contractService.addDocument(this.datas).subscribe((data) => {
                  console.log(JSON.stringify(data));
                  //upload file hop dong lan 2
                  this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
                      this.datas.filePathDone = data.file_object.file_path;
                      this.datas.fileNameDone = data.file_object.filename;
                      this.datas.fileBucketDone = data.file_object.bucket;

                      this.contractService.addDocumentDone(this.datas).subscribe((data) => {
                          this.datas.document_id = data?.id;

                          if (this.datas.attachFileArr != null) {
                            for (var i = 0; i < this.datas.attachFileArr.length; i++) {

                              console.log(this.datas.attachFileArr[i])
                              this.uploadService.uploadFile(this.datas.attachFileArr[i]).subscribe((data) => {
                                  // console.log(JSON.stringify(data));
                                  this.datas.filePathAttach = data.file_object.file_path;
                                  this.datas.fileNameAttach = data.file_object.filename;
                                  this.datas.fileBucketAttach = data.file_object.bucket;
                                  this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
                                      console.log(JSON.stringify(data));
                                      this.datas.document_attach_id = data?.id;

                                    },
                                    error => {
                                      this.spinner.hide();
                                      this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                                      return false;
                                    }
                                  );
                                },
                                error => {
                                  this.spinner.hide();
                                  this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
                                  return false;
                                }
                              );
                            }
                            //next step
                            if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                              this.save_draft_infor.close_header = false;
                              this.save_draft_infor.close_modal.close();
                            }
                            this.router.navigate(['/main/contract/create/draft']);
                            this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);

                            this.spinner.hide();
                          } else {
                            //next step
                            if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
                              this.save_draft_infor.close_header = false;
                              this.save_draft_infor.close_modal.close();
                            }
                            this.router.navigate(['/main/contract/create/draft']);
                            this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
                            this.spinner.hide();
                          }
                        },

                        error => {
                          this.spinner.hide();
                          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
                          return false;
                        }
                      );
                    },

                    error => {
                      this.spinner.hide();
                      this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
                      return false;
                    }
                  );
                },

                error => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
                  return false;
                }
              );
            },
            error => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
              return false;
            }
          );
        } else {
          if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
            this.save_draft_infor.close_header = false;
            this.save_draft_infor.close_modal.close();
          }
          this.router.navigate(['/main/contract/create/draft']);
          this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);

          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
        return false;
      }
    );

    // case api error => close popup save draft
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
      this.save_draft_infor.close_header = false;
      this.save_draft_infor.close_modal.close();
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }

  changeAddContract(link: any) {
    // console.log(link);
    this.router.navigate([link]);
  }

  characterCounter(str: any) {
    var character = str.length;
    return character;
  }

  contractNameCounter() {
    if (this.name) {
      this.errorContractName = "";
      if (this.characterCounter(this.name) > 200) {
        this.errorContractName = "Tên hợp đồng không được vượt quá 200 ký tự";
        return false;
      }
      return true;
    }
  }

  contractNumberCounter() {
    if (this.contract_no && this.characterCounter(this.contract_no) > 32) {
      this.errorContractNumber = "Số hợp đồng không được vượt quá 32 ký tự";
      return false;
    }
    return true;
  }

  contractNumberValid() {
    // this.errorContractNumber = "";
    // if (this.contract_no) {
    //   var regex = /^[0-9]\d*$/;
    //   var matches = this.contract_no.match(regex);
    //   if (matches) {
    //     return this.contractNumberCounter();
    //   } else {
    //     this.errorContractNumber = "Số hợp đồng chỉ được nhập số";
    //     return false;
    //   }
    // }
    // return true;
    return this.contractNumberCounter();
  }

  contractNameRequired() {
    this.errorContractName = "";
    if (!this.name) {
      this.errorContractName = "error.contract.name.required";
      return false;
    }
    return true;
  }

  contractFileRequired() {
    this.errorContractFile = "";
    if (!this.datas.contractFile && !this.datas.file_name) {
      this.errorContractFile = "error.contract.file.required";
      return false;
    }
    return true;
  }

  deleteFileAttach(item: any, index_dlt: number) {
    if (item.id) {
      this.spinner.show();
      let data = this.datas.i_data_file_contract.filter((p: any) => p.id == item.id)[0];
      if (data) data.status = 0;
      this.contractService.updateFileAttach(item.id, data).subscribe((res: any) => {
        this.datas.attachFileNameArr.splice(index_dlt, 1);
        this.attachFileNameArr.splice(index_dlt, 1);
        //this.datas.attachFileArr.splice(index_dlt, 1);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout("Lỗi xoá file đính kèm!", "", 3000);
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      })
    } else {
      this.datas.attachFileNameArr.splice(index_dlt, 1);
      this.attachFileNameArr.splice(index_dlt, 1);
      this.datas.attachFileArr.splice(index_dlt, 1);
      //this.attachFileNameArr = this.attachFileNameArr.filter((p: any) => p.filename !== item.filename);
    }

    // console.log(this.datas.attachFileArr);
  }

}
