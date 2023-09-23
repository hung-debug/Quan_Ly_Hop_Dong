import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-delete-folder',
  templateUrl: './delete-folder.component.html',
  styleUrls: ['./delete-folder.component.scss']
})
export class DeleteFolderComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<DeleteFolderComponent>,
  public router: Router,
  public dialog: MatDialog,
  private contractFolderService: ContractFolderService,
  private spinner: NgxSpinnerService
) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.spinner.show();
    this.contractFolderService.deleteContractFolder(this.data.folderId).subscribe(
      (data) => {
        this.spinner.hide();
        this.toastService.showSuccessHTMLWithTimeout('Xóa thư mục thành công','',2000);
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-folder']);
        });
      },
      (error) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout('Xóa thư mục thất bại', '', 2000);
      }
    )
    
  }
}
