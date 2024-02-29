import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-add-connect-dialog',
  templateUrl: './confirm-upload-new-file-dialog.component.html',
  styleUrls: ['./confirm-upload-new-file-dialog.component.scss']
})

export class ConfirmUploadNewFileDialogComponent implements OnInit {
  
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ConfirmUploadNewFileDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractService : ContractService,
    private spinner: NgxSpinnerService,
    private changeDetector : ChangeDetectorRef) { 
      
    }
  
  ngOnInit(): void {
    
  }
  
  onSubmit(){
    this.spinner.show();
    this.data.isConfirmDelete = true;
    this.dialogRef.close("ok");
  }
  onClose(){
    this.dialogRef.close("cancel");
  }
}