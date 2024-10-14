import { NgxSpinnerService } from 'ngx-spinner';
import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { contractTypes, sideList } from 'src/app/config/variable';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-add-contract-folder',
  templateUrl: './add-contract-folder.component.html',
  styleUrls: ['./add-contract-folder.component.scss']
})
export class AddContractFolderComponent implements OnInit {
  @ViewChild('scrollableDiv') scrollableDiv: ElementRef;
  @ViewChild('parent') parent: ElementRef;


  action: string;
  title: string ="";
  contractTypes: any[] = contractTypes;
  selectedContractType: any;
  selectedContract: number[] = [];

  status: number = 999;
  parentId: number = 999;
  type: string;
  private sub: any;
  public contracts: any[] = [];

  p1: number = 0;
  page: number = 5;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';
  showClearValue: boolean = true;

  id: any = "";
  notification: any = "";
  isOrg: string = 'off';
  
  stateOptions: any[];
  organization_id: any = "";

  //filter contract
  searchObj: any = {
    filter_name: "",
    partner: ""
  }
  filter_name: any = "";
  partner: any = "";
  filter_type: any = "";
  filter_contract_no: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";
  filter_status: any = "";
  filter_remain_day: any = "";
  filter_is_org_me_and_children: any = "";
  message: any;
  roleMess: any = "";
  checkedAll: boolean = false;
  typeDisplay: string = 'view';

