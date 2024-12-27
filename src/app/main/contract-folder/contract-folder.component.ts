import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { ContractFolderService } from '../../service/contract-folder.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { event } from 'jquery';
import { ContractService } from 'src/app/service/contract.service';
import { UploadContractFileComponent } from './current-folder/upload-contract-file/upload-contract-file.component';
import { ToastService } from 'src/app/service/toast.service';
import { sideList } from 'src/app/config/variable';
import { AddContractFolderComponent } from './current-folder/add-contract-folder/add-contract-folder.component';


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
  haveContract: boolean = false;
  list: any[] = [];
  isViewFolder: boolean = false;
  isViewChildFolder: boolean = false;
  p: number = 1;
  page: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  pagination: any = {
    pageNumber: 0,
    pageSize: 10, 
  };
  folderNameInput: any = "";
  keyword: string = "";
  pathData: any[] = [];
  foldersData: any;
  isOrg: string = "off";
  isFolder: boolean = false;
  isContract: boolean = false;
  currentParentId: number = 0;
  size: number = 0;
  checkedAll: boolean = false;
  searchName: string = "";
  pageDownload: number = 10;
  inputTimeout: any
  numberPage: number;
  enterPage: number = 1;

  constructor(
    private appService: AppService,
    private contractFolderService: ContractFolderService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private contractService: ContractService,
    private toastService : ToastService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (typeof params.size != 'undefined' && params.size
      ) {
        this.page = params.size;
      }

      if (typeof params.currentParentId != 'undefined' && params.currentParentId
      ) {
        this.currentParentId = params.currentParentId;
      }

      if (typeof params.page != 'undefined' && params.page
      ) {
        this.p = parseFloat(params.page) + 1;
      }

      if (typeof params.filter_name != 'undefined' && params.filter_name
      ) {
        this.searchName = params.filter_name;
      }
    });
    this.isViewFolder = true;
    this.appService.setTitle("contract.folder");
    this.appService.setSubTitle("");
    this.cols = [
      {header: 'Tên', style:'text-align: left;', class:'col-md-5' },
      {header: 'Ngày tạo', style:'text-align: left;', class:'col-md-5'},
      {header: 'contract-type.manage', style:'text-align: center;',class:'col-md-2'},
    ];
    this.getContractList(this.currentParentId)
  }
  

  openFolder(item: any){
    if (item.type == '0') {
      this.p = 1
      this.searchName = ""
      this.pagination.pageNumber = 0
      this.folderNameInput = ""
      this.currentParentId = item.id
      this.getContractList(item.id)
    } else if (item.type == '1') {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/form-contract/detail/' + item.id],
        {
          queryParams: {
            'page': this.p - 1,
            'filter_type': 'contract-folder',
            'filter_contract_no':'',
            'filter_from_date': '',
            'filter_to_date': '',
            'isOrg': 'off',
            'organization_id': '',
            'status': '',
            'size': this.page,
            'filter_name': this.searchName?.trim(),
            'currentParentId': this.currentParentId
          },
          skipLocationChange: false
        });
      });
    } else {
      let currentUrl: string = ""
      this.contractService.getFileContract(item.id).subscribe(
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
  }

  autoSearch(event: any) {
    this.p = 1;
    this.foldersData = []
    this.getContractList(this.currentParentId)
    this.folders = this.list.filter((item: any) => item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    if (this.pageTotal == 0) {
      this.p = 1;
      this.pageStart = 0;
      this.pageEnd = 0;
    } else {
      this.setPage();
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
    this.contractFolderService.getContractFoldersList(id).subscribe(
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
      data: {
        id: this.currentParentId
      }
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });

    matDialogRef.afterClosed().subscribe((item) => {
      // this.getFolderList();
      if (item) {
        this.p = 1
        this.getContractList(this.currentParentId)
        this.spinner.hide();
      }
    })
  }

  editFolder(item: any){
    let data = {
      action: 'edit',
      data: item
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });

    matDialogRef.afterClosed().subscribe((value) => {
      // this.getContractList(this.currentParentId)
      if (value == 'edited') {
        this.getContractList(this.currentParentId)
        this.spinner.hide();
      }
    });
  }

  openDetailFolder(details: any){
    let data = {
      action: 'openDetail',
      data: details
    }
    const matDialogRef = this.dialog.open(AddFolderComponent, {
      width: '500px',
      data: data
    });
  }

  deleteFolder(value: any){
    value.parentId = this.currentParentId

    const removeData: any = {
      folder_id: this.currentParentId,
      folder_or_contract: []
          // {
          //     id: itemData.id,
          //     type: itemData.type
          // }
    }
    value.forEach((item: any) => {
      removeData.folder_or_contract.push({
        id: item.id,
        type: item.type
      })
    })
    const matDialogRef = this.dialog.open(DeleteFolderComponent, {
      width: '500px',
      data: removeData,
      autoFocus: false
    })

    matDialogRef.afterClosed().subscribe((res: any) => {
      if (res == 'deleted') {
        this.p = 1
        this.getContractList(this.currentParentId)
      }
    })

  }

  getDateTime(item: any){
    let formattedDate = this.contractFolderService.convertDateTime(item);
    return formattedDate;
  }

  async getContractList(folderId?: number) {
    if (this.p < 1) {
      this.p = 1
    }
    if (folderId) this.currentParentId = folderId
    this.checkedAll = false;
    this.enterPage = this.p;
    this.contractFolderService.getContractInFolder(folderId, this.searchName?.trim(), this.p - 1, this.page).subscribe((response: any) => {
      this.getCurrentPathData(response)
      if (folderId == 0) {
        this.isViewFolder = true
        this.isViewChildFolder = false
        this.foldersData = response.result.content
        this.folders = response.result.content
      } else {
        this.isViewChildFolder = true
        this.isViewFolder = false
        this.foldersData = response.result.content
        this.folders = response.result.content
      }

      (response.result ? response.result.content : response.result.content).forEach((item: any) => {
        item.checked = false;
        if (item.type == 0 || !item.type) {
          item.isFolder = true
        } else if (item.type == 1) {
          item.isContract = true
          this.getContractStatus(item.contract)
        } else if (item.type == 2) {
          item.isManualContract = true
          item.isContract = true
        }
      })

      // this.contracts = response.entities;
      this.pageTotal = response.result.totalElements;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
    })
  }

  backToFolder(folderId: any) {
    this.searchName = ""
    this.getContractList(folderId)
  }

  back() {
    this.searchName = ""
    this.p = 1
    this.getContractList(0)
    this.currentParentId = 0
    // this.isViewChildFolder = false
    // this.isViewFolder = true
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

  editContractData(data?: any) {
    this.contractService.getFileContract(data.id).subscribe(
      res => {
          data.filename = res.filter(
            (p: any) => p.type == 2 && p.status == 1
          )[0]?.filename;
          let dataShare: any = {
            folderId: this.currentParentId,
            dataShare: data
          }
          dataShare.action = "edit"
          let dialogRef = this.dialog.open(UploadContractFileComponent, {
            width: '620px',
            data: dataShare,
          })

          dialogRef.afterClosed().subscribe(
            res => {
              if (['created','edit'].includes(res))
              this.getContractList(this.currentParentId);
            }
          )
      },
      err => {
        this.toastService.showErrorHTMLWithTimeout("Lấy dữ liệu file tài liệu lỗi","",3000)
      }
    )
  }

  getNameOrganization(item: any, index: any) {
    if(item.type == 3 && item.recipients.length > 0)
      return sideList[index].name + " : " + item.recipients[0].name;
    return sideList[index].name + " : " + item.name;
  }

  sortParticipant(list: any) {
    return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
    // return list
  }

  openDetail(item: any) {
    let currentUrl: string = ""
    if (item.status == 35) {
      this.contractService.getFileContract(item.id).subscribe(
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
    } else {
      // this.action = "folder";
      // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      //   this.router.navigate(['/main/form-contract/detail/' + item.id],
      //   {
      //     queryParams: {
      //       'action': this.action,
      //       'folderId': this.parentId,
      //       'folderName': this.activatedRoute.snapshot.params['name']
      //     },
      //     skipLocationChange: false
      //   });
      // });
    }
  }

  uploadContract() {
    let dataShare = {
      folderId: this.currentParentId,
      action: "create"
    }
    let dialogRef = this.dialog.open(UploadContractFileComponent, {
      width: '620px',
      data: dataShare,
    })
    dialogRef.afterClosed().subscribe(
      res => {
        if (['created','edit'].includes(res)) {
          this.p = 1
          this.getContractList(this.currentParentId);
        }
      }
    )
  }

  addContract(){
    const matDialogRef = this.dialog.open(AddContractFolderComponent, {
      width: '1200px',
      data: {
        folderId: this.currentParentId
      }
    });
    matDialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.p = 1
        this.getContractList(this.currentParentId)
      }
    })
  }

  getCurrentPathData(data: any) {
    this.pathData = []
    if (data.currentPathId) {
      let pathIds = data.currentPathId.split(".")
      let pathNames = data.currentPath.split("/")
      pathIds.forEach((element: any, index: number) => {
        this.pathData.push({
          id: element,
          name: pathNames[index]
        })
      });
    } else {
      this.pathData = []
    }
  }

  multiDeleteAction: string = 'isDelele' || 'confirmDelete';
  isMultiDelete: boolean = false;
  multiDelete(value: any) {
    this.multiDeleteAction = 'isDelete'
    this.selectedItems = this.foldersData.filter((item: any) => item.checked)
    if (this.selectedItems.length > 0) {
      this.isMultiDelete = true
      this.deleteFolder(this.selectedItems)
    } else {
      if (this.currentParentId == 0) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng chọn thư mục cần xóa','',3000)
      } else {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng chọn thư mục/tài liệu cần xóa','',3000)
      }
    }
  }

  selectedItems: any[] = []
  toggleDownload(value: any) {
    this.selectedItems = []
    if (!value) {
      this.foldersData.forEach((element: any) => {
        element.checked = true
        this.selectedItems.push({
          id: element.id,
          type: element.type
        })
      })
    } else {
      this.foldersData.forEach((element: any) => {
        element.checked = false
      })
    }
  }

  count: number = 0
  selectItem(item: any) {
    if (item.checked == true) {
      this.count++
    } else {
      this.count--
    }

    if (this.count == this.foldersData.length) {
      this.checkedAll = true
    } else {
      this.checkedAll = false
    }
  }

  async pageChange() {
    await this.setPage()
    await this.getContractList(this.currentParentId)
  }

  async setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  getContractStatus(contractData: any) {
    const oneDay = 24*60*60*1000
    let currentDate: any = new Date()
    contractData.sign_time = new Date(contractData.sign_time)
    let countDays = Math.abs(contractData.sign_time - currentDate)/oneDay
    if (contractData.status == 20) {
      if (contractData.sign_time > currentDate && countDays <= 5) {
          contractData.status = 33
      } else if (contractData.sign_time < currentDate) {
        contractData.status = 34
      }
    } else if (contractData.liquidationContractId) {
      contractData.status = 40
    }
  }

  onInput(event: any) {
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.autoSearchEnterPage(event);
    }, 1000);
  }

  validateInput(event: KeyboardEvent) {
    const input = event.key;
    if (input === ' ' || (isNaN(Number(input)) && input !== 'Backspace')) {
      event.preventDefault();
    }
  }
  
  autoSearchEnterPage(event: any) {
    if(event.target.value && event.target.value != 0 && event.target.value <= this.numberPage) {
      this.p = this.enterPage;
    } else {
      this.enterPage = this.p;
    }
    this.pageChange();
  }
  
  countPage() {
    this.numberPage = Math.ceil(this.pageTotal / this.page);
    return this.numberPage;
  }
}
