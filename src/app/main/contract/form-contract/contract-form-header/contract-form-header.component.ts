import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AddContractComponent } from "../../add-contract/add-contract.component";
import { variable } from "@angular/compiler/src/output/output_ast";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ContractService } from "src/app/service/contract.service";
import { ToastService } from "src/app/service/toast.service";
import { Header } from "primeng/api";

@Component({
  selector: 'app-contract-form-header',
  templateUrl: './contract-form-header.component.html',
  styleUrls: ['./contract-form-header.component.scss']
})

export class ContractFormHeaderComponent implements OnInit {
  @Input() AddComponent: AddContractComponent | unknown;
  @Output('stepChange') stepChange = new EventEmitter<Array<any>>();
  @Input() datasForm: any;
  @Input() stepForm: any;
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

  }

  ngOnInit(): void {
  }

  saveContract(modal: any): void {
    let data = {
      close_modal: modal,
      step: this.stepForm,
      close_header: true
    }
    this.messageEvent.emit(data);
    modal.close('Save click');
  }

  closeCreateContract(modal: any) {
    modal.close('Save click');
    if (this.datasForm.id) {
      this.contractService.deleteContract(this.datasForm.id).subscribe((data) => {
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

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}