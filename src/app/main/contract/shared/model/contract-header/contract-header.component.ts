import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
  stepHeader: any = {
    step_1: false,
    step_2: false,
    step_3: false
  }

  constructor() {
    // this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {
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
        let dataInfo = JSON.parse(JSON.stringify(this.datas.inforDetails.value));
        console.log(dataInfo);
        this.datas.inforDetails = dataInfo;
        if (!this.datas.file_content) {
          alert('Vui lòng chọn file hợp đồng!');
          return false;
        }
        break;
      // @ts-ignore
      case variable.stepSampleContract.step2:
        console.log(this.datas);
        let is_partners = JSON.parse(JSON.stringify(this.datas.partners.value));
        let is_userForm = JSON.parse(JSON.stringify(this.datas.userForm.value));
        this.datas.partners = is_partners;
        this.datas.userForm = is_userForm;
        // if (this.datas.dataDetails && this.datas.dataDetails.length > 0) {
        //   let count = 0;
        //   this.datas.dataDetails.forEach((element: any) => {
        //     // @ts-ignore
        //     element.property_name.forEach((item: any) => {
        //       if (!item.value) {
        //         count++;
        //         // alert('Vui lòng nhập dữ liệu ' + item.name + ' của ' + element.title);
        //         // return false;
        //       }
        //     })
        //   })
        //
        //   if (count > 0) {
        //     alert('Vui lòng nhập đủ các trường dữ liệu bắt buộc!')
        //     return false;
        //   }
        // }
        break;
      // @ts-ignore
      case variable.stepSampleContract.step3:
        // valid dữ liệu kéo thả đối tượng bước 3, cần kéo ít nhất 1 đối tượng vào hợp đồng
        console.log(this.datas)
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
    this.stepChange.emit(step);
  }

  previous(){
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

}
