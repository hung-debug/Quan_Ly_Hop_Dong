import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';


@Component({
  selector: 'app-admin-add-pack-unit',
  templateUrl: './admin-add-pack-unit.component.html',
  styleUrls: ['./admin-add-pack-unit.component.scss']
})
export class AdminAddPackUnitComponent implements OnInit {

  datas: any;
  danhSachGoiDichVu: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminAddPackUnitComponent>,
    private adminPackService: AdminPackService,
  ) { }

  ngOnInit(): void {
    this.getPackList();
  }

  getPackList(): any {
    this.adminPackService
    .getPackList(
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    )
    .subscribe((response) => {

      const list: any[] = [];

      console.log("response ",response);
     
      response.entities.forEach((key: any) => {
        list.push(key.name);
      }) 

      this.danhSachGoiDichVu = list;
 
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}


