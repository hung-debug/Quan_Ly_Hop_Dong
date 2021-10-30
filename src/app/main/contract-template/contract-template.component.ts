import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';

@Component({
  selector: 'app-contract-template',
  templateUrl: './contract-template.component.html',
  styleUrls: ['./contract-template.component.scss']
})
export class ContractTemplateComponent implements OnInit {
  public contractsTemplate: any[] = [];
  p:number = 1;
  page:number = 3;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractTemplateService: ContractTemplateService,) { }

  ngOnInit(): void {
    this.appService.setTitle('DANH SÁCH MẪU HỢP ĐỒNG ');
    //get list contract
    this.contractTemplateService.getContractTemplateList().subscribe(response => {
      this.contractsTemplate = response.items;
      this.pageTotal = this.contractsTemplate.length;
      this.setPage();
    });
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

}
