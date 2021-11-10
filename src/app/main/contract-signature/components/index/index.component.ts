import {Component, OnInit, ViewChild} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
// import {AddContractComponent} from "../../../contract/add-contract/add-contract.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  // @ViewChild('AddContract') AddContractComponent: AddContractComponent

  constructor() { }

  ngOnInit(): void {
  }

}
