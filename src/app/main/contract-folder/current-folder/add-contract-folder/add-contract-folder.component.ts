import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { contractTypes } from 'src/app/config/variable';

@Component({
  selector: 'app-add-contract-folder',
  templateUrl: './add-contract-folder.component.html',
  styleUrls: ['./add-contract-folder.component.scss']
})
export class AddContractFolderComponent implements OnInit {
  action: string;
  title: string ="";
  contractTypes: any[] = contractTypes;
  selectedContractType: any;

  status: string;
  type: string;
  private sub: any;
  public contracts: any[] = [];

  p: number = 1;
  page: number = 10;
  pageDownload: number = 20;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';
  pageOptions: any[] = [10, 20, 50, 100];

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

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddContractFolderComponent>,
    public dialog : MatDialog,
    private translateService: TranslateService,
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

}
