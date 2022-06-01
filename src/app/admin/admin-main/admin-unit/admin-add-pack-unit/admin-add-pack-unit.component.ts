import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-admin-add-pack-unit',
  templateUrl: './admin-add-pack-unit.component.html',
  styleUrls: ['./admin-add-pack-unit.component.scss']
})
export class AdminAddPackUnitComponent implements OnInit {

  datas: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
