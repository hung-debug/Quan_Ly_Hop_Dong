import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { NgbCalendar, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/service/upload.service';
import {variable} from "../../../../../config/variable";
import { Observable } from 'rxjs';
import {AddContractComponent} from "../../../add-contract/add-contract.component";

@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit {
  @Input() AddComponent: AddContractComponent | unknown;
  @Input() datas: any;
  @Input() step: any;
  inforDetails!: FormGroup;
  @Output() stepChangeInfoContract = new EventEmitter<string>();

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

  get inforContract() { return this.inforDetails.controls; }
  constructor(
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService
  ) {
    this.step = variable.stepSampleContract.step1
    //this.datas.inforDetails = this.inforDetails;
  }

  ngOnInit(): void {
    // this.datas.inforDetails = this.inforDetails;
    this.inforDetails = this.formBuilder.group({
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

    // if (this.datas.inforDetails) {
    //   this.inforDetails.value = this.datas.inforDetails.value;
    // }

    console.log(this.inforDetails.value);


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
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = (e) => {
            //@ts-ignore
            const base64result = fileReader.result.toString().split(',')[1];
            const fileInput: any = document.getElementById('file-input');
            fileInput.value = '';
            this.datas.file_content = base64result;
            this.datas.file_name = file_name;
            // this.datas.documents['file_content_docx'] = null;
            // this.pdfSrc = Helper._getUrlPdf(base64result);
          };
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
    let contractType = this.inforDetails.controls['contractType'].value;
    let conn = '';
    if(contractType != ''){
      conn = ',';
    }
    this.inforDetails.controls['contractType'].setValue(contractType + conn + item.item_text);
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
      // this.uploadService.upload(file).subscribe(
      //   (event: any) => {
      //     if (event.type === HttpEventType.UploadProgress) {
      //       this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
      //     } else if (event instanceof HttpResponse) {
      //       const msg = 'Tải file lên thành công: ' + file.name;
      //       this.message.push(msg);
      //       this.fileInfos = this.uploadService.getFiles();
      //     }
      //   },
      //   (err: any) => {
      //     this.progressInfos[idx].value = 0;
      //     const msg = 'Không thể tải được file: ' + file.name;
      //     this.message.push(msg);
      //     this.fileInfos = this.uploadService.getFiles();
      //   });
      const msg = 'Tải file lên thành công: ' + file.name;
      this.message.push(msg);
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

  //--valid data step 1
  validData() {
    if (!this.datas.file_content) {
      alert('Vui lòng chọn file hợp đồng!');
      return false;
    }
    // this.datas.inforDetails
    if (this.inforDetails.invalid) {
      console.log(this.datas);
      // alert('Vui Lòng nhập đầy đủ thông tin')

    }
    return true
  }

  // --next step 2
  next() {
    if (!this.validData()) return;
    else {
      // gán value step 1 vào datas
      this.datas.infoContract = this.inforDetails.value;
      this.step = variable.stepSampleContract.step2;
      this.datas.stepLast = this.step
      this.nextOrPreviousStep(this.step);
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChangeInfoContract.emit(step);
  }


}
