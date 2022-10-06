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
import {UserService} from "../../../../../service/user.service";
import {networkList} from "../../../../../config/variable";
import { ToastService } from 'src/app/service/toast.service';

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
  typeSignDigital: any;
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');
    if (currentUserC != null && currentUserC.customer?.info) {
      this.currentUser = currentUserC.customer?.info;
    }
    // this.fetchDataUserSimPki();
    console.log(this.sign);
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
    console.log(this.sign);
    //khong thuc hien ky eKYC tren web
    if (this.sign.sign_unit == 'chu_ky_anh' && this.sign?.recipient?.email == this.currentUser.email && !this.view) {
      if(this.sign?.recipient?.sign_type.filter((p: any) => p.id == 5).length == 0){
        this.openPopupSignContract(1);
      }else{
        this.toastService.showWarningHTMLWithTimeout("Vui lòng thực hiện ký eKYC trên ứng dụng điện thoại!", "", 3000);
      }
      
    } else if (this.sign.sign_unit == 'chu_ky_so'
      && this.sign?.recipient?.email == this.currentUser.email && !this.view
      && this.typeSignDigital && this.typeSignDigital == 3
    ) {
      // this.openPopupSignContract(3);
    } 
  }

  confirmOtpSignContract() {
    const data = {
      title: 'Xác nhận otp',
      is_content: 'forward_contract',
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
      console.log("typesign ", typeSign);
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
      is_content: 'forward_contract',
      imgSignAcc: this.datas.imgSignAcc
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
      type: 3,
      sign: this.sign,
      data: this.datas
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.height = '330px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.phone && result.networkCode) {
        this.sign.phone = result.phone;
        this.sign.phone_tel = result.phone_tel;
        this.sign.networkCode = result.networkCode;
      }
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

  /*fetchDataUserSimPki() {
    if (this.sign?.recipient?.sign_type) {
      const typeSD = this.sign?.recipient?.sign_type.find((t: any) => t.id != 1);
      if (typeSD) {
        this.typeSignDigital = typeSD.id;
      }
    }
    if (this.sign.sign_unit == 'chu_ky_so'
      && this.sign?.recipient?.email == this.currentUser.email && !this.view
      && this.typeSignDigital && this.typeSignDigital == 3
    ) {
      const nl = networkList;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
      this.userService.getUserById(this.currentUser.id).subscribe(
        (data) => {
          const itemNameNetwork = nl.find((nc: any) => nc.id = data.phone_tel);
          this.sign.phone = data.phone_sign;
          this.sign.phone_tel = data.phone_tel;
          this.sign.networkCode = (itemNameNetwork && itemNameNetwork.name) ? itemNameNetwork.name.toLowerCase() : null;
        }
      )
    }
  }*/

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

  getText(sign: any) {

    // console.log("sign ",sign);
    // console.log("datas ", this.datas);
    if (sign.sign_unit == 'text') {
      if(sign.valueSign) {
        return sign.valueSign;
      }
      return 'Text';
    } else {
      if (this.datas.is_data_contract.code) {
        return this.datas.is_data_contract.code;
      } else if (sign.value) {
        return sign.value;
      } else if(sign.valueSign) {
        return sign.valueSign;
      } 
      return 'Số hợp đồng';
    }
  }
}
