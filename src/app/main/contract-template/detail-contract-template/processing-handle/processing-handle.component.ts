import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-processing-handle',
  templateUrl: './processing-handle.component.html',
  styleUrls: ['./processing-handle.component.scss']
})
export class ProcessingHandleComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      is_data_contract: any,
      content: any},
    public router: Router,
    public dialog: MatDialog,
  ) {
  }

  data_organization:any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];

  getPartnerCoordinationer(item: any) {
    return item.recipients.filter((p: any) => p.role == 1)
  }

  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 2)
  }
  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3)
  }
  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4);
  }

  ngOnInit(): void {
    console.log(this.data.is_data_contract.participants);

    this.data_organization = this.data.is_data_contract.participants.filter((p: any) => p.type == 1)[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);

    this.data_parnter_organization = this.data.is_data_contract.participants.filter((p: any) => p.type == 2 || p.type == 3);
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
