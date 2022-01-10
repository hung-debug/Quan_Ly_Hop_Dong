import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-cancel-contract-dialog',
  templateUrl: './cancel-contract-dialog.component.html',
  styleUrls: ['./cancel-contract-dialog.component.scss']
})
export class CancelContractDialogComponent implements OnInit {

  addForm: FormGroup;

  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<CancelContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractService : ContractService,) { 

      this.addForm = this.fbd.group({
        reason: this.fbd.control("", [Validators.required]),
      });
    }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      id: this.data.id,
      reason: this.addForm.value.reason,
    }
    console.log(data);
    this.contractService.changeStatusContract(data.id, 32, data.reason).subscribe((data) => {

      console.log(JSON.stringify(data));
      this.dialogRef.close();
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract/create/cancel']);
      });
      this.toastService.showSuccessHTMLWithTimeout("Hủy hợp đồng thành công!", "", 3000);
      },
      error => {
        this.toastService.showErrorHTMLWithTimeout("Hủy hợp đồng thất bại!", "", 3000);
        return false;
      }
    );
  }

}
