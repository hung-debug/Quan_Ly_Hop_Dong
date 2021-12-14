import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/service/app.service';
import { AddUnitComponent } from './add-unit/add-unit.component';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  code:any;
  name:any;

  constructor(private appService: AppService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH TỔ CHỨC");
  }

  addUnit() {
    const data = {
      title: 'THÊM MỚI TỔ CHỨC'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}
