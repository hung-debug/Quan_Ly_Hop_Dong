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
  selector: 'app-upload-contract-file',
  templateUrl: './upload-contract-file.component.html',
  styleUrls: ['./upload-contract-file.component.scss']
})
export class UploadContractFileComponent implements OnInit {

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
  contractFile: any = null;
  contractName: string = "";

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<UploadContractFileComponent>,
    public router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private contractService: ContractService,
    private uploadService: UploadService
    ) {
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
        ceca_push: 0
      });
    }

  ngOnInit(): void {
  }


  onSubmit() {
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
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
          this.toastService.showWarningHTMLWithTimeout("File đính kèm yêu cầu tối đa 10MB", "", 3000);
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
    if (!this.validUpdateValues()) {
      return
    }
    this.spinner.show()
    try {
      this.spinner.hide()
      let res = await this.uploadService.uploadCompleteContractFile(this.contractFile, this.contractName, this.data).toPromise()
      if (res) {
        this.toastService.showSuccessHTMLWithTimeout("upload.contract.file.success","",3000)
        this.dialogRef.close();
      } 
    } catch (error) {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout("upload.contract.file.err","",3000)
    }
  }

  uploadContracFile(event: any) {
    this.contractFile = event.target.files[0]
    this.validContractFile()
  }

  addContractFile() {
    document.getElementById("file-input")?.click( )
  }

  errContractNameMess: string = ""
  errContractFileMess: string = ""

  validContractName() {
    this.errContractNameMess = ""
    if (!this.contractName) {
      this.errContractNameMess = "Tên hợp đồng không được để trống"
      return false
    }
  }

  validContractFile() {
    this.errContractFileMess = ""
    if (!this.contractFile) {
      this.errContractFileMess = "File hợp đồng không được để trống" 
      return false
    }
  }

  validUpdateValues() {
    this.validContractName()
    this.validContractFile()
    if (this.errContractFileMess || this.errContractNameMess) {
      return false
    }
    return true
  }
}
