import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-view-reason-rejected-dialog',
  templateUrl: './dialog-reason-rejected.component.html',
  styleUrls: ['./dialog-reason-rejected.component.scss']
})
export class DialogReasonRejectedComponent implements OnInit {
    @Input() isVisibleReasonReject: boolean;
    @Output() modalState: EventEmitter<any> = new EventEmitter();
    reasonReject : string;
constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

      public router: Router,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogReasonRejectedComponent>,
      // private contractService : ContractService
    ) {
      }

    ngOnInit(): void {
      // this.contractService.viewFlowContract(this.data.contractId).subscribe(response => {
      //   this.reasonReject = response.reasonReject;
      // });
      
    }

    handleCancel() {
        this.dialogRef.close();
      }
}