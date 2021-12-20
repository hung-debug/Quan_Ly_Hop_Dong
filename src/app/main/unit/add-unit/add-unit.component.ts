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

    //lay du lieu form cap nhat
    if( this.data.id != null){
      this.unitService.getUnitById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            name: this.fbd.control(data.name, [Validators.required]),
            short_name: this.fbd.control(data.short_name, [Validators.required]),
            code: this.fbd.control(data.code, [Validators.required]),
            email: this.fbd.control(data.email, [Validators.required]),
            phone: this.fbd.control(data.phone, [Validators.required]),
            fax: this.fbd.control(data.fax),
            status: this.fbd.control(data.status),
            parent_id: this.fbd.control(data.parent_id),
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )

    //khoi tao form them moi
    }else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        short_name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required]),
        phone: this.fbd.control("", [Validators.required]),
        fax: null,
        status: 1,
        parent_id: null,
      });
    }
  }

  onSubmit() {
    const data = {
      id: "",
      name: this.addForm.value.name,
      short_name: this.addForm.value.short_name,
      code: this.addForm.value.code,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      fax: this.addForm.value.fax,
      status: this.addForm.value.status,
      parent_id: this.addForm.value.parent_id,
    }
    console.log(data);
    if(this.data.id !=null){
      data.id = this.data.id;
      this.unitService.updateUnit(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 1000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/unit']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )
    }else{
      this.unitService.addUnit(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 1000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/unit']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )
    }
  }

}
