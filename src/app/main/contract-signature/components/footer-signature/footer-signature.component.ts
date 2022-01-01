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
  is_show_coordination: boolean = false;
  is_data_coordination: any;

  constructor(
    private dialog: MatDialog,
    private contractService: ContractService
  ) {
  }

  ngOnInit(): void {
    console.log('footer...', this.datas);
    //@ts-ignore
    // let isCheckCoordination = JSON.parse(localStorage.getItem('coordination_complete'));
    // if (isCheckCoordination) {
    //   this.datas.coordination_complete = true;
    // }
    let recipient_data = {
      recipients: undefined
    };
    let data_coordination = this.datas.is_data_contract.participants;
    let emailCurrent = this.contractService.getAuthCurrentUser().email;
    for (let i = 0; i < data_coordination.length; i++) {
      for (let j = 0; j < data_coordination[i].recipients.length; j++) {
        if (data_coordination[i].recipients[j].email == emailCurrent) {
          this.is_data_coordination = data_coordination[i];
          break;
        }
      }
    }

    console.log(this.is_data_coordination);
    if (this.is_data_coordination) {
      let count_uncoordinated = 0;
      let count_coordinated = 0;
      // @ts-ignore
      for (let i = 0; i < this.is_data_coordination.recipients.length; i++) {
        //@ts-ignore
        let element = this.is_data_coordination.recipients[i];
        if (element.role == 1) {
          // tạm thời do call api 7.7 điều phối truyền lên obj role ==1 đang sinh ra 2 obj điều phối
          if (element.status != 1) {
            count_coordinated++;
          } else {
            count_uncoordinated++;
          }
        }
      }

      if (count_coordinated > 0) {
        this.is_show_coordination = true;
        this.view = true;
      } else {
        this.is_show_coordination = false;
      }
    }
  }

  action() {
    if (this.datas.action_title == 'dieu_phoi') {
      // let recipient_data = {};
      // let data_coordination = this.datas.is_data_contract.participants;
      // let emailCurrent = this.contractService.getAuthCurrentUser().email;
      // for (let i = 0; i < data_coordination.length; i++) {
      //   for (let j = 0; j < data_coordination[i].recipients.length; j++) {
      //     if (data_coordination[i].recipients[j].email == emailCurrent) {
      //       recipient_data = data_coordination[i];
      //       break;
      //     }
      //   }
      // }
      // console.log(recipient_data);
      if (this.is_data_coordination) {
        // @ts-ignore
        if (this.is_data_coordination['recipients']) {
          //@ts-ignore
          let dataCoordination = this.is_data_coordination['recipients'].filter((p: any) => p.role == 1)[0];
          if (dataCoordination) {
            this.datas.recipient_id_coordition = dataCoordination.id;
          }
        }
        this.datas.determine_contract = this.is_data_coordination;
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
