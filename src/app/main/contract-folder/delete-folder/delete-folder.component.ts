import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-folder',
  templateUrl: './delete-folder.component.html',
  styleUrls: ['./delete-folder.component.scss']
})
export class DeleteFolderComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<DeleteFolderComponent>,
  public router: Router,
  public dialog: MatDialog,
) { }

  ngOnInit(): void {
  }

  onSubmit(){
    // this.roleService.deleteRole(this.data.id).subscribe(
    //   data => {
    //     if(data.code == '00'){
    //       this.toastService.showSuccessHTMLWithTimeout("Xóa thư mục thành công!", "", 3000);
    //     }else {
    //       this.toastService.showErrorHTMLWithTimeout("Lỗi hệ thống!", "", 3000);
    //     }
        
    //     this.dialogRef.close();
    //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //       this.router.navigate(['/main/contract-folder']);
    //     });
            
    //   }, error => {
    //     this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
    //   }
    // )
  }
}
