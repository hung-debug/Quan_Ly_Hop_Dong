import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      code: this.fbd.control("", [Validators.required]),
      note: this.fbd.control("", [Validators.required]),
    });
  }

  onSubmit() {
    const data = {
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      note: this.addForm.value.note,
    }
    this.unitService.addUnit(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò thành công!', "", 1000);
        this.dialogRef.close();
        this.router.navigate(['/main/unit']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }

}
