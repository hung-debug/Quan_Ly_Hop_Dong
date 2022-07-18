import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {variable} from "../../../../config/variable";
import {
  ProcessingHandleEcontractComponent
} from "../../shared/model/processing-handle-econtract/processing-handle-econtract.component";
import {MatDialog} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../shared/model/forward-contract/forward-contract.component";
import {ContractService} from "../../../../service/contract.service";
import {DisplayDigitalSignatureComponent} from "../../display-digital-signature/display-digital-signature.component";
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-footer-signature',
  templateUrl: './footer-signature.component.html',
  styleUrls: ['./footer-signature.component.scss']
})
export class FooterSignatureComponent implements OnInit {
  @Input() datas: any;
  @Input() view: any;
  @Input() recipientId: any;
  @Output() submitChanges = new EventEmitter<number>();
  is_show_coordination: boolean = false;
  is_data_coordination: any;

  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    // console.log('footer...', this.datas);
    let recipient_data = {
      recipients: undefined
    };
    let data_coordination = this.datas.is_data_contract.participants;
    let emailCurrent = this.contractService.getAuthCurrentUser().email;
    let isBreak = false;
    for (let i = 0; i < data_coordination.length; i++) {
      for (let j = 0; j < data_coordination[i].recipients.length; j++) {
        if (data_coordination[i].recipients[j].email == emailCurrent) {
          this.is_data_coordination = data_coordination[i];
          isBreak = true;
          break;
        }
      }
      if (isBreak) break
    }

    if (this.is_data_coordination) {
      
      // @ts-ignore
      for (let i = 0; i < this.is_data_coordination.recipients.length; i++) {
        //@ts-ignore
        let element = this.is_data_coordination.recipients[i];
        if (element.role == 1 && element.email == emailCurrent) {
          if (element.status != 1) {
            this.is_show_coordination = true;
            this.view = true;
            break;
          } else {
            this.is_show_coordination = false;
            break;
          }
        }
      }
    }
   
  }

  action() {
    if (this.datas.action_title == 'dieu_phoi') {
      if (this.is_data_coordination) { // chỉ lấy dữ liệu của người điều phối
        if (this.is_data_coordination['recipients']) {
          let dataCoordination = this.is_data_coordination['recipients'].filter((p: any) => p.role == 1)[0]; // get dữ liệu người điều phối
          if (dataCoordination) {
            this.datas.recipient_id_coordition = dataCoordination.id;
            if (dataCoordination.status == 5) {
              this.toastService.showWarningHTMLWithTimeout("Hợp đồng đang trong quá trình xử lý!", "", 3000);
              return;
            }
          }
        }
        
        // this.datas.determine_contract = this.is_data_coordination; // data determine contract
        this.datas.determine_contract = this.datas.is_data_contract.participants; // data determine contract
        this.datas.step = variable.stepSampleContract.step_confirm_coordination; // set step 2
      }
    } else if ([2, 3, 4].includes(this.datas.roleContractReceived)) {
      this.submitChanges.emit(1);
    }
  }

  showSignature() {
    const data = {
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DisplayDigitalSignatureComponent, {
      width: '550px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  refuseContract() {
    if (this.datas.action_title == 'dieu_phoi') {
      this.submitChanges.emit(1);
    }
  }

  downloadFilePDF() {
    this.submitChanges.emit(2);
  }


  getCoordination() {
    if (this.datas.action_title == 'dieu_phoi') {
      let recipient_data = {};
      let data_coordination = this.datas.is_data_contract.participants;
      let emailCurrent = this.contractService.getAuthCurrentUser().email;
      for (let i = 0; i < data_coordination.length; i++) {
        for (let j = 0; j < data_coordination[i].recipients.length; j++) {
          if (data_coordination[i].recipients[j].email == emailCurrent) {
            recipient_data = data_coordination[i];
            break;
          }
        }
      }
      // @ts-ignore
      if (recipient_data && recipient_data['recipients']) {
        // @ts-ignore
        let dataCoordination = recipient_data['recipients'].filter((p: any) => p.role == 1)[0];
        if (dataCoordination) {
          this.recipientId = dataCoordination.id;
        }
      }
    }
  }


  processingAuthorization() {
    this.getCoordination();
    const data = {
      title: 'ỦY QUYỀN XỬ LÝ',
      is_content: 'processing_author',
      dataContract: this.datas,
      recipientId: this.recipientId
    };
    if (this.datas.action_title == 'dieu_phoi') {
      // @ts-ignore
      data['role_coordination'] = 1;
    }
    // @ts-ignore
    const dialogRef = this.dialog.open(ForwardContractComponent, {
      width: '450px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  forWardContract() {
    this.getCoordination();
    const data = {
      title: 'CHUYỂN TIẾP',
      is_content: 'forward_contract',
      dataContract: this.datas,
      recipientId: this.recipientId
    };
    if (this.datas.action_title == 'dieu_phoi') {
      // @ts-ignore
      data['role_coordination'] = 1;
    }
    // @ts-ignore
    const dialogRef = this.dialog.open(ForwardContractComponent, {
      width: '450px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}
