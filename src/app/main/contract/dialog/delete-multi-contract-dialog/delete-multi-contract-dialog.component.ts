import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-delete-multi-contract-dialog',
  templateUrl: './delete-multi-contract-dialog.component.html',
  styleUrls: ['./delete-multi-contract-dialog.component.scss']
})
export class DeleteMultiContractDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DeleteMultiContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private contractService : ContractService
    ) {
    }

  ngOnInit(): void {
  }

  onSubmit(){
    this.spinner.show();

    this.contractService.deleteMultiContract(this.data.contractIds).subscribe((data) => {

      if(data.success){
        this.toastService.showSuccessHTMLWithTimeout('multi.delete.draft.success', "", 3000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract/create/draft']);
        });
      }else{
        this.spinner.hide()
        this.toastService.showErrorHTMLWithTimeout('error.multi.delete.draft', "", 3000);
      }
      this.dialogRef.close();
    },
    (error: any) => {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout('error.multi.delete.draft', "", 3000);
      this.dialogRef.close();
    });
  }

}
