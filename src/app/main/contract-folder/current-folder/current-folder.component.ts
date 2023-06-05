import { Component, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { ContractFolderService } from 'src/app/service/contract-folder.service';

@Component({
  selector: 'app-current-folder',
  templateUrl: './current-folder.component.html',
  styleUrls: ['./current-folder.component.scss']
})
export class CurrentFolderComponent implements OnInit {
  action: string;
  status: string;
  type: string;
  private sub: any;
  public contracts: any[] = [];
  p: number = 1;
  page: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;

  roleMess: any = "";
  id: number;

  constructor(
    private router: Router,
    private contractFolderService : ContractFolderService
    
  ) { }

  ngOnInit(): void {
    this.sub = this.router.routerState.root.queryParams.subscribe(params => {
      this.action = params['action'];
      this.status = params['status'];
      this.type = params['type'];
      this.id = params['id'];
      this.getContractList();
    });
  }

  openDetail(id: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + id],
      {
        queryParams: {
          'action': this.action
        },
        skipLocationChange: false
      });
    });
  }

  getContractList() {
    this.pageTotal = 0;
    this.roleMess = "";
    this.roleMess = "Danh sách hợp đồng của tôi chưa được phân quyền";


      //get list contract
      // this.contractFolderService.getContractList(isOrg, this.organization_id, this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
      //   this.contracts = data.entities;
      //   this.pageTotal = data.total_elements;
      //   if (this.pageTotal == 0) {
      //     this.p = 0;
      //     this.pageStart = 0;
      //     this.pageEnd = 0;
      //   } else {
      //     this.setPage();
      //   }
      //   const checkedDownloadFiles = this.dataChecked.map(el=>el.selectedId)
      //   
      //   for(let i = 0; i< this.contracts.length; i++){
      //     let checkIf = checkedDownloadFiles.some(el => el === this.contracts[i].id)
      //     if(checkIf){
      //       this.contracts[i].checked = true;
      //     } else {
      //       this.contracts[i].checked = false;
      //     }
      //   }
      // });
    }
  

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

}

