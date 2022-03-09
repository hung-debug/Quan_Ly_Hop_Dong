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

      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract-template']);
      });
      this.dialogRef.close();
      this.toastService.showSuccessHTMLWithTimeout("Xóa mẫu hợp đồng thành công!", "", 3000);
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Xóa mẫu hợp đồng thất bại", "", 3000);
      return false;
    }
    );
  }
}
