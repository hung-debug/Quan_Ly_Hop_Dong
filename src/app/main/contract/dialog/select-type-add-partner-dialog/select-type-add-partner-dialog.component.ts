import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-select-type-add-partner-dialog',
  templateUrl: './select-type-add-partner-dialog.component.html',
  styleUrls: ['./select-type-add-partner-dialog.component.scss']
})
export class SelectTypeAddPartnerDialogComponent implements OnInit {

  selectedOption: string ='';

  constructor(
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialogRef: MatDialogRef<SelectTypeAddPartnerDialogComponent>,
    public dialog: MatDialog,
    ) 
  { }

  ngOnInit() {
  }

}
