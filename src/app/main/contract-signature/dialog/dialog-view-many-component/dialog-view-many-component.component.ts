import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-dialog-view-many-component',
    templateUrl: './dialog-view-many-component.component.html',
    styleUrls: ['./dialog-view-many-component.component.scss']
  })
  export class DialogViewManyComponentComponent implements OnInit {
  
    options: any;
  
    constructor(
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogViewManyComponentComponent>,
    ) { }
  
    ngOnInit(): void {
    }
  
    onSubmit() {
      const data = {
        mark: 1,
        agree: 1 
      }
      this.dialogRef.close(data);
    }
  
  }