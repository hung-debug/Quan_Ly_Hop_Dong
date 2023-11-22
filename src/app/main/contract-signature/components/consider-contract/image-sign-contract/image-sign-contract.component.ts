import { ContractService } from 'src/app/service/contract.service';
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmSignOtpComponent} from "../confirm-sign-otp/confirm-sign-otp.component";

import {ImageDialogSignComponent} from "../image-dialog-sign/image-dialog-sign.component";
import {PkiDialogSignComponent} from "../pki-dialog-sign/pki-dialog-sign.component";
import {HsmDialogSignComponent} from "../hsm-dialog-sign/hsm-dialog-sign.component";
import { ToastService } from 'src/app/service/toast.service';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-image-sign-contract',
  templateUrl: './image-sign-contract.component.html',
  styleUrls: ['./image-sign-contract.component.scss']
})
export class ImageSignContractComponent implements OnInit, AfterViewInit {
  @Input() datas: any;
  @Input() sign: any;
  @Input() view: any;
  @Input() contractNoValue: boolean;
  @Input() contractNoValueSign: string;

  @ViewChild('inputEditText') inputEditText: ElementRef;
  @ViewChild('inputEditContractNo') inputEditContractNo: ElementRef;


  @Output('checkedChange') newItemEvent = new EventEmitter<string>();
  @Output('contractNoValue') contractNoValueEvent = new EventEmitter<string>();

  checkShowEdit = false;
  currentUser: any;
  value: string;
  typeSignDigital: any;

  contractNo: boolean = false;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');
    if (currentUserC != null && currentUserC.customer?.info) {
      this.currentUser = currentUserC.customer?.info;
    }
    // this.fetchDataUserSimPki();
  }

  getStyle(sign: any) {
    return {
      'font': sign.font,
      'font-size':sign.font_size+'px',
    };
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
      
      let is_data = result
    })
  }

  doneEditTextSign(e?: any) {
    this.checkShowEdit = false;
    
    
    if(this.sign.text_type == 'currency'){
        e.target.value = this.contractService.convertCurrency(e.target.value);
      this.sign.valueSign = e.target.value;}
  }

  doneEditContractNoSign(sign: any, e: any) {
    // this.checkShowEdit = false;

    // e.target.value = this.convertCurrency(e.target.value);
    this.contractNoValue = false;
    this.count++;
    sign.valueSign = this.contractNoValueSign;
    this.contractNoValueEvent.emit(this.contractNoValueSign);
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
      
      let is_data = result
    })
  }

  doEditText() {
    
    if(this.sign.valueSign != undefined)
    this.sign.valueSign = this.contractService.removePeriodsFromCurrencyValue(this.sign.valueSign);

    
    if ([2,3,4].includes(this.datas.roleContractReceived) && this.sign?.recipient?.email == this.currentUser.email && !this.view) {
      this.checkShowEdit = !this.checkShowEdit;

      setTimeout(()=>{
        this.inputEditText.nativeElement.focus();
        this.newItemEvent.emit("text");
      },100);
    }
  }

  doEditContractNo() {
    this.contractNoValue = !this.contractNoValue;

    setTimeout(()=>{
      this.inputEditContractNo.nativeElement.focus();
    },100);
   
  }

  count: number = 0;
  getText(sign: any) {
    this.newItemEvent.emit("1");
    if (sign.sign_unit == 'text') {
      if(sign.valueSign) {
        // sign.valueSign = this.convertCurrency(sign.valueSign);
        return sign.valueSign;
      }
      if(sign.text_type == 'currency'){
        return 'Số tiền'
      } else {
      return 'Text';}
    } else {
      if (sign.value) {
        // sign.value= this.convertCurrency(sign.value);
        
        return sign.value;
      } else if(sign.valueSign) {
        // sign.valueSign= this.convertCurrency(sign.valueSign);
        
        return sign.valueSign;
      } else if(this.contractNoValueSign) {
        
        this.count++;
        sign.valueSign= this.contractNoValueSign
        return sign.valueSign;

      }
      return 'Số hợp đồng';
    }
  }

  reverseInput(e:any){
    e.target.value = this.contractService.removePeriodsFromCurrencyValue(e.target.value);
  }

}
