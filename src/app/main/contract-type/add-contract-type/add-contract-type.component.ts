import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
  styleUrls: ['./add-contract-type.component.scss']
})
export class AddContractTypeComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddContractTypeComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.datas = this.data;
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      code: this.fbd.control("", [Validators.required])
    });
  }

  onSubmit() {
    const data = {
      name: this.addForm.value.name,
      code: this.addForm.value.code,
    }
    this.contractTypeService.addContractType(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Thêm mới loại hợp đồng thành công!', "", 1000);
        this.dialogRef.close();
        this.router.navigate(['/main/contract-type']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }

}
