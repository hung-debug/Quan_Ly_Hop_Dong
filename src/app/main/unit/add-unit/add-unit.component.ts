import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddUnitComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      short_name: this.fbd.control("", [Validators.required]),
      code: this.fbd.control("", [Validators.required]),
      email: null,
      phone: null,
      fax: null,
      status: 1,
      parent_id: null,
    });
  }

  onSubmit() {
    const data = {
      name: this.addForm.value.name,
      short_name: this.addForm.value.short_name,
      code: this.addForm.value.code,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      fax: this.addForm.value.fax,
      status: this.addForm.value.status,
      parent_id: this.addForm.value.parent_id,
    }
    this.unitService.addUnit(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới tổ chức thành công!', "", 1000);
        this.dialogRef.close();
        this.router.navigate(['/main/unit']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }

}
