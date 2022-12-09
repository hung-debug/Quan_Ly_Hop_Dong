import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import Swal from "sweetalert2";


@Component({
  selector: '-detail',
  templateUrl: './image-sign-contract.component.html',
  styleUrls: ['./image-sign-contract.component.scss']
})
export class ImageSignContractComponent implements OnInit, AfterViewInit {
  @Input() datas: any;
  @Input() sign: any;
  @Input() view: any;
  @ViewChild('inputEditText') inputEditText: ElementRef;
  checkShowEdit = false;
  unsubscribe$: Subject<string> = new Subject();
  imageSignConfirm: string;
  currentUser: any;
  value: string;
  constructor(
    private dialog: MatDialog,

  ) { }

  lang: string;
  ngOnInit(): void {
    console.log("image sign contract ");
    console.log(this.sign);
    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');
    if (currentUserC != null && currentUserC.customer?.info) {
      this.currentUser = currentUserC.customer?.info;
    }
    
    if(sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
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


  doEditText() {
    if ([2,3].includes(this.datas.roleContractReceived) && this.sign?.recipient?.email == this.currentUser.email && !this.view) {
      this.checkShowEdit = !this.checkShowEdit;
      setTimeout(()=>{
        this.inputEditText.nativeElement.focus();
      },0);
    }
  }
}
