import { AddContractFolderComponent } from './add-contract-folder/add-contract-folder.component';
import { AppService } from './../../../service/app.service';
import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { MatDialog } from '@angular/material/dialog';
import { sideList } from 'src/app/config/variable';
import { DeleteContractDialogComponent } from '../../contract/dialog/delete-contract-dialog/delete-contract-dialog.component';
import { DeleteContractFolderComponent } from './delete-contract-folder/delete-contract-folder.component';

@Component({
  selector: 'app-current-folder',
  templateUrl: './current-folder.component.html',
  styleUrls: ['./current-folder.component.scss']
})
export class CurrentFolderComponent implements OnInit {
  action: string;
  status: string = '';
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
  parentId: number | undefined = undefined;
  keyword: string = '';

  constructor(
    private router: Router,
    private contractFolderService : ContractFolderService,
    private activatedRoute : ActivatedRoute,
    private appService: AppService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.parentId = params.id;

      this.appService.setTitle(this.activatedRoute.snapshot.params['name'])
      this.getContractList();
    });

   
  }

  openDetail(id: number) {
    this.action = "folder";
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + id],
      {
        queryParams: {
          'action': this.action,
          'folderId': this.parentId,
          'folderName': this.activatedRoute.snapshot.params['name']
        },
        skipLocationChange: false
      });
    });
  }

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
      data: {
        folderId: this.parentId
      }
    });
  }

  //api danh sách hợp đồng trong thư mục
  getContractList() {
    this.contractFolderService.getContractInFolder(this.parentId,this.keyword).subscribe((response: any) => {
      this.contracts = response.entities;
      this.pageTotal = response.total_elements;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
    })
  }

  deleteContract(contractId: number) {
    let data: any = "";

    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN XÓA HỢP ĐỒNG TRONG THƯ MỤC',
        contractId: contractId,
        folderId: this.parentId
      };
    } else if (sessionStorage.getItem('lang') == 'en') {
      data = {
        title: 'CONTRACT DELETE CONFIRMATION IN FOLDER',
        contractId: contractId,
        folderId: this.parentId
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractFolderComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getContractList();
    })
  }

  sortParticipant(list: any) {
    return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
  }

  autoSearch(event: any) {
    this.keyword= event.target.value;
    this.getContractList();
  }
    
  getNameOrganization(item: any, index: any) {
    if(item.type == 3 && item.recipients.length > 0)
      return sideList[index].name + " : " + item.recipients[0].name;
    return sideList[index].name + " : " + item.name;
  }

  getPageStartEnd() {
    const temp: number = this.pageStart;
    if(this.pageStart < 0) {
      this.pageStart = 1;
      this.pageEnd = Math.abs(temp) + 1;
    }
    if (this.pageTotal <= this.pageEnd && this.pageTotal > 0) {
      this.pageEnd = this.pageTotal;
    }
    return this.pageStart + '-' + this.pageEnd;
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

