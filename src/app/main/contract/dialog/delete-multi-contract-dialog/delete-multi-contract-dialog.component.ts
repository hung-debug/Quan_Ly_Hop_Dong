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
    // this.spinner.show();
    //thay api xóa nhiều vào là được

    // this.contractService.deleteContract(this.data.id).subscribe((data) => {

    //   if(data.success){
    //     this.toastService.showSuccessHTMLWithTimeout('multi.delete.draft.success', "", 3000);
    //     this.dialogRef.close();
    //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //       this.router.navigate(['/main/contract/create/draft']);
    //     });
    //   }else{
    //     if(data.message == 'E02'){
    //       this.toastService.showErrorHTMLWithTimeout("Hợp đồng không phải bản nháp!", "", 3000);
    //     }else{
    //       this.toastService.showErrorHTMLWithTimeout('erorr.multi.delete.draft', "", 3000);
    //     }

    //     this.dialogRef.close();
    //   }
    // },
    // error => {
    //   this.toastService.showErrorHTMLWithTimeout('erorr.multi.delete.draft', "", 3000);
    //   this.dialogRef.close();
    // }
    // );
  }

}
