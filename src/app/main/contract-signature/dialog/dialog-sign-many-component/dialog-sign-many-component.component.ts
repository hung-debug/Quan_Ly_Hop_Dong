import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-sign-many-component',
  templateUrl: './dialog-sign-many-component.component.html',
  styleUrls: ['./dialog-sign-many-component.component.scss']
})
export class DialogSignManyComponentComponent implements OnInit {

  nameCompany: any = "Vũ Thị Thuỳ";
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogSignManyComponentComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(1);
  }

}
