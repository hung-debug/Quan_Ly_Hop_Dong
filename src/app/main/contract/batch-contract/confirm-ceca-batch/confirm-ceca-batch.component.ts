import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-ceca-batch',
  templateUrl: './confirm-ceca-batch.component.html',
  styleUrls: ['./confirm-ceca-batch.component.scss']
})
export class ConfirmCecaBatchComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCecaBatchComponent>,
    public dialog: MatDialog,
  ) { }

  isCeCA:any;
  ngOnInit(): void {
    this.isCeCA = 1;
  }

  onSubmit(){
    this.dialogRef.close(this.isCeCA);
  }

}
