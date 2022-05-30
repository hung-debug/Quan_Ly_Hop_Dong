import {UploadService} from "../../../../../../../service/upload.service";
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { NgbCalendar, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {variable} from "../../../../../../../config/variable";
import { Observable } from 'rxjs';
import {AddContractComponent} from "../../../add-contract/add-contract.component";
import { DatepickerOptions } from 'ng2-datepicker';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { ContractService } from 'src/app/service/contract.service';
import { DatePipe } from '@angular/common';
import {Router} from "@angular/router";

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

  id:any;
  name:any = '';
  code:any;
  type_id:any;
  attachFile:any;
  contractConnect:any;
  sign_time:any;
  notes:any;

  //error
  errorContractName:any = '';
  errorContractFile:any = '';
  infor_contract: any;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService : UploadService,
    private contractService: ContractService,
    public datepipe: DatePipe,
    private router: Router,
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

    this.name = this.datas.infor_contract.name ? this.datas.infor_contract.name : '';
    this.code = this.datas.infor_contract.code ? this.datas.infor_contract.code : '';
    this.type_id = this.datas.infor_contract.type_id ? this.datas.infor_contract.type_id : '';
    this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : '';
    this.sign_time = this.datas.sign_time ? this.datas.sign_time : new Date();
    this.notes = this.datas.infor_contract.notes ? this.datas.infor_contract.notes : '';

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
    if (!this.name) {
      this.errorContractName = 'Tên hợp đồng không được để trống!';
      return false;
    }
    if (!this.datas.contractFile) {
      this.errorContractFile = 'File hợp đồng không được để trống!';
      return false;
    }

    return true
  }

  clearError(){
    if (this.name) {
      this.errorContractName = '';
    }
    if (this.datas.contractFile) {
      this.errorContractFile = '';
    }
  }

  // --next step 2
  next() {
    this.step = variable.stepSampleContract.step2;
    this.datas.stepLast = this.step
    this.nextOrPreviousStep(this.step);

  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }

  changeAddContract(link:any){
    console.log(link);
    this.router.navigate([link]);
  }


}
