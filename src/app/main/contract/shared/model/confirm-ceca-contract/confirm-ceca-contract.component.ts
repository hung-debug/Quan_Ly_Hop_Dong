import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-ceca-contract',
  templateUrl: './confirm-ceca-contract.component.html',
  styleUrls: ['./confirm-ceca-contract.component.scss']
})
export class ConfirmCecaContractComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCecaContractComponent>,
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
