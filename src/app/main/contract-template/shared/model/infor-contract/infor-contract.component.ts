import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { UploadService } from './../../../../../service/upload.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { variable } from "../../../../../config/variable";
import { Observable, Subscription } from 'rxjs';
import { AddContractTemplateComponent } from '../../../add-contract-template/add-contract-template.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from "moment";
import { HttpErrorResponse } from '@angular/common/http';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';
import { parttern, parttern_input } from 'src/app/config/parttern';
import { CheckSignDigitalService } from 'src/app/service/check-sign-digital.service';
import Swal from 'sweetalert2';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';
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
  @Input() AddComponent: AddContractTemplateComponent | unknown;
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
  start_time: any;
  end_time: any;
  start_time_old: any;
  end_time_old: any;

  attachFileArr: any[] = [];
  attachFileNameArr: any[] = [];
  contract_no: any;
  contract_no_old: any;

  //error
  errorContractName: any = '';
  errorContractFile: any = '';
  errorSignTime: any = '';
  errorContractNumber: any = '';
  errorStartTime:any='';
  errorEndTime:any='';

  uploadFileContractAgain: boolean = false;
  uploadFileAttachAgain: boolean = false;
  isFileAttachUploadNewEdit: any;
  checkView: boolean = false;

  public subscription: Subscription;

  minDate: Date = moment().toDate();
  public messageForSibling: string;

  constructor(
    private uploadService: UploadService,
    private contractTemplateService: ContractTemplateService,
    private contractTypeService: ContractTypeService,
    public datepipe: DatePipe,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private unitService: UnitService,
    private checkSignDigitalService: CheckSignDigitalService,
    private checkViewContractService: CheckViewContractService,
    private activeRoute: ActivatedRoute,

  ) {
    this.step = variable.stepSampleContract.step1;
  }

  async ngOnInit(): Promise<void> {
    this.spinner.hide();

    let idContract = Number(this.activeRoute.snapshot.paramMap.get('id'));

    this.checkView = await this.checkViewContractService.callAPIcheckViewContract(idContract, true);

    if(!idContract || this.checkView) {
      this.actionSuccess();
    } else {
      this.router.navigate(['/page-not-found']);
    }
  }

  actionSuccess() {
       //check mẫu đã được sử dụng hay chưa
       this.checkTemplateIsUse();

       this.name = this.datas.name ? this.datas.name : null;
       this.contract_no = this.datas.contract_no ? this.datas.contract_no : this.datas.code;
       this.type_id = this.datas.type_id ? this.datas.type_id : null;
       this.contractConnect = this.datas.contractConnect ? this.datas.contractConnect : null;

      this.start_time = this.datas.start_time ? moment(this.datas.start_time).toDate() : '';

      this.end_time = this.datas.end_time ? moment(this.datas.end_time).toDate() : '';
       
       this.notes = this.datas.notes ? this.datas.notes : null;
       if (this.datas.file_name_attach) {
         this.datas.attachFileNameArr = this.datas.file_name_attach;
       }
       this.convertData(this.datas);
   
       this.contractTypeService.getContractTypeList('', '').subscribe(data => {
         this.typeList = data
       } );
   
       this.contract_no_old = this.contract_no;
       this.start_time_old = this.start_time;
       this.end_time_old = this.end_time;
  }

  templateIsUse: boolean = false;
  checkTemplateIsUse() {
    if(this.router.url.includes("edit") && this.datas.id) {
      this.contractTemplateService.checkTemplateIsUse(this.datas.id).subscribe((response) => {
        if(!response.success) {
          this.templateIsUse = false;
        } else if(response.success) {
          this.templateIsUse = true;
        }
      })
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameContract.nativeElement.focus();
    }, 0)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'infor-contract') {
    }
  }

  fileChanged(e: any) {
    this.spinner.show();
    const file = e.target.files[0];
    if (file) {
      // giới hạn file upload lên là 5mb
      if (e.target.files[0].size <= 5000000) {
        console.log(e.target.files[0].size);
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (extension && extension.toLowerCase() == 'pdf') {
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
                html: "File hợp đồng đã chứa chữ ký số; chỉ có thể ký bằng hình thức ký số với hợp đồng này",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#b0bec5',
                confirmButtonText: 'Xác nhận'
              });

              const fileInput: any = document.getElementById('file-input');
              fileInput.value = '';
              this.datas.file_name = file_name;
              this.datas.contractFile = file;
              this.contractFileRequired();
              if (this.datas.is_action_contract_created) {
                this.uploadFileContractAgain = true;
              }
              this.datas.flagDigitalSign = true;
            }
          })
        } else if (extension && (extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'docx')) {
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
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (file.size <= 5000000) {
          const file_name = file.name;
          if (this.attachFileNameArr.filter((p: any) => p.filename == file_name).length == 0) {
            const extension = file.name.split('.').pop();
            //this.datas.file_name_attach = file_name;
            //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
            this.attachFileArr.push(file);
            this.datas.attachFileArr = this.attachFileArr;
            this.attachFileNameArr.push({ filename: file.name });
            if (!this.datas.attachFileNameArr || this.datas.attachFileNameArr.length && this.datas.attachFileNameArr.length == 0) {
              this.datas.attachFileNameArr = [];
            }
            this.datas.attachFileNameArr.push({ filename: file.name })
            // Array.prototype.push.apply(this.datas.attachFileNameArr, this.attachFileNameArr);

            if (this.datas.is_action_contract_created) {
              this.uploadFileAttachAgain = true;
            }
            //this.datas.attachFile = e.target.files;
          }
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          this.toastService.showErrorHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 5MB", "", 3000);
          break;
        }
      }
    }
  }

  onChange(e: any) {
    console.log(e, this.contractConnect)
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
    this.contractNameValid();
    this.contractFileValid();
    this.contractNumberValid();
    this.startTimeRequired();
    this.endTimeValid();
    if(!this.contractNameValid() || !this.contractFileValid() 
      || !this.contractNumberValid() || !this.startTimeRequired() || !this.endTimeValid()){
      //this.spinner.hide();
      return false;
    }
    return true
  }

  async callAPI(action?: string) {
    //call API step 1
    let countSuccess = 0;
    if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
      if (this.datas.contractConnect && this.datas.contractConnect.length && this.datas.contractConnect.length > 0) {
        this.datas.contractConnect.forEach((res: any) => {
          res['contract_id'] = this.datas.contract_id_action;
        })
      }

      await this.contractTemplateService.addInforContractTemplate(this.datas, this.datas.contract_id_action).toPromise().then((res: any) => {
        this.datas.id = res?.id;
        this.datas.contract_id = res?.id;
      }, (error: HttpErrorResponse) => {
        countSuccess++;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("no.push.information.contract.error", "", 3000);
      })

      if (countSuccess == 0 && this.uploadFileContractAgain) {
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
        //lay id file hop dong cu
        let fileContract_1 = this.datas.i_data_file_contract.filter((p: any) => p.type == 1)[0];

        await this.contractTemplateService.updateFile(fileContract_1.id, this.datas).toPromise().then((respon: any) => {
          console.log(respon);
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thay thế file hợp đồng thất bại", "", 3000);
          // return;
        })
      }

      if (countSuccess == 0) {
        await this.unitService.getDataNotifyOriganzation().toPromise().then((res: any) => {
          this.datas.name_origanzation = res.name;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        if (this.attachFileArr != null) {
          for (var i = 0; i < this.attachFileArr.length; i++) {
            //kiem tra file cu da bi danh dau xoa hay chua
            let id_type="";
            if(this.attachFileArr[i].id){
              console.log(this.attachFileArr[i].id);
              id_type = this.datas.i_data_file_contract.filter((p: any) => p.status == 1 && p.type == 3 && p.id == this.datas.attachFileArr[i].id)[0].id;
            }

            //neu chua co id hoac id khong con hoat dong
            if(!this.attachFileArr[i].id || !id_type){
              await this.uploadService.uploadFile(this.attachFileArr[i]).toPromise().then((data) => {
                //if (!this.datas.attachFileArr[i].id) {
                  this.datas.filePathAttach = data.file_object.file_path;
                  this.datas.fileNameAttach = data.file_object.filename;
                  this.datas.fileBucketAttach = data.file_object.bucket;
                  this.contractTemplateService.addDocumentAttach(this.datas).toPromise().then((data) => {
                    // this.datas.document_attach_id = data?.id;
                    if(this.datas.attachFileArr[i]){
                      this.datas.attachFileArr[i].id = data?.id;
                    }
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
            
            
          }
        } 
        this.step = variable.stepSampleContract.step2;
        this.datas.stepLast = this.step;
        this.nextOrPreviousStep(this.step);
        this.spinner.hide();
      } 

    } else {
      //day thong tin
      await this.contractTemplateService.addInforContractTemplate(this.datas).toPromise().then((res: any) => {
        this.datas.id = res?.id;
        this.datas.contract_id = res?.id;
      }, (error: HttpErrorResponse) => {
        countSuccess++;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Đẩy thông tin mẫu hợp đồng thất bại", "", 3000);
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
        await this.contractTemplateService.addDocument(this.datas).toPromise().then((respon: any) => {
          this.datas.document_id = respon?.id;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.push.file.connect.contract.error", "", 3000);
        })
      }

      if (countSuccess == 0) {
        await this.unitService.getDataNotifyOriganzation().toPromise().then((res: any) => {
          this.datas.name_origanzation = res.name;
        }, (error: HttpErrorResponse) => {
          countSuccess++
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("no.get.information.organization.error", "", 3000);
        })
      }
      if (countSuccess == 0) {
      
        //neu co file dinh kem
        if (this.datas.attachFileArr != null) {
          for (var i = 0; i < this.datas.attachFileArr.length; i++) {
            //day file
            await this.uploadService.uploadFile(this.datas.attachFileArr[i]).toPromise().then((dataUpload) => {
              this.datas.filePathAttach = dataUpload.file_object.file_path;
              this.datas.fileNameAttach = dataUpload.file_object.filename;
              this.datas.fileBucketAttach = dataUpload.file_object.bucket;
              
            },
              error => {
                countSuccess++
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout("no.push.file.attach.error", "", 3000);
              }
            );

            if (countSuccess == 0) {
              //xac dinh moi quan he file dinh kem id va hop dong
              await this.contractTemplateService.addDocumentAttach(this.datas).toPromise().then((data) => {              
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
      }
      if (countSuccess == 0) {
        this.step = variable.stepSampleContract.step2;
        this.datas.stepLast = this.step;
        this.nextOrPreviousStep(this.step);
        this.spinner.hide();
      }
    }

  }

  // --next step 2
  async next() {
    if (!this.validData()) {
      return;
    } else {
      this.spinner.show();
      // set value to datas
      this.datas.name = this.name;
      this.datas.contract_no = this.contract_no;
      this.datas.notes = this.notes;
      this.defineData(this.datas);
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

      if (this.datas.contract_no && (this.datas.contract_no != this.contract_no_old || this.datas.start_time != this.start_time_old || this.datas.end_time != this.end_time_old)) {
        //check so hop dong da ton tai hay chua
        this.contractTemplateService.checkCodeUnique(this.datas.contract_no, this.datas.start_time, this.datas.end_time, this.datas.id).subscribe(
          dataCode => {
            if (dataCode.success) {
              this.callAPI();
            } else {
              if(dataCode.message == this.userService.getAuthCurrentUser().email){
                this.toastService.showErrorHTMLWithTimeout('Mã mẫu hợp đồng đã tồn tại với mẫu hợp đồng đã tạo trước đó', "", 3000);
              }else{
                this.toastService.showErrorHTMLWithTimeout('Mã mẫu hợp đồng đã tồn tại với người dùng ' + dataCode.message, "", 3000);
              }
              this.spinner.hide();
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra mã mẫu hợp đồng', "", 3000);
            this.spinner.hide(); 
          }
        )
      } else {
        this.callAPI();
      }

    }
  }

  convertData(datas: any) {
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
    this.datas.start_time = this.start_time;
    this.datas.end_time = this.end_time;
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

  deleteFileAttach(item: any, index_dlt: number) {
    if (item.id) {
      this.spinner.show();
      let data = this.datas.i_data_file_contract.filter((p: any) => p.id == item.id)[0];
      if (data) data.status = 0;
      this.contractTemplateService.updateFileAttach(item.id, data).subscribe((res: any) => {
        this.datas.attachFileNameArr.splice(index_dlt, 1);
        this.attachFileNameArr.splice(index_dlt, 1);
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
    }
    
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

    if(!parttern_input.input_form.test(this.name)) {
      this.errorContractName = "error.contract.template.name.valid";
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
    if(!this.contract_no){
      this.errorContractNumber = "error.contract-template.code.required";
      return false;
    }
    return true;
  }

  contractNumberCounter(){
    if(this.characterCounter(this.contract_no) > 100){
      this.errorContractNumber = "Mã mẫu hợp đồng không được vượt quá 100 ký tự";
      return false;
    }
    return this.checkPatternContractNumber();
  }

  checkPatternContractNumber(){
    if(!String(this.contract_no).match(parttern.name_and_number)){
      this.errorContractNumber = "Mã mẫu hợp đồng không được chứa ký tự đặc biệt, ký tự có dấu";
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
    if(this.start_time && this.end_time && moment(this.datepipe.transform(this.start_time, 'yyyy-MM-dd')).toDate() > moment(this.datepipe.transform(this.end_time, 'yyyy-MM-dd')).toDate()){
      this.errorEndTime = "error.contract-template.effective-end-date.compare";
      return false;
    }
    return true;
  }


}