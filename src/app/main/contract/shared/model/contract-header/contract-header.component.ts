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
  constructor(
  ) {
    // this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {
  }


  // btn quay lại
  back(e: any, step?: any) {
    // if (!this.datas.isView) {
      this.nextStep(step);
    // }
  }

  // btn tiếp theo
  next() {
    let _isValid = true;
    // kiểm tra điều kiện valid dữ liệu các bước.
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

  // valid dữ liệu các bước
  validData(step: any) {
    switch (step) {
      case variable.stepSampleContract.step1:
        break;
      // @ts-ignore
      case variable.stepSampleContract.step2:
        if (!this.datas.file_content) {
          alert('Vui lòng chọn file hợp đồng!');
          return false;
        }
        if (this.datas.dataDetails && this.datas.dataDetails.length > 0) {
          let count = 0;
          this.datas.dataDetails.forEach((element: any) => {
            // @ts-ignore
            element.property_name.forEach((item: any) => {
              if (!item.value) {
                count++;
                // alert('Vui lòng nhập dữ liệu ' + item.name + ' của ' + element.title);
                // return false;
              }
            })
          })

          if (count > 0) {
            alert('Vui lòng nhập đủ các trường dữ liệu bắt buộc!')
            return false;
          }
        }
        break;
      // @ts-ignore
      case variable.stepSampleContract.step3:
        // valid dữ liệu kéo thả đối tượng bước 3, cần kéo ít nhất 1 đối tượng vào hợp đồng
        let data_not_drag = this.datas.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];
        if (!data_not_drag) {
          alert('Vui lòng chọn ít nhất 1 đối tượng kéo thả!')
          return false;
        }
        // break;
      case variable.stepSampleContract.step4: break;
      default: return false
    }
    return true;
  }

  // change name step next
  nextStep(step: any) {
    // this.datas.documents.document.step = step;
    this.datas.stepLast = step;
    this.stepChange.emit(step);
  }

}
