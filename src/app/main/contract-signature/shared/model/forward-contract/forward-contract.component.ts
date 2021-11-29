import {Component, Inject, OnInit, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ContractService} from "../../../../../service/contract.service";
import {ToastService} from "../../../../../service/toast.service";

@Component({
  selector: 'app-forward-contract',
  templateUrl: './forward-contract.component.html',
  styleUrls: ['./forward-contract.component.scss']
})
export class ForwardContractComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  currentUser: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private contractService: ContractService,
    private toastService : ToastService,
    private el: ElementRef
  ) { }



  ngOnInit(): void {
    this.datas = this.data;
    this.getCurrentUser();
    this.myForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
    });
  }

  onSubmit() {
    if (this.currentUser) {
      const dataAuthorize = {
        email: this.myForm.value.email,
        full_name: this.myForm.value.name,
        role: this.datas.dataContract.roleContractReceived,
        participant_id: this.datas.dataContract.is_data_contract.participants[0].id,
        is_replace: this.datas.is_content != 'forward_contract'

      }
      this.contractService.processAuthorizeContract(dataAuthorize).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout((this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền') + ' thành công!'
            , "", 1000);
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )
    }
  }

  getCurrentUser(): any {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
  }

}
