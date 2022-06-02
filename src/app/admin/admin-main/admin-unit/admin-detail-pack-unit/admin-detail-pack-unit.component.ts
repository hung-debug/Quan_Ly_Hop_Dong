import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-detail-pack-unit',
  templateUrl: './admin-detail-pack-unit.component.html',
  styleUrls: ['./admin-detail-pack-unit.component.scss']
})
export class AdminDetailPackUnitComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdminDetailPackUnitComponent>,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

}
