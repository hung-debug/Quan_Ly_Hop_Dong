import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { optionsCeCa } from 'src/app/config/variable';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { parttern_input } from 'src/app/config/parttern';
import { parttern } from 'src/app/config/parttern';
import { UploadService } from 'src/app/service/upload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-attach-files-dialog',
  templateUrl: './upload-attach-files-dialog.component.html',
  styleUrls: ['./upload-attach-files-dialog.component.scss']
})
export class UploadAttachFilesComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  nameOld:any;
  codeOld:any;

  submitted = false;

  optionsCeCa: Array<any> = [];

  optionsCeCaValue: any;

  ceca: boolean;
  attachFileNameArr: any = [];
  uploadFileAttachAgain: boolean;
  attachFileArr: any = []

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<UploadAttachFilesComponent>,
    public router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private contractService: ContractService,
    private uploadService: UploadService,
    private translate: TranslateService
    ) {
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
        ceca_push: 0
      });
    }

  ngOnInit(): void {
    this.datas = this.data;

    this.optionsCeCa = optionsCeCa;

    //lay du lieu form cap nhat
    if( this.data.id != null){
      this.contractTypeService.getContractTypeById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            name: this.fbd.control(data?.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
            code: this.fbd.control(data?.code, [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
            ceca_push: this.convertCeCa(data?.ceca_push)
          });
          this.nameOld = data?.name;
          this.codeOld = data?.code;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
        ceca_push: 0
      });
    }

    
    this.contractService.getDataNotifyOriganzation().subscribe((response) => {
      if(response.ceca_push_mode == 'NONE') {
        this.ceca = false;
      } else if(response.ceca_push_mode == 'SELECTION') {
        this.ceca = true
      }
    })
  }

  convertCeCa(ceca_push: any) {
    if(ceca_push == 1) {
      this.optionsCeCaValue = 1;
      return 1;
    } else {
      this.optionsCeCaValue = 0;
      return 0;
    } 
  }

  checkName(data:any){
    //neu thay doi ten thi can check lai
    if(data.name != this.nameOld){
      //kiem tra ten
      this.contractTypeService.checkNameContractType(data.name).subscribe(
        dataByName => {
          //neu ten loai hop dong chua ton tai
          if(dataByName.success){
            
            //call update
            this.update(data);

          //neu ten loai hop dong da ton tai
          }else{
            this.toastService.showErrorHTMLWithTimeout('Tên loại hợp đồng đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )

    //neu khong thay doi ten thi bo qua check ten
    }else{
      //call update
      this.update(data);
    }
  }

  update(data:any){
    this.contractTypeService.updateContractType(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-type']);
        });    
        this.spinner.hide();
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        this.spinner.hide();
      }
    )
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      id: this.data.id,
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      ceca_push: this.addForm.value.ceca_push
    }
    this.spinner.show();
    //ham sua
    if(this.data.id !=null){

      //neu thay doi ma thi can check lai
      if(data.code != this.codeOld){
        this.contractTypeService.checkCodeContractType(data.code).subscribe(
          dataByCode => {
            //neu ma loai hop dong chua ton tai
            if(dataByCode.success){
              
              //call ham check ten
              this.checkName(data);

            //neu ma loai hop dong da ton tai
            }else{
              this.toastService.showErrorHTMLWithTimeout('Mã loại hợp đồng đã tồn tại', "", 3000);
              this.spinner.hide();
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            this.spinner.hide();
          }
        )
      //neu khong thay doi ma thi bo qua check ma
      }else{
        //ham check ten
        this.checkName(data);
      }
    
    //ham them moi
    }else{
      //kiem tra ma loai hop dong
      this.contractTypeService.checkCodeContractType(data.code).subscribe(
        dataByCode => {
          //neu ma loai hop dong chua ton tai
          if(dataByCode.success){
            //kiem tra ten loai hop dong
            this.contractTypeService.checkNameContractType(data.name).subscribe(
              dataByName => {
                //neu ten loai hop dong chua ton tai
                if(dataByName.success){
                  this.contractTypeService.addContractType(data).subscribe(
                    data => {
                      this.toastService.showSuccessHTMLWithTimeout('Thêm mới loại hợp đồng thành công!', "", 3000);
                      this.dialogRef.close();
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/main/contract-type']);
                      });
                      this.spinner.hide();
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                      this.spinner.hide();
                    }
                  )
                //neu ten loai hop dong da ton tai
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Tên loại hợp đồng đã tồn tại', "", 3000);
                  this.spinner.hide();
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                this.spinner.hide();
              }
            )
          //neu ma loai hop dong da ton tai
          }else{
            this.toastService.showErrorHTMLWithTimeout('Mã loại hợp đồng đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }


  deleteFileAttach(item: any, index_dlt: number) {
    if (item.id) {
      this.spinner.show();
      let data = this.attachFileArr?.filter((p: any) => p.id == item.id)[0]
      if (data) data.status = 0;
      this.contractService.updateFileAttach(item.id, data).subscribe((res: any) => {
        this.datas.attachFileNameArr.splice(index_dlt, 1);
        this.attachFileNameArr.splice(index_dlt, 1);
        this.attachFileArr.splice(index_dlt, 1)
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
      this.attachFileArr.splice(index_dlt, 1)
    }
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFile').click();
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
              this.attachFileNameArr.push(file);
              this.datas.attachFileArr = this.attachFileNameArr;
              this.attachFileArr.push(file)
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
          this.toastService.showWarningHTMLWithTimeout("File đính kèm yêu cầu nhỏ hơn 10MB", "", 3000);
          break;
        }
      }
    }
    
    const valueEmpty: any = document.getElementById('attachFile');
    valueEmpty.value = "";
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

  async uploadingAttachFiles(){
    if (this.attachFileArr.length == 0) return
    let fileNameArr: any = []
    this.attachFileArr.forEach((item: any) => {
      fileNameArr.push({
        contractId: this.data.contractId,
        fileName: item.name
      })
    })
    let count: number = 0
    await this.uploadService.checkDuplicateFileUploaded(fileNameArr).toPromise().then(
      (res) => {
        let fileNameArrDupplicate: any = []
        let listFileDupplicate = res.filter((item: any) => item.status == false)
        listFileDupplicate.forEach((item: any) => {
          fileNameArrDupplicate.push(item.fileName)
        })
        count = listFileDupplicate.length
        if (count > 0) {
          this.toastService.showErrorHTMLWithTimeout(`File ${fileNameArrDupplicate.toString().replace(',',', ')} ${this.translate.instant('error.upload.file.duplicate')}`,'',3000)
        } else {
          let addDocsPayload: any = []
          // step1 - upload to org
          try {
            this.spinner.show()
            this.uploadService.uploadMultiFileToOrg(this.attachFileArr).subscribe(
              (res: any) => {
                this.spinner.hide()
                for (let i = 0; i < res.length; i++){
                  addDocsPayload[i] = {
                    id: this.data.contractId,
                    name: this.data.contractName,
                    filePath: res[i]?.file_object?.file_path,
                    fileName: res[i]?.file_object?.filename,
                    fileBucket: res[i]?.file_object?.bucket,
                  }
                }
                for (let i = 0; i < addDocsPayload.length; i++){
                  this.contractService.addDocument(addDocsPayload[i], 3).toPromise().then(
                    (res: any) => {
                      this.spinner.hide()
                    }
                  )
                }
                this.toastService.showSuccessHTMLWithTimeout('success.upload.file.attach','',3000)
                this.dialog.closeAll()
              }
            )
          } catch (error) {
            this.spinner.hide()
            this.toastService.showErrorHTMLWithTimeout('error.upload.file.attach','',3000)
          }
        }
      }, (err: any) => {
        this.spinner.hide()
        this.toastService.showErrorHTMLWithTimeout('error.upload.file.attach','',3000)
      }
    )
  }
}
