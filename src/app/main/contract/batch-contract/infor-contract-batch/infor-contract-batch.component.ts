import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { UploadService } from 'src/app/service/upload.service';
import { ContractService } from 'src/app/service/contract.service';
import { DatePipe } from '@angular/common';
import { DatepickerOptions } from 'ng2-datepicker';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import {variable} from "../../../../config/variable";
import { Router } from '@angular/router';
import { AddContractComponent } from '../../add-contract/add-contract.component';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/service/toast.service';
@Component({
  selector: 'app-infor-contract-batch',
  templateUrl: './infor-contract-batch.component.html',
  styleUrls: ['./infor-contract-batch.component.scss']
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

  id:any;
  name:any = '';
  code:any;
  type_id:any;
  attachFile:any;
  contractConnect:any;
  sign_time:any;
  notes:any;
  file_name:any;

  //error
  errorContractName:any = '';
  errorContractFile:any = '';

  idContractTemplate:any;
  filePathExample:any='';

  constructor(
    private formBuilder: FormBuilder,
    private uploadService : UploadService,
    private contractService: ContractService,
    private contractTemplateService: ContractTemplateService,
    public datepipe: DatePipe,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
  ) {
    this.step = variable.stepSampleContractBatch.step1;
  }

  getContractTemplateForm() {
    this.contractTemplateService.getContractTemplateList('off', '', '', 0, 0).subscribe(response => {
        // console.log(response);
        this.typeListForm = response.entities;
    })
  }

  ngOnInit(): void {

    this.getContractTemplateForm();

    this.name = this.datasBatch.name ? this.datasBatch.name : '';
    this.notes = this.datasBatch.notes ? this.datasBatch.notes : '';

  }

  OnChangeForm(e: any) {    
    this.idContractTemplate = e.value;
  }
  downFileExample(){
    this.spinner.show();
    this.contractService.getFileContractBatch(this.idContractTemplate).subscribe((res: any) => {
      console.log(res);
      this.uploadService.downloadFile(res.path).subscribe((response: any) => {
        //console.log(response);
    
        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "Example";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    
        this.toastService.showSuccessHTMLWithTimeout("Tải file tài liệu mẫu thành công", "", 3000);
        this.spinner.hide();
      }), 
      (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 3000);
  
    }, (error) => {
        console.log(error);
        this.spinner.hide();
    }, () => {
        this.spinner.hide();
    });
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (extension.toLowerCase() == 'xls' || extension.toLowerCase() == 'xlsx') {
          const fileInput: any = document.getElementById('file-input');
          fileInput.value = '';
          this.datasBatch.file_name = file_name;
          this.datasBatch.contractFile = file;
        } else {
          this.toastService.showErrorHTMLWithTimeout("Chỉ hỗ trợ file có định dạng XLS, XLSX", "", 3000);
        }
      } else {
        this.toastService.showErrorHTMLWithTimeout("Yêu cầu file nhỏ hơn 5MB", "", 3000);
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
    if (!this.name) {
      this.errorContractName = 'Tên mẫu hợp đồng không được để trống!';
      return false;
    }
    if (!this.datasBatch.contractFile) {
      this.errorContractFile = 'File tài liệu không được để trống!';
      return false;
    }

    return true
  }

  clearError(){
    if (this.name) {
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
      // gán value step 1 vào datasBatch
      this.datasBatch.name = this.name;
      this.datasBatch.code = this.code;
      this.datasBatch.type_id = this.type_id;
      this.datasBatch.contractConnect = this.contractConnect;
      this.datasBatch.sign_time = this.sign_time;
      this.datasBatch.notes = this.notes;

      this.contractService.uploadFileContractBatch(this.datasBatch.contractFile, this.idContractTemplate).subscribe((response: any) => {
        console.log(response);
        if(response.success){
          //next step
          this.step = variable.stepSampleContractBatch.step2;
          this.datasBatch.stepLast = this.step
          this.nextOrPreviousStep(this.step);
          console.log(this.datasBatch);
        }else{
          this.toastService.showErrorHTMLWithTimeout("File mẫu không hợp lệ", "", 3000);
        }
      }), (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 3000);

      
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datasBatch.documents.document.step = step;
    this.datasBatch.stepLast = step;
    this.stepChangeInfoContractBatch.emit(step);
  }
}
