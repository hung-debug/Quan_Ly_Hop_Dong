import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteContractDialogComponent } from 'src/app/main/contract/dialog/delete-contract-dialog/delete-contract-dialog.component';
import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-contract-folder',
  templateUrl: './delete-contract-folder.component.html',
  styleUrls: ['./delete-contract-folder.component.scss']
})
export class DeleteContractFolderComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DeleteContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractFolderService : ContractFolderService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.contractFolderService.deleteContractInFolder(this.data.folderId,this.data.contractId).subscribe((response: any) => {
      this.toastService.showSuccessHTMLWithTimeout("delete.contract-folder.success", "", 3000);
      this.dialogRef.close();
      // window.location.reload();
    })
  }

}
