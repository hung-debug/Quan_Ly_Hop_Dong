import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { NgbCalendar, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/service/upload.service';
import {variable} from "../../../../../config/variable";
import { Observable } from 'rxjs';



@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  personalDetails!: FormGroup;
  personal_step = false;

  dateDeadline = new FormControl(new Date());

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

  get personal() { return this.personalDetails.controls; }
  constructor(
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService
  ) {
    this.step = variable.stepSampleContract.step1
  }

  ngOnInit(): void {
    //upload file
    this.fileInfos = this.uploadService.getFiles();
    //upload file attach
    this.fileInfosAttach = this.uploadService.getFiles();

    this.personalDetails = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['',Validators.required],
      type: ['', Validators.required],
      contractName: ['', Validators.required],
      contractNumber: ['', Validators.required],
      contractType: ['', Validators.required],
      contractFile: ['', Validators.required],
      attachFile: ['', Validators.required],
      contractConnect: ['', Validators.required],
      dateDeadline: ['', Validators.required],
      comment: ['', Validators.required],
    });


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

  onItemSelect(item: any) {
    let contractType = this.personalDetails.controls['contractType'].value;
    let conn = '';
    if(contractType != ''){
      conn = ',';
    }
    this.personalDetails.controls['contractType'].setValue(contractType + conn + item.item_text);
  }

  //upload file
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Tải file lên thành công: ' + file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Không thể tải được file: ' + file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        });
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  //upload file attach
  selectFilesAttach(event: any): void {
    this.messageAttach = [];
    this.progressInfosAttach = [];
    this.selectedFilesAttach = event.target.files;
  }

  uploadAttach(idx: number, file: File): void {
    this.progressInfosAttach[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfosAttach[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Tải file lên thành công: ' + file.name;
            this.messageAttach.push(msg);
            this.fileInfosAttach = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfosAttach[idx].value = 0;
          const msg = 'Không thể tải được file: ' + file.name;
          this.messageAttach.push(msg);
          this.fileInfosAttach = this.uploadService.getFiles();
        });
    }
  }

  uploadFilesAttach(): void {
    this.messageAttach = [];

    if (this.selectedFilesAttach) {
      for (let i = 0; i < this.selectedFilesAttach.length; i++) {
        this.uploadAttach(i, this.selectedFilesAttach[i]);
      }
    }
  }


}
