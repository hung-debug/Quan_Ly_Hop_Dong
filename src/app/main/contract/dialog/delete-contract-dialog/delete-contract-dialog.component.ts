import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-contract-dialog',
  templateUrl: './delete-contract-dialog.component.html',
  styleUrls: ['./delete-contract-dialog.component.scss']
})
export class DeleteContractDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DeleteContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractService : ContractService
    ) {
    }

  ngOnInit(): void {
  }

  onSubmit(){
    this.contractService.deleteContract(this.data.id).subscribe((data) => {

      if(data.success){
        this.toastService.showSuccessHTMLWithTimeout("Xóa tài liệu thành công!", "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract/create/draft']);
        });  
      }else{
        if(data.message == 'E02'){
          this.toastService.showErrorHTMLWithTimeout("Tài liệu không phải bản nháp!", "", 3000);
        }else{
          this.toastService.showErrorHTMLWithTimeout("Xóa tài liệu thất bại!", "", 3000);
        }
        
        this.dialogRef.close();
      }
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Xóa tài liệu thất bại", "", 3000);
      this.dialogRef.close();
    }
    );
  }

}
