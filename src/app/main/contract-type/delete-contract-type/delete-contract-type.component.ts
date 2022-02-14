import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-contract-type',
  templateUrl: './delete-contract-type.component.html',
  styleUrls: ['./delete-contract-type.component.scss']
})
export class DeleteContractTypeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<DeleteContractTypeComponent>,
  public router: Router,
  public dialog: MatDialog,
  private contractTypeService:ContractTypeService) { }

  ngOnInit(): void {
  }

  onSubmit(){

    this.contractTypeService.deleteContractType(this.data.id).subscribe(
      data => {
        if(data.success){
          this.toastService.showSuccessHTMLWithTimeout("Xóa loại hợp đồng thành công!", "", 3000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-type']);
        });  
        }else{
          this.toastService.showErrorHTMLWithTimeout("Loại hợp đồng đã được gán!", "", 3000);
          this.dialogRef.close();
        }
          
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

}
