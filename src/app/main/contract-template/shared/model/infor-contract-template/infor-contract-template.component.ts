import { AddContractTemplateComponent } from './../../../add-contract-template/add-contract-template.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { UploadService } from 'src/app/service/upload.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import {variable} from "../../../../../config/variable";
import { DatepickerOptions } from 'ng2-datepicker';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
@Component({
  selector: 'app-infor-contract-template',
  templateUrl: './infor-contract-template.component.html',
  styleUrls: ['./infor-contract-template.component.scss']
})
export class InforContractTemplateComponent implements OnInit {

  @Input() AddComponent: AddContractTemplateComponent | unknown;
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

  contractName:any = '';
  contractNumber:any;
  contractType:any;
  attachFile:any;
  contractConnect:any;
  dateDeadline:any;
  comment:any;

  //error
  errorContractName:any = '';
  errorContractFile:any = '';

  constructor(
    private formBuilder: FormBuilder,
    private uploadService : UploadService,
    private contractTemplateService: ContractTemplateService,
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

    this.contractName = this.datas.contractName ? this.datas.contractName : '';
    this.contractNumber = this.datas.contractNumber ? this.datas.contractNumber : '';
    this.contractType = this.datas.contractType ? this.datas.contractType : '';
    this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : '';
    this.dateDeadline = this.datas.dateDeadline ? this.datas.dateDeadline : new Date();
    this.comment = this.datas.comment ? this.datas.comment : '';

    this.contractTypeList = [
      {
        item_id: 1,
        item_text: "Loại hợp đồng A",
      },
      {
        item_id: 2,
        item_text: "Loại hợp đồng B",
      }
    ];

    this.contractConnectList = [
      {
        item_id: 1,
        item_text: "Hợp đồng A",
      },
      {
        item_id: 2,
        item_text: "Hợp đồng B",
      }
    ];

    this.dropdownTypeSettings = {
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };

    this.dropdownConnectSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
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

        } else {
          alert('Chỉ hỗ trợ file có định dạng PDF')
        }
      } else {
        alert('Yêu cầu file nhỏ hơn 5MB');
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
    for(let i = 0; i < files.length; i++){

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
          alert('Yêu cầu file nhỏ hơn 5MB');
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
    if (!this.contractName) {
      this.errorContractName = 'Tên mẫu hợp đồng không được để trống!';
      return false;
    }
    if (!this.datas.contractFile) {
      this.errorContractFile = 'File mẫu hợp đồng không được để trống!';
      return false;
    }

    return true
  }

  clearError(){
    if (this.contractName) {
      this.errorContractName = '';
    }
    if (this.datas.contractFile) {
      this.errorContractFile = '';
    }
  }

  // --next step 2
  next() {
    if (!this.validData()) return;
    else {
      // gán value step 1 vào datas
      this.datas.contractName = this.contractName;
      this.datas.contractNumber = this.contractNumber;
      this.datas.contractType = this.contractType;
      this.datas.contractConnect = this.contractConnect;
      this.datas.dateDeadline = this.dateDeadline;
      this.datas.comment = this.comment;


      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.datas.contractFile);
      fileReader.onload = (e) => {
        //@ts-ignore
        const base64result = fileReader.result.toString().split(',')[1];
        this.datas.file_content = base64result;
      };

      this.step = variable.stepSampleContract.step2;
      this.datas.stepLast = this.step
      this.nextOrPreviousStep(this.step);
      console.log(this.datas);

      // //call API upload file
      // this.uploadService.uploadFile(this.datas.contractFile).subscribe((data) => {
      //   console.log(data);
      // },
      // error => {
      // }
      // );

      // //call API step 1
      // this.contractService.addContractStep1(this.datas).subscribe((data) => {
      //   console.log(data);
      // },
      // error => {
      // }
      // );

    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }
}
