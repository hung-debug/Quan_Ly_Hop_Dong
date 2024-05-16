import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-contract-connect-dialog',
  templateUrl: './contract-connect-dialog.component.html',
  styleUrls: ['./contract-connect-dialog.component.scss']
})
export class ContractConnectDialogComponent implements OnInit {

  datas: any [] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ContractConnectDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private toastService: ToastService,
    private contractService: ContractService) { 

    }

  ngOnInit(): void {
    this.contractService.getDetailInforContract(this.data.id).subscribe(
      data => {
        
        this.datas = data.refs;
        
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
