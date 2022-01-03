import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
    ) { 
    }

  ngOnInit(): void {
  }

  onSubmit(){
    this.dialogRef.close();
    this.toastService.showSuccessHTMLWithTimeout("Xóa hợp đồng thành công!", "", 10000);
  }

}
