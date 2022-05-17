import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { ToastService } from 'src/app/service/toast.service';
import {statusList} from '../../../../../config/variable'

@Component({
  selector: 'app-admin-filter-pack',
  templateUrl: './admin-filter-pack.component.html',
  styleUrls: ['./admin-filter-pack.component.scss']
})
export class AdminFilterPackComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  submitted = false;
  statusList: any[] = [];

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<AdminFilterPackComponent>,
    public router: Router,
    public dialog: MatDialog,
    ) { 

      this.addForm = this.fbd.group({
        filter_code: this.fbd.control(this.data.filter_code),
        filter_price:this.fbd.control(this.data.filter_price),
        filter_time: this.fbd.control(this.data.filter_time),
        filter_status: this.fbd.control(this.data.filter_status),
        filter_number_contract: this.fbd.control(this.data.filter_number_contract),
      });
    }

  ngOnInit(): void {
    this.addForm = this.fbd.group({
      filter_code: this.fbd.control(this.data.filter_code),
      filter_price:this.fbd.control(this.data.filter_price),
      filter_time: this.fbd.control(this.data.filter_time),
      filter_status: this.fbd.control(this.data.filter_status),
      filter_number_contract: this.fbd.control(this.data.filter_number_contract),
    });
    this.statusList = statusList;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      filter_code: this.addForm.value.filter_code,
      filter_price: this.addForm.value.filter_price,
      filter_time: this.addForm.value.filter_time,
      filter_status: this.addForm.value.filter_status,
      filter_number_contract: this.addForm.value.filter_number_contract,
    }
    this.dialogRef.close();
    console.log(data);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/admin-main/pack'],
      {
        queryParams: {
          'filter_code': data.filter_code, 
          'filter_price': data.filter_price,
          'filter_time': data.filter_time,
          'filter_status': data.filter_status,
          'filter_number_contract': data.filter_number_contract,
        },
        skipLocationChange: true
      });
    });
  }

}
