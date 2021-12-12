import {ContractService} from 'src/app/service/contract.service';
import {UploadService} from './../../../../../service/upload.service';
import {HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbCalendar, NgbDatepicker, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {variable} from "../../../../../config/variable";
import {Observable} from 'rxjs';
import {AddContractComponent} from "../../../add-contract/add-contract.component";
import {DatepickerOptions} from 'ng2-datepicker';
import {getYear} from 'date-fns';
import locale from 'date-fns/locale/en-US';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';

export class ContractConnectArr {
  ref_id: number;

  constructor(ref_id:number) {
    this.ref_id = ref_id;
  }
}
@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit {
  @Input() AddComponent: AddContractComponent | unknown;
  @Input() datas: any;
  @Input() step: any;

  @Output() stepChangeInfoContract = new EventEmitter<string>();

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

  id: any;
  name: any;
  code: any;
  type_id: any;
  attachFile: any;
  contractConnect: any;
  sign_time: Date;
  notes: any;
  filePath: any;

  //error
  errorContractName: any = '';
  errorContractFile: any = '';
  errorSignTime:any = '';

  minDate:any;

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

  // options sample with default values
  options: DatepickerOptions = {
    minYear: getYear(new Date()) - 30, // minimum available and selectable year
    maxYear: getYear(new Date()) + 30, // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'dd/MM/yyyy', // date format to display in input
    formatTitle: 'MM/yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };

  ngOnInit(): void {

    this.name = this.datas.name ? this.datas.name : null;
    this.code = this.datas.code ? this.datas.code : null;
    this.type_id = this.datas.type_id ? this.datas.type_id : null;
    this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : null;
    this.sign_time = new Date();
    this.sign_time = this.datas.sign_time ? this.datas.sign_time : this.sign_time.setDate(this.sign_time.getDate() + 30);
    this.notes = this.datas.notes ? this.datas.notes : null;

    this.contractService.getContractTypeList().subscribe(data => {
      console.log(data);
      this.contractTypeList = data
    });

    this.contractService.getContractList('', '', '', '', '').subscribe(data => {
      console.log(data.entities);
      this.contractConnectList = data.entities;
    });

    this.dropdownTypeSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };

    this.dropdownConnectSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true,
      itemsShowLimit: 2,
    };
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
        if (extension.toLowerCase() == 'pdf') {
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
        } else if (extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'docx') {
          this.toastService.showErrorHTMLWithTimeout("File hợp đồng chưa hỗ trợ định dạng DOC, DOCX", "", 10000);
        } else {
          this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu định dạng PDF", "", 10000);
        }
      } else {
        this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu nhỏ hơn 5MB", "", 10000);
      }
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

  fileChangedAttach(e: any) {
    console.log(e.target.files)
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 5000000) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();
          this.datas.file_name_attach = file_name;
          //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
          this.datas.attachFile = file;
          //this.datas.attachFile = e.target.files;
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 5MB", "", 10000);
          break;
        }
      }
    }
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFile').click();
  }

  //dropdown contract type
  get getContractTypeItems() {
    return this.contractTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
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
    if (!this.name) {
      this.errorContractName = 'error.contract.name.required';
      return false;
    }
    if (!this.datas.contractFile) {
      this.errorContractFile = 'error.contract.file.required';
      return false;
    }
    // console.log(Math.floor((this.sign_time.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24));
    // if(Math.floor((this.sign_time.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24) < 0){
    //   this.errorSignTime = 'Thời gian ký không được nhỏ hơn ngày hôm nay!';
    //   return false;
    // }

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

  async callAPI() {
    //call API step 1
    this.contractService.addContractStep1(this.datas).subscribe((data) => {
        console.log(JSON.stringify(data));
        this.datas.id = data?.id;
        this.datas.contract_id = data?.id;
        this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
            console.log(JSON.stringify(data));
            this.datas.filePath = data.file_object.file_path;
            this.datas.fileName = data.file_object.filename;
            this.datas.fileBucket = data.file_object.bucket;
            this.contractService.addDocument(this.datas).subscribe((data) => {
                console.log(JSON.stringify(data));
                this.datas.document_id = data?.id;

                this.contractService.getDataNotifyOriganzation().subscribe((data: any) => {
                  console.log(JSON.stringify(data));
                  this.datas.name_origanzation = data.name;

                  if (this.datas.attachFile != null) {
                    this.uploadService.uploadFile(this.datas.attachFile).subscribe((data) => {
                        console.log(JSON.stringify(data));
                        this.datas.filePathAttach = data.file_object.file_path;
                        this.datas.fileNameAttach = data.file_object.filename;
                        this.datas.fileBucketAttach = data.file_object.bucket;
                        this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
                            console.log(JSON.stringify(data));
                            this.datas.document_attach_id = data?.id;
                            //next step
                            this.step = variable.stepSampleContract.step2;
                            this.datas.stepLast = this.step;
                            // this.datas.document_id = '1';
                            this.nextOrPreviousStep(this.step);
                            console.log(this.datas);
                            this.spinner.hide();
                          },
                          error => {
                            this.spinner.hide();
                            this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 10000);
                            return false;
                          }
                        );
                      },
                      error => {
                        this.spinner.hide();
                        this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 10000);
                        return false;
                      }
                    );
                  } else {

                    //next step
                    this.step = variable.stepSampleContract.step2;
                    this.datas.stepLast = this.step;
                    // this.datas.document_id = '1';
                    this.nextOrPreviousStep(this.step);
                    console.log(this.datas);
                    this.spinner.hide();
                  }
                }, error => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 10000);
                  return false;
                })
              },
              error => {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 10000);
                return false;
              }
            );
          },
          error => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 10000);
            return false;
          }
        );
      },
      error => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 10000);
        return false;
      }
    );
  }

  // --next step 2
  next() {
    this.spinner.show();
    if (!this.validData()) {
      this.spinner.hide();
    } else {
      // gán value step 1 vào datas
      this.datas.name = this.name;
      this.datas.code = this.code;
      this.datas.sign_time = this.sign_time;
      this.datas.notes = this.notes;

      this.defineData(this.datas);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.datas.contractFile);
      fileReader.onload = (e) => {
        //@ts-ignore
        const base64result = fileReader.result.toString().split(',')[1];
        this.datas.file_content = base64result;
      };

      this.callAPI();
    }

  }

  defineData(datas:any){
    this.datas.name = this.name;
    this.datas.sign_time = this.sign_time;
    if(this.datas.code == ''){
      this.datas.code = null;
    }
    if(this.datas.notes == ''){
      this.datas.notes = null;
    }

    console.log(this.type_id);
    if(this.type_id != null && this.type_id != ''){
      this.type_id.forEach((element: any, index: number) => {
        this.datas.type_id = element.id;
      })
    }


    console.log(this.contractConnect);
    if(this.contractConnect != null && this.contractConnect != ''){
      const array_empty: ContractConnectArr[] = [];
      this.contractConnect.forEach((element: any, index: number) => {
        const data = new ContractConnectArr(element.id);
        array_empty.push(data);
      })
      this.datas.contractConnect = array_empty;
      console.log(array_empty);
    }
  }

  saveDraft() {
    this.spinner.show();
    if (!this.validData()) return;
    else {
      // gán value step 1 vào datas
      this.defineData(this.datas);
      console.log(this.datas);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.datas.contractFile);
      fileReader.onload = (e) => {
        //@ts-ignore
        const base64result = fileReader.result.toString().split(',')[1];
        this.datas.file_content = base64result;
      };

      this.callAPI_Draft();
    }
  }

  callAPI_Draft() {
    //call API step 1
    this.contractService.addContractStep1(this.datas).subscribe((data) => {
      console.log(JSON.stringify(data));
      this.datas.id = data?.id;
      this.datas.contract_id = data?.id;

        this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
            console.log(JSON.stringify(data));
            this.datas.filePath = data.file_object.file_path;
            this.datas.fileName = data.file_object.filename;
            this.datas.fileBucket = data.file_object.bucket;
            this.contractService.addDocument(this.datas).subscribe((data) => {
                console.log(JSON.stringify(data));
                this.datas.document_id = data?.id;

                if(this.datas.attachFile != null){
                  this.uploadService.uploadFile(this.datas.attachFile).subscribe((data) => {
                    console.log(JSON.stringify(data));
                    this.datas.filePathAttach = data.file_object.file_path;
                    this.datas.fileNameAttach = data.file_object.filename;
                    this.datas.fileBucketAttach = data.file_object.bucket;
                    this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
                      console.log(JSON.stringify(data));
                      this.datas.document_attach_id = data?.id;

                      //next step
                      this.router.navigate(['/main/contract/create/draff']);
                      this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 10000);

                      this.spinner.hide();
                      },
                      error => {
                        this.spinner.hide();
                        this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 10000);
                        return false;
                      }
                    );
                    },
                    error => {
                      this.spinner.hide();
                      this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 10000);
                      return false;
                    }
                  );
                }else {
                  //next step
                  this.router.navigate(['/main/contract/create/draff']);
                  this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 10000);
                  this.spinner.hide();
                }
              },
              error => {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 10000);
                return false;
              }
            );
          },
          error => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 10000);
            return false;
          }
        );
      },
      error => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 10000);
        return false;
      }
    );
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }

  changeAddContract(link: any) {
    console.log(link);
    this.router.navigate([link]);
  }

}
