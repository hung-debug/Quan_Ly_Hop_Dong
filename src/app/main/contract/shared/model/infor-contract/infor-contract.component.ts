import {ContractService} from 'src/app/service/contract.service';
import {UploadService} from './../../../../../service/upload.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {optionsCeCa, variable} from "../../../../../config/variable";
import {Observable, Subscription} from 'rxjs';
import {AddContractComponent} from "../../../add-contract/add-contract.component";
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from "moment";
import {HttpErrorResponse} from '@angular/common/http';
import { CheckSignDigitalService } from 'src/app/service/check-sign-digital.service';
import Swal from 'sweetalert2';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';
import { Validators } from '@angular/forms';
import { parttern_input } from 'src/app/config/parttern';
import { NgxInputSearchModule } from "ngx-input-search";
import { environment } from 'src/environments/environment';
import { ConfirmUploadNewFileDialogComponent } from './../dialog/confirm-upload-new-file-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('divFileAttach') divFileAttach: ElementRef;
  @ViewChild('contractImg') contractImg: ElementRef;
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
  expire_time: any;

  attachFileArr: any[] = [];
  attachFileNameArr: any[] = [];
  contract_no: any;

  optionsCeCaValue: any = null;

  //error
  errorContractName: any = '';
  errorContractFile: any = '';
  errorSignTime: any = '';
  errorContractNumber: any = '';
  errorCeCa: any = '';
  errorContractType: string = '';

  optionsCeCa: Array<any> = [];

  currentUser: any;

  checkView: boolean = true;

  ceca: boolean;
  environment: any = "";
  isCloseDialog : boolean = false;
  pagePdfFileNew: any = 0;
  pagePdfFileOld: any = 0;
  oldFile: any;
  currentFile: any;
  
  uploadFileContractAgain: boolean = false;
  uploadFileAttachAgain: boolean = false;
  isFileAttachUploadNewEdit: any;
  public subscription: Subscription;
  minDate: Date = moment().toDate();
  public messageForSibling: string;
  attachFilesList: any[] = [];
  isDocx: boolean = false;
  contractId: any;
  constructor(
    private uploadService: UploadService,
    private contractService: ContractService,
    private contractTypeService: ContractTypeService,
    public datepipe: DatePipe,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private checkSignDigitalService: CheckSignDigitalService,
    private checkViewContractService: CheckViewContractService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.step = variable.stepSampleContract.step1;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  async ngOnInit(): Promise<void> {  
    this.environment = environment
    this.spinner.hide();

    let idContract = Number(this.activeRoute.snapshot.paramMap.get('id'));
    this.contractId = idContract
    this.checkView = await this.checkViewContractService.callAPIcheckViewContract(idContract, false);

    if(!idContract || this.checkView) {
      this.actionSuccess();
    } else {
      this.router.navigate(['/page-not-found']);
    }

    if(this.type_id){
      this.changeTypeContract();
    }
        
    if(this.router.url.includes("edit") && !this.datas.isUploadNewFile && this.datas.countUploadContractFile == 0){
      await this.convertUrltoFile(this.datas.contractFile)
    }
  }
  
  ngOnDestroy() {
    if(this.datas.isUploadNewFile){
      this.datas.isUploadNewFile = false;
    }
  }

  actionSuccess() {
    this.optionsCeCa = optionsCeCa;

    if(this.datas.ceca_push != 0  && this.datas.ceca_push != 1)
      this.datas.ceca_push = this.optionsCeCaValue;
    else
      this.optionsCeCaValue = this.datas.ceca_push;

    this.name = this.datas.name ? this.datas.name : null;
    this.contract_no = this.datas.contract_no ? this.datas.contract_no.trim() : this.datas.contract_no;
    this.type_id = this.datas.type_id ? this.datas.type_id : null;

    this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : null;

    this.sign_time = this.datas.sign_time ? moment(this.datas.sign_time).toDate() : moment(new Date()).add(30, 'day').toDate();

    this.expire_time = this.datas.contract_expire_time ? moment(this.datas.contract_expire_time).toDate() : null;

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

    this.contractService.getContractList('off', '', '', '', '', '', '', 30, "", 10000,'','').subscribe(data => {
      this.contractConnectList = data.entities;
    });

    this.contractService.getDataNotifyOriganzation().subscribe((response) => {
      if(response.ceca_push_mode == 'NONE') {
        this.ceca = false;
      } else if(response.ceca_push_mode == 'SELECTION') {
        this.ceca = true
        if (environment.flag == 'NB') {
          this.optionsCeCaValue = 1
        }
      } else {
        this.ceca = false
        this.optionsCeCaValue = 0
      }
    })

  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.nameContract.nativeElement.focus();
    }, 0)

    this.adjustImagePosition();
    this.divFileAttach.nativeElement.addEventListener('scroll', () => this.adjustImagePosition());
    new MutationObserver(() => this.adjustImagePosition()).observe(this.divFileAttach.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  adjustImagePosition() {
    const divFileAttach = this.divFileAttach.nativeElement;
    const contractImg = this.contractImg.nativeElement;
    
    if (divFileAttach.scrollHeight > divFileAttach.clientHeight) {
      contractImg.classList.add('shifted');
    } else {
      contractImg.classList.remove('shifted');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'infor-contract') {
      this.saveDraft();
    }
  }

  convertFileName(str1: any) {
    let str = str1.normalize('NFC');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ /g,"-");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"-");
    return str;
  }

  async fileChanged(e: any) { 
    const file1 = e.target.files[0];  
    if (file1) {
      let file = new File([file1], this.convertFileName(file1.name));
      this.currentFile = file;
      if (this.datas.countUploadContractFile >= 1) {
        this.datas.pagePdfFileOld = this.datas.pagePdfFileNew;
      }   
      // giới hạn file upload lên là 10mb     
      if (e.target.files[0].size <= 10*(Math.pow(1024, 2))) {
        this.spinner.show();
        const file_name = file.name
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (extension && (['pdf','docx'].includes(extension.toLowerCase()))) {
          this.datas.pagePdfFileNew = await this.getInforFile(file);
          this.datas.isUploadNewFile = true;
          try {
            //Check file hợp đồng đã có chữ ký số hay chưa
            this.checkSignDigitalService.getList(file).subscribe((response) => {            
              this.spinner.hide();
              if(response.length == 0) {
                const fileInput: any = document.getElementById('file-input');
                fileInput.value = '';
                this.datas.file_name = file_name;
                this.datas.contractFile = file;
                this.contractFileRequired();
                if (this.datas.is_action_contract_created) {
                  this.uploadFileContractAgain = true;
                }

                this.datas.flagDigitalSign = false;
              } else if(response.length > 0) {
                Swal.fire({
                  html: "File hợp đồng đã chứa chữ ký số; Vui lòng tải lên file hợp đồng chưa được ký số để thực hiện ký hợp đồng",
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b0bec5',
                  confirmButtonText: 'Xác nhận'
                });

                // const fileInput: any = document.getElementById('file-input');
                // fileInput.value = '';
                // this.datas.file_name = file_name;
                // this.datas.contractFile = file;
                // this.contractFileRequired();
                // if (this.datas.is_action_contract_created) {
                //   this.uploadFileContractAgain = true;
                // }

                this.datas.flagDigitalSign = true;
              }
              this.setFileTypeDocx(this.datas.file_name.split(".").pop())
            }, (error: any) => {
              this.spinner.hide()
              this.toastService.showErrorHTMLWithTimeout('error.contract.file.type','','3000')
            })
          } catch (error) {
            this.spinner.hide()
          }
        } else {
          this.spinner.hide()
          this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu định dạng PDF, docx", "", 3000);
        }
      } else {
        this.spinner.hide()
        this.toastService.showWarningHTMLWithTimeout("File hợp đồng yêu cầu tối đa 10MB", "", 3000);
      }
    }
  }
  
  async getInforFile(file:any){
    // if((this.router.url.includes("edit")) || (this.datas.isUploadNewFile && this.datas.contract_user_sign && this.datas.countUploadContractFile > 1) ){
    let response = await this.checkSignDigitalService.getPagePdfOld(file).toPromise() 
    return response.pageSize;
    // }
  }
  
  async convertUrltoFile(url: any){
    if(url){
      this.contractService.getDataFileUrl(url).subscribe( async (response: any) =>{
        const blob = new Blob([response], { type: 'application/octet-stream' });
        // Tạo một đối tượng File từ blob
        this.oldFile = new File([blob], "abc");
        this.datas.pagePdfFileOld = await this.getInforFile(this.oldFile)
      })
      return this.oldFile;  
    }
  }

  setFileTypeDocx(extension: string) {
    if (extension?.toLocaleLowerCase() == 'docx') {
      this.datas.isDocx = true
    } else {
      this.datas.isDocx = false
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

  fileChangedAttach(e: any) {
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file1 = e.target.files[i];
      if (file1) {
        let file = new File([file1], this.convertFileName(file1.name));
        if (file.size <= 10*(Math.pow(1024, 2))) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();

          if (this.attachFileNameArr.filter((p: any) => p.filename == file_name).length == 0) {
            const extension: any = file.name.split('.').pop();
            if (extension && extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'docx' || extension.toLowerCase() == 'png'
              || extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'zip' || extension.toLowerCase() == 'rar'
              || extension.toLowerCase() == 'txt' || extension.toLowerCase() == 'xls' || extension.toLowerCase() == 'xlsx'
            ) {
              this.attachFileArr.push(file);
              this.datas.attachFileArr = this.attachFileArr;
              //
              this.attachFileNameArr.push({filename: file.name});
              if (!this.datas.attachFileNameArr || this.datas.attachFileNameArr.length && this.datas.attachFileNameArr.length == 0) {
                this.datas.attachFileNameArr = [];
              }
              this.datas.attachFileNameArr.push({filename: file.name})
              if (this.datas.is_action_contract_created) {
                this.uploadFileAttachAgain = true;
              }

            } else {
              this.toastService.showWarningHTMLWithTimeout("attach.file.valid", "", 3000);
            }
          } else {
            this.toastService.showWarningHTMLWithTimeout("Trùng file đính kèm", "", 3000);
          }
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          this.toastService.showWarningHTMLWithTimeout("File đính kèm yêu cầu tối đa 10MB", "", 3000);
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
    this.contractCeCaValid();
    if (environment.flag == 'NB') {
      this.contractTypeValid();
      if (!this.contractNameRequired() || !this.contractNameCounter() || !this.contractFileRequired() || !this.contractNumberValid() || !this.contractCeCaValid() || !this.contractTypeValid()) {
        // this.spinner.hide();
        return false;
      }
    } else if (environment.flag == 'KD' && 
      (!this.contractNameRequired() || !this.contractNameCounter() || !this.contractFileRequired() || !this.contractNumberValid() || !this.contractCeCaValid())) {
        return false
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
  }

  async changeTypeContract() {
    if(this.type_id) {
      const informationContractType = await this.contractTypeService.getContractTypeById(this.type_id).toPromise();
      if(informationContractType.ceca_push == 1) {
        this.optionsCeCa = optionsCeCa;
        this.optionsCeCaValue = 1;
        this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 1);
      } else if(!informationContractType.ceca_push) {
        this.optionsCeCa = optionsCeCa;
        this.optionsCeCaValue = 0;
        this.optionsCeCa = this.optionsCeCa.filter((res: any) => res.id == 0);
      } else {
        this.optionsCeCaValue = null;
        this.optionsCeCa = optionsCeCa;
      }
    } else {
      if (environment.flag == 'NB') {
        this.optionsCeCaValue = 1;
      } else {
        this.optionsCeCaValue = 0;
      }
      this.optionsCeCa = optionsCeCa;
    }

    this.datas.ceca_push = this.optionsCeCaValue;
  }

  async callAPI(action?: string) {

    this.datas.ceca_push = this.optionsCeCaValue;

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
        //
        await this.uploadService.uploadFile(this.datas.contractFile, true).toPromise().then((data: any) => {
          this.datas.filePath = data?.file_object?.file_path;
          this.datas.fileName = data?.file_object?.filename;
          this.datas.fileBucket = data?.file_object?.bucket;
          if (!data.success) {
            this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
            this.spinner.hide()
            countSuccess++;
          }
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

        if(this.datas.i_data_file_contract.length > 0) {
          let id_type_1 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 1)[0].id;

          await this.contractService.updateFileAttach(id_type_1, data, 1).toPromise().then((res: any) => {

          }, (error: HttpErrorResponse) => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000)
          })

          await this.uploadService.uploadFile(this.datas.contractFile, true).toPromise().then((data: any) => {
            this.datas.filePath = data?.file_object?.file_path;
            this.datas.fileName = data?.file_object?.filename;
            this.datas.fileBucket = data?.file_object?.bucket;
            if (!data.success) {
              this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
              this.spinner.hide()
              countSuccess++;
            }
          }, (error: HttpErrorResponse) => {
            countSuccess++;
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
            // return;
          })

          data = {
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

          let id_type_2 = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 2)[0].id;
          await this.contractService.updateFileAttach(id_type_2, data, 2).toPromise().then((respon: any) => {
            this.datas.document_id = respon?.id;
          }, (error: HttpErrorResponse) => {
            countSuccess++
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
          })
          }
        }


      if (countSuccess == 0) {
        this.contractService.getDataNotifyOriganzation().subscribe(async (res: any) => {
          this.datas.name_origanzation = res.name;
          // this.datas.attachFile
          if (this.datas.attachFileArr != null) {
            for (var i = 0; i < this.datas.attachFileArr.length; i++) {
              await this.uploadService.uploadFile(this.datas.attachFileArr[i], false).toPromise().then(async (data) => {
                  if (!this.datas.attachFileArr[i].id) {
                    this.datas.filePathAttach = data.file_object.file_path;
                    this.datas.fileNameAttach = data.file_object.filename;
                    this.datas.fileBucketAttach = data.file_object.bucket;
                    await this.contractService.addDocumentAttach(this.datas).toPromise().then((data) => {
                        // this.datas.document_attach_id = data?.id;
                        this.datas.attachFileArr[i].id = data?.id;
                        this.datas.attachFileNameArr[i].id = data?.id
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
            // set data attach file uploaded - edit step
            this.contractService.getFileContract(this.datas.contract_id).subscribe((res:any) => {
              // let attachFilesList: any[] = []
              this.datas.attachFilesList = []
              for (let i = 0; i < res.length; i++){
                // this.datas?.i_data_file_contract?.push(res[i])
                this.attachFilesList.push(res[i])
                this.datas.attachFilesList.push(res[i])
              }
            })
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
              if(this.isCloseDialog || !this.datas.isUploadNewFile || this.datas.isUploadNewFile){
                this.nextOrPreviousStep(this.step);
              }
            }
            this.spinner.hide();
          }
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
        })
      }
    } else {
      let error_api = false;
      await this.contractService.addContractStep1(this.datas, this.datas.contract_id ? this.datas.contract_id : null).toPromise().then((data: any) => {
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
        await this.uploadService.uploadFile(this.datas.contractFile, true).toPromise().then((data) => {
          this.datas.filePath = data?.file_object?.file_path;
          this.datas.fileName = data?.file_object?.filename;
          this.datas.fileBucket = data?.file_object?.bucket;
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
          this.datas.document_id_1.id = res?.id;
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000)
        })

        await this.contractService.updateFileAttach(this.datas.document_id_2.id, data, 2).toPromise().then((respon: any) => {
          this.datas.document_id_2.id = respon?.id;
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
          await this.uploadService.uploadFile(this.datas.contractFile, true).toPromise().then((data) => {
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

      if (!error_api) {
        await this.contractService.getDataNotifyOriganzation().toPromise().then(async (data: any) => {
          this.datas.name_origanzation = data.name;
          // file attach upload
          if (this.datas.attachFileArr != null) {
            for (var i = 0; i < this.datas.attachFileArr.length; i++) {
              if(!this.datas.attachFileArr[i].id) {
                await this.uploadService.uploadFile(this.datas.attachFileArr[i], false).toPromise().then(async (data) => {
                  this.datas.filePathAttach = data.file_object.file_path;
                  this.datas.fileNameAttach = data.file_object.filename;
                  this.datas.fileBucketAttach = data.file_object.bucket;
                  await this.contractService.addDocumentAttach(this.datas).toPromise().then((data) => {
                      this.datas.document_attach_id = data?.id;
                      this.datas.attachFileArr[i].id = data?.id;
                      this.datas.attachFileNameArr[i].id = data?.id
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
                )
              }
            }
            // set data attach file uploaded - create contract
            this.contractService.getFileContract(this.datas.contract_id).subscribe((res:any) => {
              // let attachFilesList: any[] = []
              this.datas.attachFilesList = []
              for (let i = 0; i < res.length; i++){
                // this.datas?.i_data_file_contract?.push(res[i])
                this.attachFilesList.push(res[i])
                this.datas.attachFilesList.push(res[i])
              }
            })
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
    if (this.datas.isDocx) {
      this.getConvertedContractFileUrl()
    }

  }

  async getConvertedContractFileUrl() {
    let contractData = await this.contractService.getFileContract(this.datas.contract_id).toPromise()
    this.datas.convertedContractFileUrl = contractData.filter((item: any) => item.type == 2 && item.status == 1)[0]?.path
  }

  getErrorFile() {
    this.spinner.hide();
    this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
    return false;
  }

  nextStep1: boolean = false;
  // --next step 2
  async next() {
    this.nextStep1 = true;

    if (!this.validData() || !(await this.validateContractNo())) {
      return;
    } else {
      this.spinner.show()
      if(this.datas.isUploadNewFile){
        this.datas.countUploadContractFile ++;
      }
      // this.spinner.show();
      this.datas.name = this.name;
      this.datas.sign_time = this.sign_time;
      this.datas.notes = this.notes;
      this.datas.contract_expire_time = this.expire_time;
      if(this.activeRoute.snapshot.paramMap.get('id'))
      this.datas.original_contract_id = Number(this.activeRoute.snapshot.paramMap.get('id'));

      this.defineData(this.datas);
      this.convertUrltoBlob();
      if((this.router.url.includes("edit") && this.datas.countUploadContractFile > 0) || (this.datas.isUploadNewFile && this.datas.contract_user_sign && this.datas.countUploadContractFile > 1) ){
        this.spinner.hide()
        await this.openDialogClearField();
      }else{
        this.callAPI();
      }

    }
  }

  convertUrltoBlob(){
    const fileReader = new FileReader();
    if (this.datas.is_action_contract_created) {
      // file hợp đồng chính không thay đổi => convert url sang dạng blob
      if (!this.uploadFileContractAgain && this.datas.contractFile && (typeof this.datas.contractFile == 'string')) {
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
  }

  async validateContractNo(){
    this.datas.contract_no = this.contract_no?.trim();

    if (this.datas.contract_no) {
      //check so hop dong da ton tai hay chua
      try {
        let res: any = await this.contractService.checkCodeUnique(this.datas.contract_no?.trim()).toPromise()
        if (res.success) {
          this.spinner.hide();
          return true;
        } else {
          this.toastService.showErrorHTMLWithTimeout('Số hợp đồng đã tồn tại', "", 3000);
          this.spinner.hide();
          return false;
        }
      } catch (error) {
        this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
        this.spinner.hide();
        return false;
      }
    } else {
      return true;
    }
  }

  async openDialogClearField(){
    let sumFields = 0;
    
    if(this.datas.contract_user_sign){
      this.datas.contract_user_sign.forEach((item: any)=>{
        sumFields = sumFields + item.sign_config.length
      })
    }
    

    if((this.datas.isUploadNewFile == true && this.datas.is_data_object_signature) || (this.datas.isUploadNewFile == true && sumFields > 0)){
      const data = {
        title: 'THÔNG BÁO',
        countTextSign: this.datas?.is_data_object_signature?.length > sumFields? this.datas?.is_data_object_signature?.length : sumFields,
        isConfirmDelete: this.datas.isUploadNewFile,
        isPagePdfNew: this.datas.pagePdfFileNew,
        isPagePdfOld: this.datas.pagePdfFileOld,
      };
      
      this.convertUrltoBlob();
      // @ts-ignore
      const dialogRef = this.dialog.open(ConfirmUploadNewFileDialogComponent, {
        width: '720px',
        backdrop: 'static',
        keyboard: false,
        data,
        autoFocus: false,
        disableClose: true,
      })
      dialogRef.afterClosed().subscribe((result: any) => {
        this.isCloseDialog = true;
        this.spinner.show()
        if(result == "ok"){
          this.datas.isDeleteField = true;
        }else{
          this.datas.isDeleteField = false;
          if (this.datas.pagePdfFileNew < this.pagePdfFileOld && this.router.url.includes('edit')) {
            this.getDataObjectSignatureLoadChangeCall()
          }
        }   
        this.callAPI();
      })
    }else{
      this.callAPI();
    }
  }

  convertData(datas: any) {
    //
    if (this.datas.contractConnect != null && this.datas.contractConnect != '') {
      const array_empty: any[] = [];
      this.datas.contractConnect.forEach((element: any, index: number) => {
        const data = element.ref_id;
        array_empty.push(data);
      })
      this.contractConnect = array_empty;
    }
  }

  defineData(datas: any) {
    this.datas.name = this.name;
    this.datas.sign_time = this.sign_time;
    this.datas.expire_time = this.expire_time;

    if (this.datas.contract_no == '') {
      this.datas.contract_no = null;
    }
    if (this.datas.notes == '') {
      this.datas.notes = null;
    }
    this.datas.type_id = this.type_id;

    if (this.contractConnect && this.contractConnect.length && this.contractConnect.length > 0) {
      const array_empty: ContractConnectArr[] = [];
      this.contractConnect.forEach((element: any, index: number) => {
        const data = new ContractConnectArr(element);
        array_empty.push(data);
      })
      this.datas.contractConnect = array_empty;
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
    this.datas.contract_no = this.contract_no?.trim();
    this.datas.sign_time = this.sign_time;
    this.datas.notes = this.notes;

    this.defineData(this.datas);
    const fileReader = new FileReader();
    if (this.datas.is_action_contract_created) {
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
      this.contractService.checkCodeUnique(this.datas.contract_no?.trim()).subscribe(
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
    }

  }

  callAPI_Draft() {
    //call API step 1
    this.contractService.addContractStep1(this.datas).subscribe((data) => {
        //
        this.datas.id = data?.id;
        this.datas.contract_id = data?.id;
        if (this.datas.contractFile) {
          this.uploadService.uploadFile(this.datas.contractFile, true).subscribe((data) => {
              this.datas.filePath = data.file_object.file_path;
              this.datas.fileName = data.file_object.filename;
              this.datas.fileBucket = data.file_object.bucket;
              this.contractService.addDocument(this.datas).subscribe((data) => {
                  //upload file hop dong lan 2
                  this.uploadService.uploadFile(this.datas.contractFile, true).subscribe((data) => {
                      this.datas.filePathDone = data.file_object.file_path;
                      this.datas.fileNameDone = data.file_object.filename;
                      this.datas.fileBucketDone = data.file_object.bucket;

                      this.contractService.addDocumentDone(this.datas).subscribe((data) => {
                          this.datas.document_id = data?.id;

                          if (this.datas.attachFileArr != null) {
                            for (var i = 0; i < this.datas.attachFileArr.length; i++) {

                              this.uploadService.uploadFile(this.datas.attachFileArr[i], false).subscribe((data) => {
                                  this.datas.filePathAttach = data.file_object.file_path;
                                  this.datas.fileNameAttach = data.file_object.filename;
                                  this.datas.fileBucketAttach = data.file_object.bucket;
                                  this.contractService.addDocumentAttach(this.datas).subscribe((data) => {
                                      this.datas.document_attach_id = data?.id;
                                      this.datas.attachFileNameArr[i].id = data?.id
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
                            // set data attach file uploaded - save draft step
                            this.contractService.getFileContract(this.datas.contract_id).subscribe((res:any) => {
                              // let attachFilesList: any[] = []
                              this.datas.attachFilesList = []
                              for (let i = 0; i < res.length; i++){
                                // this.datas?.i_data_file_contract?.push(res[i])
                                this.attachFilesList.push(res[i])
                                this.datas.attachFilesList.push(res[i])
                              }
                            })
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
    //
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
    if (this.contract_no && this.characterCounter(this.contract_no) > 100) {
      this.errorContractNumber = "Số hợp đồng không được vượt quá 100 ký tự";
      return false;
    }
    return true;
  }

  contractTypeValid(){
    if(!this.type_id){
      this.errorContractType = "error.contract-type.required";
      return false;
    }
    return true;
  }

  contractNumberValid() {
    return this.contractNumberCounter();
  }

  contractCeCaValid() {
    if(this.ceca && this.optionsCeCaValue == null) {
      this.errorCeCa = "error.ceca.required";
      return false;
    }

    return true;
  }

  contractNameRequired() {
    this.errorContractName = "";
    if (!this.name) {
      this.errorContractName = "error.contract.name.required";
      return false;
    }

    if(!parttern_input.contract_name_valid.test(this.name)) {
      this.errorContractName = "error.contract.name.valid";
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
      let data = this.datas?.i_data_file_contract?.filter((p: any) => p.id == item.id)[0] || this.datas.attachFilesList?.filter((p: any) => p.id == item.id)[0]
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
  }

  changeInput(e: any): void {
    // e.target.value = this.convertCurrency(e.target.value);
    // this.contract_no = e.target.value;
  }

  reverseInput(e: any): void {
    // e.target.value = this.removePeriodsFromCurrencyValue(e.target.value);
  }

  getDataObjectSignatureLoadChangeCall() {
    this.datas.storedFields = []
    this.contractService.getDataObjectSignatureLoadChange(this.contractId).subscribe(
      (res: any) => {
        if (res.length > 0) {
          res.forEach((item: any) => {
            if (item.page > this.datas.pagePdfFileNew) {
              this.datas.storedFields.push(item)
            }
          })
        }
      }
    )
  }
}
