import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.scss']
})
export class DeleteCustomerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toastService : ToastService,
  public dialogRef: MatDialogRef<DeleteCustomerComponent>,
  public router: Router,
  public dialog: MatDialog,
  private customerService: CustomerService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.customerService.deleteCustomerById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.toastService.showSuccessHTMLWithTimeout("Xóa khách hàng thành công!", "", 3000);
        this.dialogRef.close();
        console.log(data);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/customer']);
        });
            
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
}
