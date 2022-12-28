import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class CheckViewContractService {

  constructor(
    private contractService: ContractService,
    private activeRoute: ActivatedRoute,
  ) { }

  async callAPIcheckViewContract(id: number) {
    let email =  JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.email;

    const checkViewContract = await this.contractService.checkViewContract(id, email).toPromise();

    console.log("c ", checkViewContract);
    
    if(checkViewContract.success) {
      return true;
    } else {
     return false;
    }
  }
}
