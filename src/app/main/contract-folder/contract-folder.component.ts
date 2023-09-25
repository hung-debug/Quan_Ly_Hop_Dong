import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { Folder, ContractFolderService } from '../../service/contract-folder.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { event } from 'jquery';


@Component({
  selector: 'app-contract-folder',
  templateUrl: './contract-folder.component.html',
  styleUrls: ['./contract-folder.component.scss']
})



export class ContractFolderComponent implements OnInit {

  @Input() datas: any;
  
  folders :any[] = [];
  cols : any[];
  parent_id_list_name: any[]=[];
  currentFolders: Folder[]=[];
  haveContract: boolean = false;
  list: any[] = [];

  constructor(
    private appService: AppService,
    private contractFolderService: ContractFolderService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("contract.folder");
    this.cols = [
      {header: 'Tên', style:'text-align: left;', class:'col-md-5' },
      {header: 'Ngày tạo', style:'text-align: left;', class:'col-md-5'},
      {header: 'contract-type.manage', style:'text-align: center;',class:'col-md-2'},
    ];
        
    this.contractFolderService.getContractFoldersList().subscribe((data) => 
    {
        this.list = data.filter((folder: any) => folder.parentId == 0).sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.folders = this.list;
    })
  }
  

  openFolder(item: any){
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate(['/main/my-folder', item.name],
      {
        queryParams: {
          id: item.id
        },
        skipLocationChange: false
      });
    });
  }

  autoSearch(event: any) {
    this.folders = this.list.filter((item: any) => item.name.includes(event.target.value));
  }

  checkLastChildFolderBreadcrumber(folder: any, folders: any){
    if(folder == folders[folders.length-1]){
      return true;
    } else {
      return false;
    }
  }
  
  checkHaveContract(id: any){
    this.contractFolderService.getContractFoldersList().subscribe(
      (data) => {
        let folder = data.filter((folder: any) => folder.id == id)[0];
        
        if(folder.contracts && folder.contracts.length > 0){
          
          return true;
        }
      }
    );
    return false;
  }

  addFolder(){
    let data = {
      action: 'add',
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });

    matDialogRef.afterClosed().subscribe((item) => {
      this.getFolderList();
      this.spinner.hide();
    })
  }

  editFolder(id: number | undefined){
    let data = {
      action: 'edit',
      folderId: id
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });

    matDialogRef.afterClosed().subscribe((item) => {
      this.getFolderList();
      this.spinner.hide();
    });
  }

  getFolderList(){
    this.contractFolderService.getContractFoldersList().subscribe((data) => 
    {
        this.folders = data.filter((folder: any) => folder.parentId == 0).sort((a: any, b: any) => a.name.localeCompare(b.name));
    })
  }

  openDetailFolder(id: number){
    let data = {
      action: 'openDetail',
      folderId: id
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });
  }

  deleteFolder(id: number){
    let data = {
      folderId: id
    }

    const matDialogRef = this.dialog.open(DeleteFolderComponent, {
      width: '500px',
      data: data
    })

  }

  getDateTime(item: string){
    let formattedDate = this.contractFolderService.convertDateTime(item);
    return formattedDate;
  }
}
