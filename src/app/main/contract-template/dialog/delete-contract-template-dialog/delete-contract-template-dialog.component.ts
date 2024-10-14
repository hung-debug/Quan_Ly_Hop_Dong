import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-contract-template-dialog',
  templateUrl: './delete-contract-template-dialog.component.html',
  styleUrls: ['./delete-contract-template-dialog.component.scss']
})
export class DeleteContractTemplateDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DeleteContractTemplateDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractTemplateService: ContractTemplateService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.contractTemplateService.deleteContract(this.data.id).subscribe((data) => {

      if(data.success){
        this.toastService.showSuccessHTMLWithTimeout("Xóa mẫu tài liệu thành công!", "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-template']);
        });  
      }else{
        if(data.message == "E02"){
          this.toastService.showErrorHTMLWithTimeout("Không thể xóa mẫu tài liệu đã được sử dụng!", "", 3000);
          this.dialogRef.close();
        }else{
          this.toastService.showErrorHTMLWithTimeout("Xóa mẫu tài liệu thất bại!", "", 3000);
          this.dialogRef.close();
        }
      }
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Xóa mẫu tài liệu thất bại", "", 3000);
      return false;
    }
    );
  }
}
