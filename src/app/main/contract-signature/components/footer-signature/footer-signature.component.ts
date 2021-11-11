import {Component, OnInit, Input} from '@angular/core';
import {variable} from "../../../../config/variable";

@Component({
  selector: 'app-footer-signature',
  templateUrl: './footer-signature.component.html',
  styleUrls: ['./footer-signature.component.scss']
})
export class FooterSignatureComponent implements OnInit {
  @Input() datas: any

  constructor() {
  }

  ngOnInit(): void {
  }

  action() {
    if (this.datas.action_title == 'Điều phối') {
      this.datas.step = variable.stepSampleContract.step_confirm_coordination;
    }
  }

}
