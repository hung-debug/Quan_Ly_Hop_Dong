import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { optionsCeCa } from 'src/app/config/variable';

@Component({
  selector: 'app-dialog-sign-many-component',
  templateUrl: './dialog-sign-many-component.component.html',
  styleUrls: ['./dialog-sign-many-component.component.scss']
})
export class DialogSignManyComponentComponent implements OnInit {

  options: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogSignManyComponentComponent>,
  ) { }

  ngOnInit(): void {
    this.options = optionsCeCa;
  }

  onSubmit() {
    const data = {
      // mark: 1,
      agree: 1 
    }
    this.dialogRef.close(data);
  }

}
