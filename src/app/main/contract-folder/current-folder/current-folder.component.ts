import { AddContractFolderComponent } from './add-contract-folder/add-contract-folder.component';
import { AppService } from './../../../service/app.service';
import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { MatDialog } from '@angular/material/dialog';
import { sideList } from 'src/app/config/variable';

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
  isOrg: string = "off";

  constructor(
    private router: Router,
    private contractFolderService : ContractFolderService,
    private activatedRoute : ActivatedRoute,
    private appService: AppService,
    private dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['name'])
    this.appService.setTitle(this.activatedRoute.snapshot.params['name'])
    this.getContractList();
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

  // getContractList() {
  //   this.pageTotal = 0;
  //   this.roleMess = "";
  //   this.roleMess = "Danh sách hợp đồng của tôi chưa được phân quyền";


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
    // }
  

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  addContract(){
    const matDialogRef = this.dialog.open(AddContractFolderComponent, {
      width: '1200px',
    });
  }
  getContractList() {
    this.contractFolderService.getContractCreatedList('', this.status, this.p, 5).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
    });
    }

    sortParticipant(list: any) {
      return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
    }
    
    getNameOrganization(item: any, index: any) {
      if(item.type == 3 && item.recipients.length > 0)
        return sideList[index].name + " : " + item.recipients[0].name;
      return sideList[index].name + " : " + item.name;
    }

    getNameStatusCeca(status: any, ceca_push: any, ceca_status: any) {
      if (status == 30) {
        if (ceca_push == 0) {
          return "";
        } else if (ceca_push == 1) {
          if (ceca_status == -1) {
            return "[Gửi lên CeCA thất bại]";
          } else if (ceca_status == 1) {
            return "[Chờ BCT xác thực]";
          } else if (ceca_status == -2) {
            return "[Xác thực thất bại]";
          } else if (ceca_status == 0) {
            return "[BCT xác thực thành công]";
          } else {
            return "[Chưa gửi lên CeCA]";
          }
        }
        return "[Không xác định]";
      }
      return "";
    }

}

