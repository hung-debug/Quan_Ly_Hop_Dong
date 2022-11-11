import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-view-reason-rejected-dialog',
  templateUrl: './dialog-reason-rejected.component.html',
  styleUrls: ['./dialog-reason-rejected.component.scss']
})
export class DialogReasonRejectedComponent implements OnInit {
    @Input() isVisibleReasonReject: boolean;
    @Output() modalState: EventEmitter<any> = new EventEmitter();

    formReasonReject: FormGroup;
constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
        is_data_contract: any,
        content: any},
    public router: Router,
    public dialog: MatDialog,
      ) {
      }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    handleCancel() {
        this.modalState.emit(!this.isVisibleReasonReject);
        this.dialog.closeAll();
      }
}