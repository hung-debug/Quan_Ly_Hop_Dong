import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
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

  groupedRole: SelectItemGroup[];
  selectedCountries: any[];

  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    public router: Router,
    public dialog: MatDialog,) { 
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        note: "",
        selectedCountries: this.fbd.control([], [Validators.required]),
      });
    }

  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      code: this.fbd.control("", [Validators.required]),
      note: "",
      selectedCountries: this.fbd.control([], [Validators.required]),
    });

    this.groupedRole = [
      {
        label: "Nhóm chức năng hợp đồng",
        value: "HD",
        items: [
          { label: "Xem hợp đồng", value: "HD_01" },
          { label: "Thêm mới hợp đồng", value: "HD_02" },
          { label: "Sửa hợp đồng", value: "HD_03" },
          { label: "Từ chối hợp đồng", value: "HD_04" }
        ]
      },
      {
        label: "Nhóm chức năng mẫu hợp đồng",
        value: "MHD",
        items: [
          { label: "Xem mẫu hợp đồng", value: "MHD_01" },
          { label: "Thêm mới mẫu hợp đồng", value: "MHD_02" },
          { label: "Sửa mẫu hợp đồng", value: "MHD_03" }
        ]
      }
    ];
  }

  onSubmit() {
    this.submitted = true;
    const data = {
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      note: this.addForm.value.note,
      selectedCountries: this.addForm.value.selectedCountries,
    }
    console.log(data);
    console.log(this.addForm.invalid);
    if (this.addForm.invalid) {
      console.log(this.addForm.invalid);
      return;
    }
    this.unitService.addUnit(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò thành công!', "", 3000);
        this.dialogRef.close();
        this.router.navigate(['/main/unit']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
