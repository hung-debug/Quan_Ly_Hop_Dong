import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {
  action: string;
  title: string ="";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddFolderComponent>,
    public dialog : MatDialog
  ) { }

  ngOnInit() {
    if(this.data){
      console.log(this.data);
      this.action = this.data.action;
      this.title=this.convertActionFolder(this.action);
    }
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
