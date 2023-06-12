import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { Folder, ContractFolderService } from '../../service/contract-folder.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddFolderComponent } from './add-folder/add-folder.component';


@Component({
  selector: 'app-contract-folder',
  templateUrl: './contract-folder.component.html',
  styleUrls: ['./contract-folder.component.scss']
})



export class ContractFolderComponent implements OnInit {

  @Input() datas: any;
  
  folders :Folder[] = [];
  cols : any[];
  parent_id_list_name: any[]=[];
  currentFolders: Folder[]=[];
  haveContract: boolean = false;
  folderLevel: number = 0;


  constructor(
    private appService: AppService,
    private contractFolderService: ContractFolderService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.appService.setTitle("contract.folder");
    this.cols = [
      {header: 'Tên', style:'text-align: left;', class:'col-md-5' },
      {header: 'Ngày tạo', style:'text-align: left;', class:'col-md-5'},
      {header: 'contract-type.manage', style:'text-align: center;',class:'col-md-2'},
    ];

    this.route.params.subscribe(params => {
      const id = params['id'];
      
      if(id){
        this.contractFolderService.getContractFoldersList().subscribe(
          (data) => {
            this.folders = data.filter((folder: any) => folder.parentId == id);
            
          })
        
        this.contractFolderService.getContractFolderName().subscribe(
          (data) => {
            this.currentFolders = [];
            let currentFolder = data.filter((folder: any) => folder.id == id)[0];
            this.currentFolders.push(currentFolder);
            let parentId = currentFolder.parentId;
            while(parentId != null){
              let parentFolder = data.filter((folder: any) => folder.id == parentId)[0];
              this.currentFolders.push(parentFolder);
              parentId = parentFolder.parentId;
            }
            this.currentFolders.reverse();
            this.folderLevel = this.currentFolders.length;
            
          }
        )
        
      } else {
        this.contractFolderService.getContractFoldersList().subscribe(
          (data) => {
            this.folders = data.filter((folder: any) => folder.parentId == null);
          })
        this.parent_id_list_name = [];
      }

    });

    this.folders = [
      {
        id: 3,
        name: "Hợp đồng 2024",
        contracts: [],
        parentId: undefined
      },
      {
        id: 4,
        name: "Tháng 1",
        contracts: [
          24194,
          24183
        ],
        parentId: undefined
      },
      {
        id: 5,
        name: "Hợp đồng 2023",
        contracts: [],
        parentId: undefined
      }
    ]
    // if(!this.datas){
    //   this.folders = [];
    //   this.folders = this.treeFolderService.getFolders();  
    //   
    // } else if(this.datas){
    //   this.childrenFolder = this.datas;
    //   this.folders = this.childrenFolder;
    // }

  }
  
  
  openFolder(id: any){
    if(!this.checkHaveContract(id)){
    this.router.navigate(['/main/contract-folder', id]);
    
    } else {
      
      this.router.navigate(['/main/contract-folder/c/', id]);
    }
    
    
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
}
