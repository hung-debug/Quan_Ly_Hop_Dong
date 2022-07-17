import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-ceca-form',
  templateUrl: './confirm-ceca-form.component.html',
  styleUrls: ['./confirm-ceca-form.component.scss']
})
export class ConfirmCecaFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCecaFormComponent>,
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
