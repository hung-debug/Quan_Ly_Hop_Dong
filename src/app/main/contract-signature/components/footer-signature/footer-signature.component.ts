import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {variable} from "../../../../config/variable";
import {
  ProcessingHandleEcontractComponent
} from "../../shared/model/processing-handle-econtract/processing-handle-econtract.component";
import {MatDialog} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../shared/model/forward-contract/forward-contract.component";
import {ContractService} from "../../../../service/contract.service";

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

  constructor(
    private dialog: MatDialog,
    private contractService: ContractService
  ) {
  }

  ngOnInit(): void {
    console.log(this.datas);
    //@ts-ignore
    let isCheckCoordination = JSON.parse(localStorage.getItem('coordination_complete'));
    if (isCheckCoordination) {
      this.datas.coordination_complete = true;
    }
  }

  action() {
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

      console.log(recipient_data);
      if (recipient_data) {
        // @ts-ignore
        if (recipient_data['recipients']) {
          //@ts-ignore
          let dataCoordination = recipient_data['recipients'].filter((p: any) => p.role == 1)[0];
          if (dataCoordination) {
            this.datas.recipient_id_coordition = dataCoordination.id;
          }
          console.log(this.datas.recipient_id_coordition);
          // //@ts-ignore
          // let data = recipient_data['recipients'].filter((p: any) => p.role != 1);
          // //@ts-ignore
          // recipient_data['recipients'] = data;
          // recipient_data['recipients'].forEach((element: any, index: number) => {
          //   if (element.role == 1) {
          //     // @ts-ignore
          //     delete recipient_data['recipients'][index];
          //   }
          // })
        }

        this.datas.determine_contract = recipient_data;
        this.datas.step = variable.stepSampleContract.step_confirm_coordination;
      }

    } else if ([2, 3, 4].includes(this.datas.roleContractReceived)) {
      this.submitChanges.emit(1);
    }
  }

  // getDataCoordination(recipient_data: any) {
  //   let data_coordination = this.datas.is_data_contract.participants;
  //   let emailCurrent = this.contractService.getAuthCurrentUser().email;
  //   for (let i = 0; i < data_coordination.length; i++) {
  //     for (let j = 0; j < data_coordination[i].recipients.length; j++) {
  //       if (data_coordination[i].recipients[j].email == emailCurrent) {
  //         recipient_data = data_coordination[i];
  //         break;
  //       }
  //     }
  //   }
  // }

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
      keyboard: false,
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
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}
