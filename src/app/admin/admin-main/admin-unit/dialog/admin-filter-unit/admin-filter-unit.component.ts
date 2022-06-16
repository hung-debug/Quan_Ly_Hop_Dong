import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';
import { statusList } from '../../../../../config/variable';
import { AdminUnitComponent } from '../../admin-unit.component';

@Component({
  selector: 'app-admin-filter-unit',
  templateUrl: './admin-filter-unit.component.html',
  styleUrls: ['./admin-filter-unit.component.scss'],
})


export class AdminFilterUnitComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  submitted = false;
  statusList: any[];

  name: string;

  listData:any[];

  flagSearch: boolean = false;


  get f() {
    return this.addForm.controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<AdminFilterUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.addForm = this.fbd.group({
      filter_representative: this.fbd.control(this.data.filter_representative),
      filter_email: this.fbd.control(this.data.filter_email),
      filter_phone: this.fbd.control(this.data.filter_phone),
      filter_status: this.fbd.control(Number(this.data.filter_status)),
      filter_address: this.fbd.control(this.data.filter_address),
    });
  }


  ngOnInit(): void {
    this.statusList = statusList;
  }

  onSubmit() {

    console.log("value");
    console.log(this.addForm.value.filter_status);

    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      filter_representative: this.addForm.value.filter_representative,
      filter_email: this.addForm.value.filter_email,
      filter_phone: this.addForm.value.filter_phone,
      filter_status: this.addForm.value.filter_status,
      filter_address: this.addForm.value.filter_address,
    }
    this.dialogRef.close();
    console.log(data);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/admin-main/unit'],
      {
        queryParams: {
          'filter_representative': data.filter_representative, 
          'filter_email': data.filter_email,
          'filter_phone': data.filter_phone,
          'filter_status': data.filter_status,
          'filter_address': data.filter_address,
        },
        skipLocationChange: true
      });
    });
  }

  convertString(filter: any): string {
    if (filter == null || filter == undefined) {
      filter = '';
    } else {
      filter = filter.trim();
    }

    return filter;
  }
}
