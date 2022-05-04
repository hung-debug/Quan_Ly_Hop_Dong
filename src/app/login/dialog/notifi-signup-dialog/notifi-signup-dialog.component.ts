import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notifi-signup-dialog',
  templateUrl: './notifi-signup-dialog.component.html',
  styleUrls: ['./notifi-signup-dialog.component.scss']
})
export class NotifiSignupDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<NotifiSignupDialogComponent>,
  public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

}
