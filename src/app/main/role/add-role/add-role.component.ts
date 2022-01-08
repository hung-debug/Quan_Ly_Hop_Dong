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

  groupedCities: SelectItemGroup[];
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

    this.groupedCities = [
      {
        label: "Germany",
        value: "de",
        items: [
          { label: "Berlin", value: "Berlin" },
          { label: "Frankfurt", value: "Frankfurt" },
          { label: "Hamburg", value: "Hamburg" },
          { label: "Munich", value: "Munich" }
        ]
      },
      {
        label: "USA",
        value: "us",
        items: [
          { label: "Chicago", value: "Chicago" },
          { label: "Los Angeles", value: "Los Angeles" },
          { label: "New York", value: "New York" },
          { label: "San Francisco", value: "San Francisco" }
        ]
      },
      {
        label: "Japan",
        value: "jp",
        items: [
          { label: "Kyoto", value: "Kyoto" },
          { label: "Osaka", value: "Osaka" },
          { label: "Tokyo", value: "Tokyo" },
          { label: "Yokohama", value: "Yokohama" }
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
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò thành công!', "", 1000);
        this.dialogRef.close();
        this.router.navigate(['/main/unit']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }

}
