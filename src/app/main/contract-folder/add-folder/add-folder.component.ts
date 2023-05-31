import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {
  action: string;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddFolderComponent>,
    public dialog : MatDialog
  ) { }

  ngOnInit() {
    if(this.data){
      console.log(this.data);
      this.action = this.data;
      if(this.action == 'rename'){
        this.title = 'folder.rename';
      }
      if(this.action == 'add'){
        this.title = 'folder.add';
      }
    }
  }

}
