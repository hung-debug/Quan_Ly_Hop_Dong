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

  constructor(
    private formBuilder: FormBuilder,
    private uploadService : UploadService,
    private contractService: ContractService,
    public datepipe: DatePipe,
    private router: Router,
  ) {
    this.step = variable.stepSampleContractBatch.step1;
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

    this.name = this.datasBatch.name ? this.datasBatch.name : '';
    this.code = this.datasBatch.code ? this.datasBatch.code : '';
    this.type_id = this.datasBatch.type_id ? this.datasBatch.type_id : '';
    this.contractConnect = this.datasBatch.contractConnect ? this.datasBatch.contractConnect : '';
    this.sign_time = this.datasBatch.sign_time ? this.datasBatch.sign_time : new Date();
    this.notes = this.datasBatch.notes ? this.datasBatch.notes : '';

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
        if (extension.toLowerCase() == 'xls' || extension.toLowerCase() == 'xlsx') {
          const fileInput: any = document.getElementById('file-input');
          fileInput.value = '';
          this.datasBatch.file_name = file_name;
          this.datasBatch.contractFile = file;
        } else {
          alert('Chỉ hỗ trợ file có định dạng XLS, XLSX')
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
          this.datasBatch.file_name_attach = file_name;
          //this.datasBatch.file_name_attach = this.datasBatch.file_name_attach + "," + file_name;
          this.datasBatch.attachFile = file;
          //this.datasBatch.attachFile = e.target.files;
        } else {
          this.datasBatch.file_name_attach = '';
          this.datasBatch.attachFile = '';
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
    // this.clearError();
    // if (!this.name) {
    //   this.errorContractName = 'Tên hợp đồng không được để trống!';
    //   return false;
    // }
    // if (!this.datasBatch.contractFile) {
    //   this.errorContractFile = 'File hợp đồng không được để trống!';
    //   return false;
    // }

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

  callAPI() {
    //call API step 1
    // this.contractService.addContractStep1(this.datasBatch).subscribe((data) => {
    //   this.datasBatch.id = data?.id;
    //   console.log(data);

    //   //call API upload file
    //   this.uploadService.uploadFile(this.datasBatch).subscribe((data) => {
    //     console.log("File" + data);

        //next step
        this.step = variable.stepSampleContractBatch.step2;
        this.datasBatch.stepLast = this.step
        this.nextOrPreviousStep(this.step);
        console.log(this.datasBatch);
    //   },
    //   error => {
    //     console.log("false file");
    //     return false;
    //   }
    //   );

    // },
    // error => {
    //   console.log("false content");
    //   return false;
    // }
    // );

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

      // const fileReader = new FileReader();
      // fileReader.readAsDataURL(this.datasBatch.contractFile);
      // fileReader.onload = (e) => {
      //   //@ts-ignore
      //   const base64result = fileReader.result.toString().split(',')[1];
      //   this.datasBatch.file_content = base64result;
      // };

      this.callAPI();
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datasBatch.documents.document.step = step;
    this.datasBatch.stepLast = step;
    this.stepChangeInfoContractBatch.emit(step);
  }


  changeAddContract(link:any){
    console.log(link);
    this.router.navigate([link]);
  }
}
