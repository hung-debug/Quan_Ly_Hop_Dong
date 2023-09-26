import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './content-sms.component.html',
  styleUrls: ['./content-sms.component.scss']
})

export class ContentSmsComponent implements OnInit {
  currentOrgId: string = "";
  datas: any;
  submitted = false;
  dataSendLog: any
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContentSmsComponent>,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    // this.currentOrgId = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId.toString()
  }

}
