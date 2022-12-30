import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractTemplateService } from './contract-template.service';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class CheckViewContractService {

  constructor(
    private contractService: ContractService,
    private contractTemplateService: ContractTemplateService
  ) { }

  async callAPIcheckViewContract(id: number, template: boolean) {
    let email =  JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.email;
    
    if(!template) {
      const checkViewContract = await this.contractService.checkViewContract(id, email).toPromise();
    
      if(checkViewContract.success) {
        return true;
      } else {
       return false;
      }
    } else {
      const checkViewTemplateContract = await this.contractTemplateService.checkViewTemplateContract(id, email).toPromise();
    
      if(checkViewTemplateContract.success) {
        return true;
      } else {
       return false;
      }
    }
  
  }
}
