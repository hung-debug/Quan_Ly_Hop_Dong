import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {variable} from "../../../../config/variable";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddContractComponent } from '../../add-contract/add-contract.component';
@Component({
  selector: 'app-contract-batch-header',
  templateUrl: './contract-batch-header.component.html',
  styleUrls: ['./contract-batch-header.component.scss']
})
export class ContractBatchHeaderComponent implements OnInit {

  @Input() AddComponent: AddContractComponent | unknown;
  @Output('stepChange') stepChange = new EventEmitter<Array<any>>();
  @Input() datas: any;
  @Input() stepBatch: any;
  stepHeader: any = {
    step_1: false,
    step_2: false,
    step_3: false
  }
  closeResult:string= '';

  constructor(private modalService: NgbModal,) {
  }

  ngOnInit(): void {
    
    
  }

  open(content:any) {  
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  // btn quay lại
  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextStep(step);

    // cancel active header theo từng step
    switch (step) {
      case variable.stepSampleContractBatch.step1:
        this.stepHeader = {
          step_1: false,
          step_2: false,
          step_3: false
        }
        break;
      case variable.stepSampleContractBatch.step2:
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
    _isValid = this.validData(this.stepBatch);
    if (_isValid) {
      let nextStep = this.stepBatch;
      switch (this.stepBatch) {
        case variable.stepSampleContractBatch.step1:
          nextStep = variable.stepSampleContractBatch.step2;
          this.stepHeader.step_1 = true; // active header theo từng step
          // this.stepChange.emit(this.step = nextStep);
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
      case variable.stepSampleContractBatch.step1:
        // valid data step 1, defind value
        // let dataInfo = JSON.parse(JSON.stringify(this.datas.inforDetails.value));
        // this.datas.inforDetails = dataInfo;

        if (!this.datas.file_content) {
          alert('Vui lòng chọn file tài liệu!');
          return false;
        }
        break;
      // @ts-ignore
      case variable.stepSampleContractBatch.step2:
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
    this.stepChange.emit(step);
  }

  previous(){
    let nextStep = this.stepBatch;
    switch (this.stepBatch) {
      case variable.stepSampleContractBatch.step2:
        nextStep = variable.stepSampleContractBatch.step1;
        // this.stepChange.emit(nextStep);
        break;
      default:
        break;
    }
    this.nextStep(nextStep);
  }

  t() {
    
  }

}
