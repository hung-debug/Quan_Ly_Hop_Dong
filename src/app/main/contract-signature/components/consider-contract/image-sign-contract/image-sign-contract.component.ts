import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../../shared/model/forward-contract/forward-contract.component";
import {ConfirmSignOtpComponent} from "../confirm-sign-otp/confirm-sign-otp.component";
import {ContractSignatureService} from "../../../../../service/contract-signature.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import Swal from "sweetalert2";
import {ImageDialogSignComponent} from "../image-dialog-sign/image-dialog-sign.component";
import {PkiDialogSignComponent} from "../pki-dialog-sign/pki-dialog-sign.component";
import {HsmDialogSignComponent} from "../hsm-dialog-sign/hsm-dialog-sign.component";

@Component({
  selector: 'app-image-sign-contract',
  templateUrl: './image-sign-contract.component.html',
  styleUrls: ['./image-sign-contract.component.scss']
})
export class ImageSignContractComponent implements OnInit, AfterViewInit {
  @Input() datas: any;
  @Input() sign: any;
  @Input() view: any;
  @ViewChild('inputEditText') inputEditText: ElementRef;
  checkShowEdit = false;
  currentUser: any;
  value: string;
  constructor(
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');
    if (currentUserC != null && currentUserC.customer?.info) {
      this.currentUser = currentUserC.customer?.info;
    }
  }

  ngAfterViewInit() {
    if (this.sign.sign_unit == 'so_tai_lieu' || this.sign.sign_unit == 'text') {
      setTimeout(() => {
        // @ts-ignore
        document.getElementById("input-text").focus();
      }, 0)
    }
  }

  doSign() {
    if (this.sign.sign_unit == 'chu_ky_anh' && this.sign?.recipient?.email == this.currentUser.email && !this.view) {
      this.openPopupSignContract(1);
    }
  }

  confirmOtpSignContract() {
    const data = {
      title: 'Xác nhận otp',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ConfirmSignOtpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.openPopupSignContract(1);
    })
  }

  openPopupSignContract(typeSign: any) {
    if (typeSign == 1) {
      this.imageDialogSignOpen();
    } else if (typeSign == 3) {
      this.pkiDialogSignOpen();
    } else if (typeSign == 4) {
      this.hsmDialogSignOpen();
    }
  }

  imageDialogSignOpen() {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      this.sign.valueSign = result;
    })
  }

  pkiDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ PKI',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  hsmDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  doneEditTextSign() {
    this.checkShowEdit = false;
  }



  forWardContract() {
    const data = {
      title: 'CHUYỂN TIẾP',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ConfirmSignOtpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  doEditText() {
    if ([2,3,4].includes(this.datas.roleContractReceived) && this.sign?.recipient?.email == this.currentUser.email && !this.view) {
      this.checkShowEdit = !this.checkShowEdit;
      setTimeout(()=>{
        this.inputEditText.nativeElement.focus();
      },0);
    }
  }
}
