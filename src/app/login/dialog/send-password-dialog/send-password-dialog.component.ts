import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-password-dialog',
  templateUrl: './send-password-dialog.component.html',
  styleUrls: ['./send-password-dialog.component.scss']
})
export class SendPasswordDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SendPasswordDialogComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

}
