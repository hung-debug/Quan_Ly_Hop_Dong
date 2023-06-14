import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddContractFolderComponent>,
    public dialog : MatDialog
  ) { }

  ngOnInit() {
    this.title = 'add.contract.folder';
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

}
