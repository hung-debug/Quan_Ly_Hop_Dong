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
  @ViewChild('inputEditText') inputEditText: ElementRef;
  checkShowEdit = false;
  unsubscribe$: Subject<string> = new Subject();
  imageSignConfirm: string;
  currentUser: any;
  value: string;
  constructor(
    private dialog: MatDialog,
    private contractSignatureService: ContractSignatureService,

  ) { }

  ngOnInit(): void {
    console.log(this.sign);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    if (currentUser != null && currentUser.customer) {
      this.currentUser = currentUser.customer;
    }
    /*this.contractSignatureService.getProfileObs()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(imageStr => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser != null) {
          const cu = JSON.parse(currentUser);
          console.log(localStorage.getItem('currentUser'));
          // const isShowImage = this.datas.userForm.userSigns.some((userE: any) => { return cu.email === this.sign.email});
          console.log('okok', imageStr);
          // if (isShowImage) {
          //   this.imageSignConfirm = imageStr;
          // }
          return true;
        }
      });*/
  }

  ngAfterViewInit() {
    if (this.sign.sign_unit == 'so_tai_lieu' || this.sign.sign_unit == 'text') {
      setTimeout(() => {
        // @ts-ignore
        document.getElementById("input-text").focus();
      }, 0)
    }
  }

  doSign1() {
    /*console.log(this.datas.roleContractReceived);
    if ([2].includes(this.datas.roleContractReceived)) {
      this.checkShowEdit = !this.checkShowEdit;
      const isOtp = this.datas.userForm.userSigns.some((userE: any) => { return userE.email === this.sign.email});
      if (isOtp) {
        this.forWardContract();
      }

    }*/
  }

  doSign() {
    if (this.sign.sign_unit == 'chu_ky_anh' && this.sign?.recipient?.email == this.currentUser.email) {
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
      this.sign.value = result;
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

  getTextAlertConfirm() {
    /*if (this.datas.roleContractReceived == 2) {
      if (this.confirmConsider == 1) {
        return 'Bạn có chắc chắn xác nhận hợp đồng này?';
      } else if (this.confirmConsider == 2) {
        return 'Bạn có chắc chắn từ chối hợp đồng này?';
      }
    } else if (this.datas.roleContractReceived == 3) {
      if (this.confirmSignature == 1) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận ký?';
      } else if (this.confirmSignature == 2) {
        return 'Bạn không đồng ý với nội dung của hợp đồng và không xác nhận ký?';
      }
    }*/
    return ""
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
    if ([2,3].includes(this.datas.roleContractReceived) && this.sign?.recipient?.email == this.currentUser.email) {
      this.checkShowEdit = !this.checkShowEdit;
      setTimeout(()=>{
        this.inputEditText.nativeElement.focus();
      },0);
    }
  }
}
