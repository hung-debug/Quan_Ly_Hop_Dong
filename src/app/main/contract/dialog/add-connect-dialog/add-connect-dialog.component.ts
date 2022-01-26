import { Component, Inject, OnInit } from '@angular/core';
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

  contracts: any[] = [];
  name:any;
  sideA:any;
  sideB:any;
  created_at:any;

  idList:any[]=[];

  p:number = 1;
  page:number = 3;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddConnectDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private contractService : ContractService) { 

    }

  ngOnInit(): void {
    this.contractService.getDetailInforContract(this.data.id).subscribe(
      data => {
        data.refs.forEach((key : any, val: any) => {
          this.idList.push(key.ref_id);
        })
        console.log(this.idList);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
    this.getContractList();
  }

  onSubmit() {
    console.log(this.idList);
    if(this.idList.length == 0){
      this.toastService.showErrorHTMLWithTimeout('Vui lòng chọn hợp đồng liên quan', "", 3000);
    }else{
      this.dialogRef.close();
      this.router.navigate([this.router.url])
      this.toastService.showSuccessHTMLWithTimeout('Thêm hợp đồng liên quan thành công', "", 3000);
    }
  }

  private getContractList(){
    this.p = 1;
    //get list contract
    this.contractService.getContractList("", "", "", "", 30, "", "").subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = this.contracts.length;
      console.log(this.contracts);
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }
      this.contracts.forEach((key : any, v: any) => {
        let participants = key.participants;
        //console.log(participants);
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          }else{
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
      });
      console.log(this.contracts);
      console.log(this.pageTotal);
    });
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  autoSearch(name:any, sideA:any, sideB:any, create_at:any){
    this.p = 1;
    this.contractService.getContractList("", "", "", "", 30, "", "").subscribe(data => {
      this.contracts = data.entities;

      this.contracts.forEach((key : any, v: any) => {
        let participants = key.participants;
        console.log(participants);
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          }else{
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
      });

      this.contracts = this.transform(this.contracts, name, sideA, sideB, create_at);
      this.pageTotal = this.contracts.length;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }

    });
  }

  transform(contracts:any, name:any, sideA:any, sideB:any, create_at:any):any[]  {
    if (!contracts) {
      return [];
    }
    if (!name && !sideA && !sideB && !create_at) {
      return contracts;
    }
    console.log("name:" + name);
    console.log("sideA:" + sideA);
    console.log("create_at:" + create_at);
    return contracts.filter((it:any) => {
      console.log(it);
      console.log(it.sideA);
      return (
        (name != ''?it.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()):it)
      && (sideA!=''?it.sideA.toLocaleLowerCase().includes(sideA.toLocaleLowerCase()):it)
      && (sideB!=''?it.sideB.toLocaleLowerCase().includes(sideB.toLocaleLowerCase()):it)
      );
    });
  }

}
