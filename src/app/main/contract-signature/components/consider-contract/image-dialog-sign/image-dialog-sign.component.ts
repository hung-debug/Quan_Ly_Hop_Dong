import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NgSignaturePadOptions, SignaturePadComponent} from "@almothafar/angular-signature-pad";
import {ContractSignatureService} from "../../../../../service/contract-signature.service";
import {INgxSelectOption} from "ngx-select-ex/ngx-select/ngx-select.interfaces";
import Swal from 'sweetalert2'
import { ToastService } from 'src/app/service/toast.service';
import { DeviceDetectorService } from 'ngx-device-detector';
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
  imgSignAccountSelect: any;
  markSignAccountSelect: any;

  imgSignPCSelect: any;
  imgSignDrawing: any;
  optionsFileSignAccount: any;
  mobile: boolean = false;

  public signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 6,
    maxWidth: 6,
    canvasWidth: 500,
    canvasHeight: 300
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog,
    private contractSignatureService: ContractSignatureService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ImageDialogSignComponent>
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    
    this.getDeviceApp();

    this.typeImageSignatureRadio = 2;
    this.datas = this.data;

    this.initListSignatureAccountUser();
    this.imgSignAccountSelect = 'data:image/png;base64,' + this.datas.imgSignAcc;
    this.markSignAccountSelect = 'data:image/png;base64,' + this.datas.markSignAcc;
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }

  fileChangedAttach(e: any) {
    let files = e.target.files;
    let valid = ["jpg", "jpeg", "png"];
    for(let i = 0; i < files.length; i++){

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 50000000 && valid.includes(file.name.split('.').pop().toLowerCase())) {
          this.handleUpload(e);
          e.target.value = null;
        } else if (!valid.includes(file.name.split('.').pop().toLowerCase())) {
          Swal.fire({
            title: 'File upload là file ảnh!',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
          });
          break;
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          Swal.fire({
            title: 'Yêu cầu file nhỏ hơn 50MB!',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
          });
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
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  drawComplete(event: MouseEvent | Touch) {
    this.imgSignDrawing = this.signaturePad.toDataURL();
  }

  drawStart(event: MouseEvent | Touch) {
  }

  t(ev: number) {
    this.checkIOSAndroid();

    if (ev == 3) {
      setTimeout(() => {
        this.signaturePad.set('border', 'none');
        if(this.mobile)
          this.signaturePad.set('canvasHeight', 340);
        else 
          this.signaturePad.set('canvasHeight', 500);

        if(this.mobile) {
          if(this.iOS) {
            this.signaturePad.set('canvasWidth',250);
          } else {
            this.signaturePad.set('canvasWidth',210);
          }
        } else {
          this.signaturePad.set('canvasWidth', 950);
        }

        this.signaturePad.clear();
      }, 200);
    } else if (ev == 1 && !this.datas.imgSignAcc && !this.data.mark) {
      this.toastService.showWarningHTMLWithTimeout('notify_have_not_sign_acc', "", 3000);
    } else  if (ev == 1 && !this.datas.markSignAcc && !this.data.mark && this.data.code.includes('usb') && this.data.code.includes('hsm')) {
      this.toastService.showWarningHTMLWithTimeout('notify_have_not_sign_mark_acc',"",3000);
    }
  }

  iOS: boolean = false;
  checkIOSAndroid() {
    var userAgent = navigator.userAgent || navigator.vendor;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
  }

  initListSignatureAccountUser() {
    this.contractSignatureService.getSignatureListUser().subscribe(
      (res) => {
        this.optionsFileSignAccount = res.sign_account_register;
      }
    )
  }

  chooseImageSignAcc(e: INgxSelectOption[]) {
    this.imgSignAccountSelect = e[0].data.data;
  }

  uploadImage() {
    if (this.typeImageSignatureRadio == 1) {
      if(!this.imgSignAccountSelect) {
        this.toastService.showErrorHTMLWithTimeout('Bạn chưa chọn ảnh','',3000)
      } else {
        if(this.data.mark) {
          this.dialogRef.close(this.markSignAccountSelect);
        } else {
          this.dialogRef.close(this.imgSignAccountSelect);
        }
      }

    } else if (this.typeImageSignatureRadio == 2) {
      if(!this.imgSignPCSelect) {
        this.toastService.showErrorHTMLWithTimeout('not.photo','',3000)
      } else {
        this.dialogRef.close(this.imgSignPCSelect);
      }
    } else if (this.typeImageSignatureRadio == 3) {
      if(!this.imgSignDrawing) {
        this.toastService.showErrorHTMLWithTimeout('not.draw.sign','',3000)
      } else {
        this.dialogRef.close(this.imgSignDrawing);
      }
    }
  }

  clearImage() {
    this.signaturePad?.clear();
    this.imgSignDrawing = null;
    this.imgSignPCSelect = null;
  }
}
