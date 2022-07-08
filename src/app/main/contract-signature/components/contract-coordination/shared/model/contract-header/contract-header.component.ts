import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AddContractComponent} from "../../../../../../contract/add-contract/add-contract.component";
import {variable} from "../../../../../../../config/variable";
import {Observable, timer} from "rxjs";
import {map, take} from "rxjs/operators";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationExpireComponent } from '../dialog/notification-expire/notification-expire.component';

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
  counter$: any;
  //don vi: giay
  count = 180;

  constructor(private dialog: MatDialog,
    public router: Router,) {
    // this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {
    this.counter$ = timer(0,1000).pipe(
      take(this.count),
      map(() => this.transform(--this.count))
    );
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);

    if(value == 0){
      const data = {
        title: 'THÔNG BÁO'
      };
      // @ts-ignore
      const dialogRef = this.dialog.open(NotificationExpireComponent, {
        width: '520px',
        backdrop: 'static',
        keyboard: false,
        data
      })
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        let is_data = result
      })

      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract-signature/coordinates/' + this.datas.contract_id]);
      });
    }

    return minutes.toString().padStart(2, '0') + ':' + 
        (value - minutes * 60).toString().padStart(2, '0');
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

  //--end

}
