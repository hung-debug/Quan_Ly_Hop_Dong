import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-add-connect-dialog',
  templateUrl: './add-connect-dialog.component.html',
  styleUrls: ['./add-connect-dialog.component.scss']
})
export class AddConnectDialogComponent implements OnInit {

  contractsD: any[] = [];
  name:any;
  sideB:any;
  created_at:any;

  idList:any[]=[];

  pD:number = 1;
  pageD:number = 3;
  pageStartD:number = 0;
  pageEndD:number = 0;
  pageTotalD:number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddConnectDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractService : ContractService,
    private changeDetector : ChangeDetectorRef) { 
      
    }
    
    ngOnInit(): void {
    this.pD = 1;
    this.pageD = 3;
    this.pageStartD = 0;
    this.pageEndD = 0;
    this.pageTotalD = 0;
    this.contractService.getDetailInforContract(this.data.id).subscribe(
      data => {
        data.refs.forEach((key : any, val: any) => {
          this.idList.push(key.ref_id);
        })
        
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
    this.getContractList();
  }

  onSubmit() {
    
    if(this.idList.length == 0){
      this.toastService.showErrorHTMLWithTimeout('Vui lòng chọn hợp đồng liên quan', "", 3000);
    }else{
      this.dialogRef.close();
      this.router.navigate([this.router.url])
      this.toastService.showSuccessHTMLWithTimeout('Thêm hợp đồng liên quan thành công', "", 3000);
    }
  }

  getContractList(){  
    //get list contract
    this.contractService.getContractList('off', '', "", "", "", "", "", 30, this.pD, this.pageD).subscribe(data => {
      this.contractsD = data.entities;
      this.pageTotalD = data.total_elements;
      
      if(this.pageTotalD == 0){
        this.pD = 0;
        this.pageStartD = 0;
        this.pageEndD = 0;
      }else{
        this.setPage();
      }
      this.contractsD.forEach((key : any, v: any) => {
        let participants = key.participants;
        //
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contractsD[v].sideA = key.name;
          }else{
            this.contractsD[v].sideB = key.name;
          }
          
        })
      });
      
      
    });
  }

  setPage(){
    this.pageStartD = (this.pD-1)*this.pageD+1;
    this.pageEndD = (this.pD)*this.pageD;
    if(this.pageTotalD < this.pageEndD){
      this.pageEndD = this.pageTotalD;
    }
  }
}
