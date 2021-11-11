import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-header-contract',
  templateUrl: './header-contract.component.html',
  styleUrls: ['./header-contract.component.scss']
})
export class HeaderContractComponent implements OnInit {
  @Input() datas: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
