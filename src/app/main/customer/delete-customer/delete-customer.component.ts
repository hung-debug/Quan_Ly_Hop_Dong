import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Spinner, NgxSpinnerService } from 'ngx-spinner';
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
  private customerService: CustomerService,
  private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
  }


  onSubmit(){
    this.spinner.show();
    this.customerService.deleteCustomerById(this.data.id).subscribe(
      data => {
        this.spinner.hide();
        this.toastService.showSuccessHTMLWithTimeout("Xóa khách hàng thành công!", "", 3000);
        this.dialogRef.close();
        
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //   this.router.navigate(['/main/customer']);
        // });
            
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
}
