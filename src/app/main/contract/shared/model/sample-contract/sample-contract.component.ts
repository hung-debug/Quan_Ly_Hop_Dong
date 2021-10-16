import { Component, OnInit, Input } from '@angular/core';
import {variable} from "../../../../../config/variable";

@Component({
  selector: 'app-sample-contract',
  templateUrl: './sample-contract.component.html',
  styleUrls: ['./sample-contract.component.scss']
})
export class SampleContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  constructor() {
    this.step = variable.stepSampleContract.step3
  }

  ngOnInit(): void {
  }

}
