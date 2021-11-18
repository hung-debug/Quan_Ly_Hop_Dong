import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../../shared/model/forward-contract/forward-contract.component";
import {ConfirmSignOtpComponent} from "../confirm-sign-otp/confirm-sign-otp.component";

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
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.sign);
  }

  ngAfterViewInit() {
    // console.log(this.sign)
    if (this.sign.sign_unit == 'so_tai_lieu' || this.sign.sign_unit == 'text') {
      setTimeout(() => {
        // @ts-ignore
        document.getElementById("input-text").focus();
      }, 0)
    }
  }

  doSign() {
    /*console.log(this.datas.roleContractReceived);
    if ([2].includes(this.datas.roleContractReceived)) {
      this.checkShowEdit = !this.checkShowEdit;
      const isOtp = this.datas.userForm.userSigns.some((userE: any) => { return userE.email === this.sign.email});
      if (isOtp) {
        this.forWardContract();
      }

    }*/
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
    if ([1,2].includes(this.datas.roleContractReceived)) {
      this.checkShowEdit = !this.checkShowEdit;
      setTimeout(()=>{
        this.inputEditText.nativeElement.focus();
      },0);
    }
  }
}
