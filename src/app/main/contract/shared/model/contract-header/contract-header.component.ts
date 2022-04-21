import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddContractComponent } from "../../../add-contract/add-contract.component";
import { variable } from "../../../../../config/variable";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-contract-header',
  templateUrl: './contract-header.component.html',
  styleUrls: ['./contract-header.component.scss']
})
export class ContractHeaderComponent implements OnInit {
  @Input() AddComponent: AddContractComponent | unknown;
  @Output('stepChange') stepChange = new EventEmitter<Array<any>>();
  @Input() datas: any;
  @Input() step: any;
  @Input() saveDraft: any;
  @Output() messageEvent = new EventEmitter<any>();
  stepHeader: any = {
    step_1: false,
    step_2: false,
    step_3: false
  }
  closeResult: string = '';
  message: string;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private contractService: ContractService,
    private toastService: ToastService
  ) {
    // this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {

  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // saveContract(modal: any) {
  //   if (this.datas.stepLast == 'determine-contract') {
  //     this.datas.save_draft.determine_signer = true;
  //     this.datas['close_modal'] = modal;
  //   } else if (this.datas.stepLast == 'sample-contract') {
  //     this.datas.save_draft.sample_contract = true;
  //     this.datas['close_modal'] = modal;
  //   } else if (this.datas.stepLast == 'confirm-contract') {
  //     this.datas.save_draft.confirm_contract = true;
  //     this.datas['close_modal'] = modal;
  //   }
  // }

  saveContract(modal: any): void {
    let data = {
      close_modal: modal,
      step: this.step,
      close_header: true
    }
    this.messageEvent.emit(data);
    modal.close('Save click');
  }

  closeCreateContract(modal: any) {
    modal.close('Save click');
    if (this.datas.id) {
      this.contractService.deleteContract(this.datas.id).subscribe((data) => {
        if (data.success) {
          // this.toastService.showSuccessHTMLWithTimeout("Xóa hợp đồng thành công!", "", 3000);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            void this.router.navigate(['/main/dashboard']);
          });
        } else {
          if (data.message == 'E02') {
            this.toastService.showErrorHTMLWithTimeout("Hợp đồng không phải bản nháp!", "", 3000);
          } else {
            this.toastService.showErrorHTMLWithTimeout("Xóa hợp đồng thất bại!", "", 3000);
          }
        }
      },
        error => {
          this.toastService.showErrorHTMLWithTimeout("Xóa hợp đồng thất bại", "", 3000);
        }
      );
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        void this.router.navigate(['/main/dashboard']);
      });
    }

    //void this.router.navigate(['/main/contract/create/draft']);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // btn quay lại
  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextStep(step);

    // cancel active header theo từng step
    switch (step) {
      case variable.stepSampleContract.step1:
        this.stepHeader = {
          step_1: false,
          step_2: false,
          step_3: false
        }
        break;
      case variable.stepSampleContract.step2:
        this.stepHeader = {
          step_1: true,
          step_2: false,
          step_3: false
        }
        break
      default:
        break
    }
    // }
  }

  //--begin handle step and animation header active

  next() {
    let _isValid = true;
    // kiểm tra điều kiện valid dữ liệu các bước.
    _isValid = this.validData(this.step);
    if (_isValid) {
      let nextStep = this.step;
      switch (this.step) {
        case variable.stepSampleContract.step1:
          nextStep = variable.stepSampleContract.step2;
          this.stepHeader.step_1 = true; // active header theo từng step
          // this.stepChange.emit(this.step = nextStep);
          break;
        case variable.stepSampleContract.step2:
          nextStep = variable.stepSampleContract.step3;
          this.stepHeader.step_2 = true; // active header theo từng step
          // this.stepChange.emit(nextStep);
          break;
        case variable.stepSampleContract.step3:
          nextStep = variable.stepSampleContract.step4;
          this.stepHeader = { // active header theo từng step
            step_1: true,
            step_2: true,
            step_3: true,
            step_4: true
          }
          // this.stepChange.emit(nextStep);
          break;
        default:
          break;
      }
      this.nextStep(nextStep);
      let data = JSON.parse(JSON.stringify(this.datas));
      // if (!isGhiTam)
      data.stepLast = nextStep;
      this.datas.stepLast = data.stepLast;
      // else {
      //   if (this.step == sEnum.stepDocument.step1 && this.datas.stepLast != this.step) {
      //     data.documents.document.step = this.datas.stepLast;
      //   }
      // }
    }


  }

  // valid dữ liệu các bước
  validData(step: any) {
    switch (step) {
      case variable.stepSampleContract.step1:
        // valid data step 1, defind value
        // let dataInfo = JSON.parse(JSON.stringify(this.datas.inforDetails.value));
        // this.datas.inforDetails = dataInfo;

        if (!this.datas.file_content) {
          alert('Vui lòng chọn file hợp đồng!');
          return false;
        }
        break;
      // @ts-ignore
      case variable.stepSampleContract.step2:
        break;
      // @ts-ignore
      case variable.stepSampleContract.step3:
        // valid dữ liệu kéo thả đối tượng bước 3, cần kéo ít nhất 1 đối tượng vào hợp đồng
        let data_not_drag = this.datas.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];
        if (!data_not_drag) {
          alert('Vui lòng chọn ít nhất 1 đối tượng kéo thả!')
          return false;
        }
        break;
      case variable.stepSampleContract.step4:
        break;
      default:
        return false
    }
    return true;
  }

  // change name step next
  nextStep(step: any) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
  }

  previous() {
    let nextStep = this.step;
    switch (this.step) {
      case variable.stepSampleContract.step2:
        nextStep = variable.stepSampleContract.step1;
        // this.stepChange.emit(nextStep);
        break;
      case variable.stepSampleContract.step3:
        nextStep = variable.stepSampleContract.step2;
        // this.stepChange.emit(nextStep);
        break;
      case variable.stepSampleContract.step4:
        nextStep = variable.stepSampleContract.step3;
        // this.stepChange.emit(nextStep);
        break;
      default:
        break;
    }
    this.nextStep(nextStep);
  }

  t() {
    console.log(this.datas);
  }

  //--end

}