  defaultSize: number = 5;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddContractFolderComponent>,
    public dialog : MatDialog,
    private translateService: TranslateService,
    private contractFolderService: ContractFolderService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.title = 'add.contract.folder';
    this.contractTypes = this.translateOptions(this.contractTypes);
  }


  convertActionFolder(action: string){
    switch (action){
      case 'add':
        return 'folder.add';
      case 'edit':
        return 'folder.edit';
      case 'openDetail':
        return 'folder.openDetail';
      default:
        return ''
    }
  }

  dataChecked: any[] = [];
  toggleAll(checkedAll: boolean) {
    this.dataChecked = [];
    
    if(checkedAll){
      for(let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = true;

        //Chia 2 TH: Tài liệu tạo - nhận
        this.dataChecked.push({
          id: this.contracts[i].contract_id,
          selectedId : this.contracts[i].id
        })
      }
    }
  }

  scroll: boolean = false;
  getContractList() {
    this.checkedAll = false;
    for(let i = 0; i < this.contracts.length; i++){
      this.contracts[i].checked = false;
    }

    if(this.parentId == 1)
        //Danh sách tài liệu tạo
        this.contractFolderService.getContractCreatedList(this.filter_name, this.status.toString(), this.p1, this.defaultSize).subscribe(data => {
          this.contracts = data.entities;
          this.pageTotal = data.total_elements;
          this.spinner.hide();
          if (this.pageTotal == 0) {
            this.p1 = 0;
            this.pageStart = 0;
            this.pageEnd = 0;
          } else {
            this.setPage();
          }
        }, error => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!", "", 3000);
        });

    if(this.parentId == 2){
        if(this.status == -1){
          this.contractFolderService.getContractShareList(this.filter_name, this.p1, this.defaultSize).subscribe(data => {
            this.contracts = data.entities;
            this.pageTotal = data.total_elements;
            this.spinner.hide();
            if (this.pageTotal == 0) {
              this.p1 = 0;
              this.pageStart = 0;
              this.pageEnd = 0;
            } else {
              this.setPage();
            }
          }, error => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!", "", 3000);
          })
        } else {
          //Danh sách tài liệu chờ xử lý
          this.contractFolderService.getContractMyProcessList(this.filter_name, this.status, this.p1, this.defaultSize).subscribe(data => {
            this.contracts = data.entities;
            this.pageTotal = data.total_elements;
            this.spinner.hide();
            if (this.pageTotal == 0) {
              this.p1 = 0;
              this.pageStart = 0;
              this.pageEnd = 0;
            } else {
              this.setPage();
            }
          }, error => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout("Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!", "", 3000);
          });
        }
      }
    }

    setPage() {
      this.pageStart = (this.p1 - 1) * this.page + 1;
      this.pageEnd = (this.p1) * this.page;
      if (this.pageTotal < this.pageEnd) {
        this.pageEnd = this.pageTotal;
      }

        // Kiểm tra xem phần tử có thanh cuộn hay không
      this.changeDetectorRef.detectChanges();
      if(this.scrollableDiv.nativeElement.scrollHeight > this.scrollableDiv.nativeElement.clientHeight) {
        this.scroll = true
      } else {
        this.scroll = false;
      }

      this.changeDetectorRef.detectChanges();
    }

    submit() {
      if(this.parentId == 1) {
        this.selectedContract = this.contracts.filter((opt) => opt.checked).map((item: any) => item.id);
      } else if(this.parentId == 2) {
        if(this.status == -1) {
          this.selectedContract = this.contracts.filter((opt) => opt.checked).map((item: any) => item.id);
        } else {
          this.selectedContract = this.contracts.filter((opt) => opt.checked).map((item: any) => item.participant.contract.id);
        }
      }
       

      if(this.selectedContract.length == 0) {
        this.toastService.showErrorHTMLWithTimeout('no.choose.contract','',3000);
        return;
      }

      const body = {
        id: parseInt(this.data.folderId),
        contracts: [...new Set(this.selectedContract)]
      }

      this.contractFolderService.addContractIntoFolder(body).subscribe(
        (response: any) => {
        if(response.errors?.length > 0) {
          if(response.errors[0].code == 1016) {
            this.toastService.showErrorHTMLWithTimeout('contracts.existed.folder','',3000);
          } else {
            this.toastService.showErrorHTMLWithTimeout(response.errors[0].message,'',3000);
          }
        } else {
          this.toastService.showSuccessHTMLWithTimeout("add.contract.in.folder.success","",3000);
          this.dialogRef.close(response);
          // window.location.reload();
        }
      }, (err: any) => {
        this.toastService.showErrorHTMLWithTimeout("Thêm tài liệu thất bại","",3000)
      })
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

    translateOptions(options: any[]): any[] {
      return options.map(option => {
        const translatedOption = { ...option };
        translatedOption.label = this.translateService.instant(option.label);
        
        if (translatedOption.children) {
          for(let i = 0; i < translatedOption.children.length; i++){
          translatedOption.children[i].label = this.translateService.instant(option.children[i].label);
          }
        }
        
        console.log(translatedOption)
        return translatedOption;
      });
    }

    sortParticipant(item: any) {
      if(this.parentId == 1)
      return item.participants.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
      if(this.parentId == 2){
        if(this.status != -1)
        if (item.participant && item.participant.contract.participants && item.participant.contract.participants.length > 0) {
          return item.participant.contract.participants.sort(
            (beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type
          );
        }
        if(this.status == -1)
        if (item.participants && item.participants.length > 0) {
          return item.participants.sort(
            (beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type
          );
        }
      }
    }

getCreatedDate(item: any){
  if(this.parentId == 1 || (this.parentId == 2 && this.status == -1))
  return item.created_at;
  if(this.parentId == 2 && this.status != -1)
  return item.participant.contract.created_time;
}

  getSignTime(item: any){
    if(this.parentId == 1 || (this.parentId == 2 && this.status == -1))
    return item.sign_time;
    if(this.parentId == 2 && this.status != -1)
    return item.participant.contract.sign_time;
  }

  getNameOrganization(item: any, index: any) {
    if(!(this.parentId == 2 && this.status != -1)) {
      if(item.type == 3 && item.recipients.length > 0)
        return sideList[index].name + " : " + item.recipients[0].name;
    } 
    return sideList[index].name + " : " + item.name;   
  }

  chooseContractType(){
    console.log(this.selectedContractType);
  }

  selectContract(item: any){
    if(!item.checked) this.checkedAll = false;
    else {
      let checked = true;
      for (let i = 0; i < this.contracts.length; i++){
        if(!this.contracts[i].checked) {
          checked = false;
          break;
        }
      }

      this.checkedAll = checked;
    }
  }

  filterContract(){
    this.status = this.selectedContractType.status;
    this.parentId = this.selectedContractType.parent.id;
    if(this.status == 999){
      this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn loại tài liệu để tìm kiếm", "", 3000);
      return
    }
    
    this.p1 = 0;
    this.pageStart = 0;
    this.pageEnd = 0;
    this.getContractList();
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
