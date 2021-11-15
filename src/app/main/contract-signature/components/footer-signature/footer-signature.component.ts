import {Component, OnInit, Input} from '@angular/core';
import {variable} from "../../../../config/variable";
import {ProcessingHandleEcontractComponent} from "../../shared/model/processing-handle-econtract/processing-handle-econtract.component";
import {MatDialog} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../shared/model/forward-contract/forward-contract.component";

@Component({
  selector: 'app-footer-signature',
  templateUrl: './footer-signature.component.html',
  styleUrls: ['./footer-signature.component.scss']
})
export class FooterSignatureComponent implements OnInit {
  @Input() datas: any

  constructor(
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  action() {
    if (this.datas.action_title == 'Điều phối') {
      this.datas.step = variable.stepSampleContract.step_confirm_coordination;
    }
  }

  processingAuthorization() {
    const data = {
      title: 'ỦY QUYỀN XỬ LÝ',
      is_content: 'processing_author'
    };
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
    const data = {
      title: 'CHUYỂN TIẾP',
      is_content: 'forward_contract'
    };
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
