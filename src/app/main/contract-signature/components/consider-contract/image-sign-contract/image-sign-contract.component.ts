import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../../shared/model/forward-contract/forward-contract.component";
import {ConfirmSignOtpComponent} from "../confirm-sign-otp/confirm-sign-otp.component";
import {ContractSignatureService} from "../../../../../service/contract-signature.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

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
  constructor(
    private dialog: MatDialog,
    private contractSignatureService: ContractSignatureService,

  ) { }

  ngOnInit(): void {
    console.log(this.sign);
    this.contractSignatureService.getProfileObs()
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
      });
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
