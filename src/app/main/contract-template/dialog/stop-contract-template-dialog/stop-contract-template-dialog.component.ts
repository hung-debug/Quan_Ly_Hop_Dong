import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-stop-contract-template-dialog',
  templateUrl: './stop-contract-template-dialog.component.html',
  styleUrls: ['./stop-contract-template-dialog.component.scss']
})
export class StopContractTemplateDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<StopContractTemplateDialogComponent>,
  public router: Router,
  public dialog: MatDialog,
  private contractTemplateService: ContractTemplateService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.contractTemplateService.changeStatusContract(this.data.id, 32).subscribe((data) => {

      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract-template']);
      });
      this.dialogRef.close();
      this.toastService.showSuccessHTMLWithTimeout("Dừng phát hành mẫu tài liệu thành công!", "", 3000);
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Dừng phát hành mẫu tài liệu thất bại", "", 3000);
      return false;
    }
    );
  }

}
