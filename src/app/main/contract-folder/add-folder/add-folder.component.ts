import { ToastService } from './../../../service/toast.service';
import { Folder } from './../../../service/contract-folder.service';
import { ContractFolderService } from 'src/app/service/contract-folder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {
  action: string;
  title: string ="";
  name: string = "";
  description: string = "";
  id: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AddFolderComponent>,
    public dialog : MatDialog,
    private contractFolderService: ContractFolderService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
      this.action = this.data.action;
      this.title=this.convertActionFolder(this.action);
      if(this.action == 'edit' || this.action == 'openDetail'){
        this.contractFolderService.getContractFoldersList().subscribe((item) => {
          let folder = item.filter((folder: any) => folder.id == this.data.folderId)[0];
          this.name = folder.name;
          this.description = folder.description;
          this.id = folder.id ? folder.id : 0;
        })
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

  isSubmit: boolean = false;
  submit(){
    this.isSubmit = true;
    if(!this.valid()) {
      return false;
    }

    this.spinner.show();
    if(this.action=='add' && this.valid()){
      let folder: Folder = {
        name: this.name,
        description: this.description,
      }
      this.contractFolderService.addContractFolder(folder).subscribe(
        (data: any) => {
          if(data.errors)
          if(data.errors[0].code == 1003){
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('folder.name.exist', '', 2000);
            return;
          }
          this.dialogRef.close();
          this.toastService.showSuccessHTMLWithTimeout('folder.add.success', '', 2000);
        }
      )
    } else if(this.action=='edit' && this.valid()){
      let folder: Folder = {
        id: this.id,
        name: this.name,
        description: this.description,
      }
      this.contractFolderService.editContractFolder(folder).subscribe(
        (data: any) => {
          if(data.errors)
          if(data.errors[0].code == 1003){
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('folder.name.exist', '', 2000);
            return;
          }
          this.toastService.showSuccessHTMLWithTimeout('folder.edit.success', '', 2000);
          this.dialogRef.close();
        }
      )
    }

    }
  

  valid(){
    if(this.name==''){
      return false;
    }
    return true;
  }

  getStyleDetail(){
    if(this.action=='openDetail'){
      return {
        'background-color':'#EFF2F5',
        'border':'none'
      };
    }
    return {};
  }

}
