import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NgSignaturePadOptions, SignaturePadComponent} from "@almothafar/angular-signature-pad";
import {ContractSignatureService} from "../../../../../service/contract-signature.service";
import {INgxSelectOption} from "ngx-select-ex/ngx-select/ngx-select.interfaces";

@Component({
  selector: 'app-image-dialog-sign',
  templateUrl: './image-dialog-sign.component.html',
  styleUrls: ['./image-dialog-sign.component.scss']
})
export class ImageDialogSignComponent implements OnInit, AfterViewInit {
  myForm: FormGroup;
  datas: any;
  typeImageSignatureRadio: any = 2;
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  imgSignAccountSelect: string;
  imgSignPCSelect: string;
  imgSignDrawing: string;
  optionsFileSignAccount: any;

  public signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private contractSignatureService: ContractSignatureService,
    public dialogRef: MatDialogRef<ImageDialogSignComponent>
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.typeImageSignatureRadio = 2;
    this.datas = this.data;
    this.initListSignatureAccountUser();
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }

  fileChangedAttach(e: any) {
    console.log(e.target.files)
    let files = e.target.files;
    for(let i = 0; i < files.length; i++){

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 50000000) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();
          this.handleUpload(e);
          // this.datas.file_name_attach = file_name;
          //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
          // this.datas.attachFile = file;
          //this.datas.attachFile = e.target.files;
          console.log(this.datas.attachFile);
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          alert('Yêu cầu file nhỏ hơn 50MB');
          break;
        }
      }
    }
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  drawComplete(event: MouseEvent | Touch) {
    this.imgSignDrawing = this.signaturePad.toDataURL();
  }

  drawStart(event: MouseEvent | Touch) {
    console.log('Start drawing', event);
  }

  t(ev: number) {
    if (ev == 3) {
      setTimeout(() => {
        this.signaturePad.set('backgroundColor', 'rgba(233, 243, 251, 1)');
        this.signaturePad.set('border', 'none');
        this.signaturePad.set('canvasHeight', 500);
        this.signaturePad.set('canvasWidth', 950);
        this.signaturePad.clear();
      }, 200);
    }
  }

  initListSignatureAccountUser() {
    this.contractSignatureService.getSignatureListUser().subscribe(
      (res) => {
        console.log(res);
        this.optionsFileSignAccount = res.sign_account_register;
      }
    )
  }

  chooseImageSignAcc(e: INgxSelectOption[]) {
    this.imgSignAccountSelect = e[0].data.data;
    console.log(e[0].data.data);
  }

  uploadImage() {

    if (this.typeImageSignatureRadio == 1) {
      // this.contractSignatureService.setImageObs(this.imgSignAccountSelect);
      this.dialogRef.close(this.imgSignAccountSelect);
    } else if (this.typeImageSignatureRadio == 2) {
      // this.contractSignatureService.setImageObs(this.imgSignPCSelect);
      this.dialogRef.close(this.imgSignPCSelect);
    } else if (this.typeImageSignatureRadio == 3) {
      // this.contractSignatureService.setImageObs(this.imgSignDrawing);
      this.dialogRef.close(this.imgSignDrawing);
    }
  }
}
