import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.dialogRef.close();
    this.toastService.showSuccessHTMLWithTimeout("Dừng phát hành mẫu hợp đồng thành công!", "", 3000);
  }

}
