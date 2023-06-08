import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AddContractComponent } from "../contract-coordination/add-contract/add-contract.component";
import { variable } from "../../../../config/variable";
import { environment } from "../../../../../environments/environment";
import { UserService } from "../../../../service/user.service";
import { ContractSignatureService } from "../../../../service/contract-signature.service";
import * as contractModel from '../../model/contract-model';
import { data_signature_contract } from "../../model/contract-model";
import { ContractService } from "../../../../service/contract.service";
import { ToastService } from "../../../../service/toast.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('AddContract') AddContractComponent: AddContractComponent;
  datas: any = {};
  data_contract: any;
  currentUser: any;

  constructor(
    private contractSignatureService: ContractSignatureService,
    private contractService: ContractService,
    private toastService: ToastService,
    private router: Router,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    // 
    // @ts-ignore
    let dataLocal = JSON.parse(localStorage.getItem('data_coordinates_contract_id'));
    let data_element = undefined;
    if (!dataLocal) {
      let dataUrl = this.router.url.split("?");
      let is_element = dataUrl[0];
      let items_element = is_element.split("/");
      data_element = items_element[items_element.length - 1];
    } else {
      data_element = dataLocal.data_coordinates_id;
    }
    // dataLocal.data_coordinates_id
    this.contractService.getDetailContract(data_element).subscribe(rs => {
      let data_api = {
        is_data_contract: rs[0],
        i_data_file_contract: rs[1],
        is_data_object_signature: rs[2]
      }
      this.datas = {
        "step": "infor-coordination",
        "contract": {},
        "action_title": "dieu_phoi",
        "data_contract_document_id": {
          contract_id: data_api.is_data_object_signature[0].contract_id,
          document_id: data_api.is_data_object_signature[0].document_id
        },
        // view: false,
        // coordination_complete: false
      };
      this.datas = Object.assign(this.datas, data_api)
    }, () => {

    })
    // this.datas = Object.assign(this.datas, this.data_contract);
    // 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

  async submitEvents(e: any) {
    if (e == 1) {
      let inputValue = '';
      const { value: textRefuse } = await Swal.fire({
        title: 'Bạn có chắc chắn hủy hợp đồng này không? Vui lòng nhập lý do hủy:',
        input: 'text',
        inputValue: inputValue,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        inputValidator: (value) => {
          if (!value) {
            return 'Bạn cần nhập lý do hủy hợp đồng!'
          } else {
            return null;
          }
        }
      })

      if (textRefuse) {
        // Kiểm tra ô ký đã ký chưa (status = 2)
        this.spinner.show();
        let id_recipient_signature = null;
        for (const d of this.datas.is_data_contract.participants) {
          for (const q of d.recipients) {
            if (q.email == this.currentUser.email && q.status == 1) {
              id_recipient_signature = q.id;
              break
            }
          }
          if (id_recipient_signature) break;
        }

        //neu co id nguoi xu ly thi moi kiem tra
        
        if (id_recipient_signature) {
          this.contractService.considerRejectContract(id_recipient_signature, textRefuse).subscribe(
            (result) => {
              this.spinner.hide();
              this.toastService.showSuccessHTMLWithTimeout('Hủy hợp đồng thành công!', '', 3000);
              this.router.navigate(['/main/contract-signature/receive/wait-processing']);
            }, error => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
            }, () => {
              // this.getLoadChangeDataRefuse();
            }
          )
        }
      }
    }
  }

  // getLoadChangeDataRefuse() {
  //   // load data after when coordination success
  //   this.contractService.getDataCoordination(this.datas.data_contract_document_id.contract_id).subscribe((res: any) => {
  //     if (res) {
  //       this.datas.is_data_contract = res;
  //       this.router.navigate(['/main/contract-signature/coordinates/' + this.datas.data_contract_document_id.contract_id]);
  //     }
  //   }, (error) => {
  //     this.spinner.hide();
  //     this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000);
  //   }, () => {
  //     this.spinner.hide();
  //   })
  // }

}
