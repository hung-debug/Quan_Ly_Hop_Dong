import {ContractService} from 'src/app/service/contract.service';
import {UploadService} from './../../../../../service/upload.service';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {variable} from "../../../../../config/variable";
import {Observable} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ToastService} from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from "moment";
import { AddContractTemplateComponent } from '../../../add-contract-template/add-contract-template.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit, AfterViewInit {
  @Input() AddComponent: AddContractTemplateComponent | unknown;
  @Input() datas: any;
  @Input() step: any;

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
  filePath: any;
  start_time: any;
  end_time: any;

  minDate: Date = moment().toDate();

  attachFileArr:any[] = [];
  attachFileNameArr:any[] = [];

  //error
  errorContractName: any = '';
  errorContractFile: any = '';
  errorContractNumber:any = '';
  errorStartTime:any='';
  errorEndTime:any='';

  uploadFileContractAgain: boolean = false;
  uploadFileAttachAgain: boolean = false;

  constructor(
    private uploadService: UploadService,
    private contractService: ContractService,
    public datepipe: DatePipe,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    this.step = variable.stepSampleContract.step1;
  }

  ngOnInit(): void {
    this.name = this.datas.name ? this.datas.name : null;
    this.code = this.datas.code ? this.datas.code : null;
    this.type_id = this.datas.type_id ? this.datas.type_id : null;
    this.start_time = this.datas.start_time ? moment(this.datas.start_time).toDate() : '';
    this.end_time = this.datas.end_time ? moment(this.datas.end_time).toDate() : '';

    this.contractService.getContractTypeList().subscribe(data => {
      // console.log(data);
      this.typeList = data
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameContract.nativeElement.focus();
    }, 0)
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        console.log(e.target.files[0].size);
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        if (extension.toLowerCase() == 'pdf') {
          const fileInput: any = document.getElementById('file-input');
          fileInput.value = '';
          this.datas.file_name = file_name;
          this.datas.contractFile = file;
          this.contractFileValid();
          if (this.datas.is_action_contract_created) {
            this.uploadFileContractAgain = true;
          }
        } else if (extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'docx') {
          this.toastService.showErrorHTMLWithTimeout("File hợp đồng chưa hỗ trợ định dạng DOC, DOCX", "", 3000);
        } else {
          this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu định dạng PDF", "", 3000);
        }
      } else {
        this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu nhỏ hơn 5MB", "", 3000);
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
        if (file.size <= 5000000) {
          const file_name = file.name;
          if(this.attachFileNameArr.filter((p:any) => p == file_name).length == 0){
            const extension = file.name.split('.').pop();
            this.attachFileArr.push(file);
            this.datas.attachFileArr = this.attachFileArr;
            this.attachFileNameArr.push(file.name);
            this.datas.attachFileNameArr = this.attachFileNameArr;
            if (this.datas.is_action_contract_created) {
              this.uploadFileAttachAgain = true;
            }
          }
          // else{
          //   this.toastService.showErrorHTMLWithTimeout("Trùng file đính kèm", "", 3000);
          // }
          
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 5MB", "", 3000);
          break;
        }
      }
    }
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
    if(!this.contractNameValid() || !this.contractFileValid() 
      || !this.contractNumberValid() || !this.startTimeRequired() || !this.endTimeValid()){
      this.spinner.hide();
      return false;
    }
    return true
  }

  async callAPI() {
    //call API step 1
    let countSuccess = 0;
    if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
      await this.contractService.addContractStep1(this.datas, this.datas.contract_id_action).toPromise().then((res: any) => {
        this.datas.id = res?.id;
        this.datas.contract_id = res?.id;
      }, (error: HttpErrorResponse) => {
        countSuccess++;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
      })

      if (countSuccess == 0) {
        await this.uploadService.uploadFile(this.datas.contractFile, 'editContract').toPromise().then((data: any) => {
          this.datas.filePath = data.file_object.file_path;
          this.datas.fileName = data.file_object.filename;
          this.datas.fileBucket = data.file_object.bucket;
        }, (error: HttpErrorResponse) => {
          countSuccess++;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        await this.contractService.addDocument(this.datas).toPromise().then((respon: any) => {
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        await this.contractService.getDataNotifyOriganzation().toPromise().then((res: any) => {
          this.datas.name_origanzation = res.name;
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
                  }
                );
              },
                error => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
                }
              );
            }
            this.step = variable.stepSampleContract.step2;
            this.datas.stepLast = this.step;
            this.nextOrPreviousStep(this.step);
            this.spinner.hide();
          } else {

            //next step
            this.step = variable.stepSampleContract.step2;
            this.datas.stepLast = this.step;
            // this.datas.document_id = '1';
            this.nextOrPreviousStep(this.step);
            console.log(this.datas);
            this.spinner.hide();
          }
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
        })
      }

    } else {

      //day thong tin
      await this.contractService.addContractStep1(this.datas).toPromise().then((res: any) => {
        this.datas.id = res?.id;
        this.datas.contract_id = res?.id;
      }, (error: HttpErrorResponse) => {
        countSuccess++;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
      })

      if (countSuccess == 0) {
        //day file
        await this.uploadService.uploadFile(this.datas.contractFile).toPromise().then((data: any) => {
          this.datas.filePath = data.file_object.file_path;
          this.datas.fileName = data.file_object.filename;
          this.datas.fileBucket = data.file_object.bucket;
        }, (error: HttpErrorResponse) => {
          countSuccess++;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        //xac dinh moi quan he file va hop dong
        await this.contractService.addDocument(this.datas).toPromise().then((respon: any) => {
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
      
        //neu co file dinh kem
        if (this.datas.attachFileArr != null) {
          for (var i = 0; i < this.datas.attachFileArr.length; i++) {
            //day file
            await this.uploadService.uploadFile(this.datas.attachFileArr[i]).toPromise().then((data) => {
              this.datas.filePathAttach = data.file_object.file_path;
              this.datas.fileNameAttach = data.file_object.filename;
              this.datas.fileBucketAttach = data.file_object.bucket;
              
            },
              error => {
                countSuccess++
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
              }
            );

            if (countSuccess == 0) {
              //xac dinh moi quan he file id va hop dong
              await this.contractService.addDocumentAttach(this.datas).toPromise().then((data) => {
                this.datas.document_attach_id = data?.id;
              },
                error => {
                  countSuccess++
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.attach.error", "", 3000);
                }
              );
            }
          }
        } 
        this.step = variable.stepSampleContract.step2;
        this.datas.stepLast = this.step;
        this.nextOrPreviousStep(this.step);
        this.spinner.hide();
      }
    }
  }

  // --next step 2
  async next() {
    this.spinner.show();
    if (!this.validData()) {
      return;
    } 
    // else {
    //   // set value to datas
    //   this.datas.name = this.name;
    //   this.datas.code = this.code;
    //   this.defineData(this.datas);
    //   const fileReader = new FileReader();
    //   if (this.datas.is_action_contract_created) {
    //     if (!this.uploadFileContractAgain && this.datas.contractFile) {
    //       await this.contractService.getDataBinaryFileUrlConvert(this.datas.contractFile).toPromise().then((res: any) => {
    //         if (res)
    //           this.datas.contractFile = res;
    //       })
    //     } else if (this.uploadFileContractAgain && this.datas.contractFile) {
    //         fileReader.readAsDataURL(this.datas.contractFile);
    //         fileReader.onload = (e) => {
    //           if (fileReader.result)
    //             this.datas.file_content = fileReader.result.toString().split(',')[1];
    //             this.datas.uploadFileContractAgain = true;
    //         };
    //     }
    //     if (!this.uploadFileAttachAgain && this.datas.attachFile) {
    //       await this.contractService.getDataBinaryFileUrlConvert(this.datas.attachFile).toPromise().then((data: any) => {
    //         if (data)
    //           this.datas.attachFile = data;
    //       })
    //     }
    //   } else {
    //     fileReader.readAsDataURL(this.datas.contractFile);
    //     fileReader.onload = (e) => {
    //       if (fileReader.result)
    //         this.datas.file_content = fileReader.result.toString().split(',')[1];
    //     };
    //   }
    //   if(this.datas.code != null && this.datas.code != ''){
    //     //check so hop dong da ton tai hay chua
    //     this.contractService.checkCodeUnique(this.datas.code).subscribe(
    //       dataCode => {
    //         if(dataCode.success){
    //           this.callAPI();
    //         }else{
    //           this.toastService.showErrorHTMLWithTimeout('Số hợp đồng đã tồn tại', "", 3000);
    //           this.spinner.hide();
    //         }
    //       }, error => {
    //         this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
    //         this.spinner.hide();
    //       }
    //     )
    //   }else{
    //     await this.callAPI();
    //   }
      
    else {
      // set value to datas
      this.datas.name = this.name;
      this.datas.code = this.code;
      this.defineData(this.datas);
      const fileReader = new FileReader();
      if (this.datas.is_action_contract_created) {
        if (!this.uploadFileContractAgain && this.datas.contractFile) {
          await this.contractService.getDataBinaryFileUrlConvert(this.datas.contractFile).toPromise().then((res: any) => {
            if (res)
              this.datas.contractFile = res;
          })
        } else if (this.uploadFileContractAgain && this.datas.contractFile) {
            fileReader.readAsDataURL(this.datas.contractFile);
            fileReader.onload = (e) => {
              if (fileReader.result)
                this.datas.file_content = fileReader.result.toString().split(',')[1];
                this.datas.uploadFileContractAgain = true;
            };
        }
        if (!this.uploadFileAttachAgain && this.datas.attachFile) {
          await this.contractService.getDataBinaryFileUrlConvert(this.datas.attachFile).toPromise().then((data: any) => {
            if (data)
              this.datas.attachFile = data;
          })
        }
      } else {
        fileReader.readAsDataURL(this.datas.contractFile);
        fileReader.onload = (e) => {
          if (fileReader.result)
            this.datas.file_content = fileReader.result.toString().split(',')[1];
        };
      }
      this.step = variable.stepSampleContract.step2;
      this.datas.stepLast = this.step;
      // this.datas.document_id = '1';
      this.nextOrPreviousStep(this.step);
      console.log(this.datas);
      this.spinner.hide();
      
    }
  }

  defineData(datas: any) {
    this.datas.name = this.name;
    if (this.datas.code == '') {
      this.datas.code = null;
    }
    if (this.datas.notes == '') {
      this.datas.notes = null;
    }
    this.datas.type_id = this.type_id;
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }

  characterCounter(str:any) {
    var character = str.length;
    return character;
  }

  contractNameValid(){
    if(this.contractNameRequired()){
      return this.contractNameCounter();
    }
    return this.contractNameRequired();
  }

  contractNameRequired(){
    this.errorContractName = "";
    if(!this.name){
      this.errorContractName = "error.contract-template.name.required";
      return false;
    }
    return true;
  }

  contractNameCounter(){
    if(this.characterCounter(this.name) > 200){
      this.errorContractName = "Tên mẫu hợp đồng không được vượt quá 200 ký tự";
      return false;
    }
    return true;
  }

  contractFileValid(){
    return this.contractFileRequired();
  }

  contractFileRequired(){
    this.errorContractFile = "";
    if(!this.datas.contractFile){
      this.errorContractFile = "error.contract.file.required";
      return false;
    }
    return true;
  }

  contractNumberValid(){
    if(this.contractNumberRequired()){
      return this.contractNumberCounter();
    }
    return this.contractNumberRequired();
  }

  contractNumberRequired(){
    this.errorContractNumber = "";
    if(!this.code){
      this.errorContractNumber = "error.contract-template.code.required";
      return false;
    }
    return true;
  }

  contractNumberCounter(){
    if(this.characterCounter(this.code) > 32){
      this.errorContractNumber = "Mã mẫu hợp đồng không được vượt quá 32 ký tự";
      return false;
    }
    return true;
  }

  startTimeRequired(){
    this.errorStartTime = "";
    if(!this.start_time){
      this.errorStartTime = "error.contract-template.effective-start-date";
      return false;
    }
    return true;
  }

  endTimeValid(){
    if(this.endTimeRequired()){
      return this.endTimeCompare();
    }
    return this.endTimeRequired();
  }

  endTimeRequired(){
    this.errorEndTime = "";
    if(!this.end_time){
      this.errorEndTime = "error.contract-template.effective-end-date";
      return false;
    }
    return true;
  }

  endTimeCompare(){
    if(this.start_time && this.end_time && new Date(this.start_time) > new Date(this.end_time)){
      this.errorEndTime = "error.contract-template.effective-end-date.compare";
      return false;
    }
    return true;
  }

  deleteFileAttach(item:any){
    this.attachFileNameArr.forEach((element,index)=>{
      if(element==item) this.attachFileNameArr.splice(index,1);
    });
    this.datas.attachFileNameArr = this.attachFileNameArr;
    this.attachFileArr.forEach((element,index)=>{
      if(element.name==item) this.attachFileArr.splice(index,1);
    });
    this.datas.attachFileArr = this.attachFileArr;
  }

}
