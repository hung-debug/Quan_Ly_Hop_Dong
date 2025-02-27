import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-contract-connect-dialog',
  templateUrl: './contract-connect-dialog.component.html',
  styleUrls: ['./contract-connect-dialog.component.scss']
})
export class ContractConnectDialogComponent implements OnInit {

  datas: any [] = [];
  isLoading: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<ContractConnectDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private contractService: ContractService) { 

    }

  ngOnInit(): void {
    this.spinner.show();
    this.contractService.getDetailInforContract(this.data.id).subscribe(
      data => {
        
        this.datas = data.refs;
        this.isLoading = false;
        this.spinner.hide();
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        this.isLoading = false;
      }
    )
  }
  
  openOrDownloadFile(item: any){
    let currentUrl: string = ""
    this.contractService.getFileContract(item.contract_id).subscribe(
      res => {
        let fileName = res.filter(
          (p: any) => p.type == 2 && p.status == 1
        )[0]?.path ?? res.filter(
          (p: any) => p.type == 1 && p.status == 1
        )[0].filename
        const extension = fileName.split(".").pop()
        currentUrl = res.filter(
          (p: any) => p.type == 2 && p.status == 1
        )[0]?.path ?? res.filter(
          (p: any) => p.type == 1 && p.status == 1
        )[0]?.path
        if (extension?.toLowerCase() == "txt") {
          window.open(currentUrl)
        } else {
          window.open(currentUrl.replace("/tmp/","/tmp/v2/"))
        }
      }
    )
  }
  
  openPdf(item: any) {
    this.openOrDownloadFile(item);
  }

}
