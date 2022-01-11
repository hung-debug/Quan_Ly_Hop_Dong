import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { DetailContractComponent } from '../contract/detail-contract/detail-contract.component';
import {AddContractTypeComponent} from './add-contract-type/add-contract-type.component'
import { DetailContractTypeComponent } from './detail-contract-type/detail-contract-type.component';
@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private contractTypeService: ContractTypeService) { }

  code:any = "";
  name:any = "";
  list: any[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("contract-type.list");
    this.searchContractType();

    this.cols = [
      {header: 'contract-type.name', style:'text-align: left;' },
      {header: 'contract-type.code', style:'text-align: left;' },
      {header: 'contract-type.manage', style:'text-align: center;' },
      ];
  }

  searchContractType(){
    this.contractTypeService.getContractTypeList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response;
      console.log(this.list);
    });
  }

  addContractType() {
    const data = {
      title: 'contract-type.add'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddContractTypeComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  editContractType(id:any) {
    const data = {
      title: 'contract-type.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddContractTypeComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  detailContractType(id:any) {
    const data = {
      title: 'contract-type.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailContractTypeComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}
