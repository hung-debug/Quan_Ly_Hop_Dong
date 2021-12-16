import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private userService : UserService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
      phone: this.fbd.control("", [Validators.required]),
      organizationId: null,
      birthday: null,
      role: null,
      status: 1,
    });
  }

  onSubmit() {
    const data = {
      name: this.addForm.value.name,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      organizationId: this.addForm.value.organizationId,
      birthday: this.addForm.value.birthday,
      role: this.addForm.value.role,
      status: this.addForm.value.status,
    }
    this.userService.addUser(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới người dùng thành công!', "", 1000);
        this.dialogRef.close();
        this.router.navigate(['/main/unit']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }
}
