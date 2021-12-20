import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-detail-unit',
  templateUrl: './detail-unit.component.html',
  styleUrls: ['./detail-unit.component.scss']
})
export class DetailUnitComponent implements OnInit {

  name:any="";
  short_name:any="";
  code:any="";
  email:any="";
  phone:any="";
  fax:any="";
  status:any="";
  parent_id:any="";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DetailUnitComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.unitService.getUnitById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.name = data.name,
        this.short_name = data.short_name,
        this.code = data.code,
        this.email = data.email,
        this.phone = data.phone,
        this.fax = data.fax,
        this.status = data.status,
        this.parent_id = data.parent_id
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }
}
