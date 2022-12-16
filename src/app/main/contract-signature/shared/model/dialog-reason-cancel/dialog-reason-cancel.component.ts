import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import { ContractService } from 'src/app/service/contract.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-reason-cancel-dialog',
  templateUrl: './dialog-reason-cancel.component.html',
  styleUrls: ['./dialog-reason-cancel.component.scss']
})
export class DialogReasonCancelComponent implements OnInit {
    @Input() isVisibleReasonReject: boolean;
    @Output() modalState: EventEmitter<any> = new EventEmitter();
    reasonCancel: string;
constructor(
    @Inject(MAT_DIALOG_DATA) public data: any ,
      public translate: TranslateService,
      public router: Router,
      public dialog: MatDialog,
      private contractService : ContractService,
      public dialogRef: MatDialogRef<DialogReasonCancelComponent>,
    ) {
      translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(localStorage.getItem('lang') || 'vi');
      }

    ngOnInit(): void {
      this.contractService.viewFlowContract(this.data.contractId).subscribe(response => {
        this.reasonCancel = response.reasonCancel;
      });
    }

    handleCancel() {
        this.dialogRef.close();
      }
}