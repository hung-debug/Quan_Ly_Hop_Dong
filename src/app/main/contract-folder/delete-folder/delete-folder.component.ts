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
  countFolders: number = 0;
  countContracts: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DeleteFolderComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractFolderService: ContractFolderService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.countFolders = this.data.folder_or_contract.filter((item: any) => item.type == 0).length
    this.countContracts = this.data.folder_or_contract.filter((item: any) => item.type !== 0).length
  }

  onSubmit(){
    this.spinner.show();
    this.contractFolderService.deleteFolderItem(this.data).subscribe(
      (data) => {
        this.spinner.hide();
        if (this.countFolders > 0 && this.countContracts == 0) {
          this.toastService.showSuccessHTMLWithTimeout('Xóa thư mục thành công','',3000);
        } else if (this.countFolders == 0 && this.countContracts > 0) {
          this.toastService.showSuccessHTMLWithTimeout('Xóa tài liệu thành công','',3000);
        } else {
          this.toastService.showSuccessHTMLWithTimeout('Xóa thư mục/tài liệu thành công','',3000);
        }
        this.dialogRef.close('deleted');

        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //   this.router.navigate(['/main/contract-folder']);
        // });
      },
      (error) => {
        this.spinner.hide();
        if (this.countFolders > 0 && this.countContracts == 0) {
          this.toastService.showSuccessHTMLWithTimeout('Xóa thư mục thất bại','',3000);
        } else if (this.countFolders == 0 && this.countContracts > 0) {
          this.toastService.showSuccessHTMLWithTimeout('Xóa tài liệu thất bại','',3000);
        } else {
          this.toastService.showSuccessHTMLWithTimeout('Xóa thư mục/tài liệu thất bại','',3000);
        }
      }
    )
    
  }
}
