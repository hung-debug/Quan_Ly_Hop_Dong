import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AddContractComponent} from "../../../add-contract/add-contract.component";
import {variable} from "../../../../../config/variable";

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
  constructor() {
    // this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {
  }

  next() {
    let _isValid = true;
    _isValid = this.validData(this.step);
    if (_isValid) {
      let nextStep = this.step;
      switch (this.step) {
        case variable.stepSampleContract.step1:
          nextStep = variable.stepSampleContract.step2;
          // this.stepChange.emit(this.step = nextStep);
          break;
        case variable.stepSampleContract.step2:
          nextStep = variable.stepSampleContract.step3;
          // this.stepChange.emit(nextStep);
          break;
        case variable.stepSampleContract.step3:
          nextStep = variable.stepSampleContract.step4;
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

  validData(step: any) {
    switch (step) {
      case variable.stepSampleContract.step1:
        break
      case variable.stepSampleContract.step2: break
      case variable.stepSampleContract.step3: break
      case variable.stepSampleContract.step4: break;
      default: return false
    }
    return true;
  }

  nextStep(step: any) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChange.emit(step);
  }

}
