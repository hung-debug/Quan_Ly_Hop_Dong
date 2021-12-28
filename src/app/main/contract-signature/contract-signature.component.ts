import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from 'src/app/service/app.service';
import * as contractModel from './model/contract-model';

import {ContractSignatureService} from "../../service/contract-signature.service";
import {CONTRACT_RECEIVE_COORDINATOR} from "./model/contract-model";
import {variable} from "../../config/variable";
import {HttpClient} from "@angular/common/http";
import {ContractService} from "../../service/contract.service";
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-contract',
  templateUrl: './contract-signature.component.html',
  styleUrls: ['./contract-signature.component.scss']
})
export class ContractSignatureComponent implements OnInit {
  constantModel: any;

  datas: any = {
    step: variable.stepSampleContract.step_coordination,
    contract: {},
    action_title: 'Điều phối'
  }

  action: string;
  status: string;
  type: string;
  private sub: any;
  searchText: string;
  closeResult: string = '';
  public contracts: any[] = [];
  p: number = 1;
  page: number = 5;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';

  title: any = "";

  //filter contract
  filter_type: any = "";
  filter_contract_no: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";
  filter_status: any = "";

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractService: ContractSignatureService,
              public isContractService: ContractService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
  ) {
    this.constantModel = contractModel;
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(typeof params.filter_type != 'undefined' && params.filter_type){
        this.filter_type = params.filter_type;
      }else{
        this.filter_type = "";
      }
      if(typeof params.filter_contract_no != 'undefined' && params.filter_contract_no){
        this.filter_contract_no = params.filter_contract_no;
      }else{
        this.filter_contract_no = "";
      }
      if(typeof params.filter_from_date != 'undefined' && params.filter_from_date){
        this.filter_from_date = params.filter_from_date;
      }else{
        this.filter_from_date = "";
      }
      if(typeof params.filter_to_date != 'undefined' && params.filter_to_date){
        this.filter_to_date = params.filter_to_date;
      }else{
        this.filter_to_date = "";
      }
    });
    this.sub = this.route.params.subscribe(params => {
      // this.action = params['action'];
      // this.status = params['status'];

      if (this.router.url.includes('contract-signature/receive/processed')) {
        this.status = 'processed';
      } else if (this.router.url.includes('contract-signature/receive/wait-processing')) {
        this.status = 'wait-processing';
      }
      console.log(this.router.url);
      console.log(this.status);

      //set title
      this.convertStatusStr();
      this.action = 'receive';
      this.type = 'wait-for-me';
      this.appService.setTitle(this.convertActionStr());

      this.getContractList();
    });


  }

  private getContractList() {
    this.p = 1;
    //get list contract
    this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      if (this.filter_status == 0) {
        this.contracts = data.entities.filter((i: any) => i.status == 1)
      } else {
        this.contracts = data.entities.filter((i: any) => (i.status == 2 || i.status == 3))
      }


      //   this.contracts.forEach((element,index)=>{
      //     if(element.status==0) delete this.contracts[index];
      //  });

      this.pageTotal = this.contracts.length;
      console.log(this.contracts);
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
      this.contracts.forEach((key: any, v: any) => {
        let contractId = key.participant.contract.id;
        let contractName = key.participant.contract.name;
        let contractNumber = key.participant.contract.code;
        let contractSignTime = key.participant.contract.sign_time;
        let contractCreateTime = key.participant.contract.created_time;
        this.contracts[v].contractId = contractId;
        this.contracts[v].contractName = contractName;
        this.contracts[v].contractNumber = contractNumber;
        this.contracts[v].contractSignTime = contractSignTime;
        this.contracts[v].contractCreateTime = contractCreateTime;
        // participant.forEach((key : any, val: any) => {
        //   if (key.type == 1) {
        //     this.contracts[v].sideA = key.name;
        //   }else{
        //     this.contracts[v].sideB = key.name;
        //   }
        //   console.log(this.contracts[v].sideA);
        // })
      });
      console.log(this.contracts);
      console.log(this.pageTotal);
    });
  }

  private convertActionStr(): string {


    return 'contract.list.received';

  }

  private convertStatusStr() {
    if (this.status == 'draft') {
      this.filter_status = 0;
      this.title = 'contract.status.draft';
    } else if (this.status == 'wait-processing') {
      this.filter_status = 0;
      this.title = 'contract.status.wait-processing';
    } else if (this.status == 'processing') {
      this.filter_status = 20;
      this.title = 'contract.status.processing';
    } else if (this.status == 'processed') {
      this.filter_status = 1;
      this.title = 'contract.status.processed';
    } else if (this.status == 'expire') {
      this.filter_status = -1;
      this.title = 'contract.status.expire';
    } else if (this.status == 'overdue') {
      this.filter_status = -1;
      this.title = 'contract.status.overdue';
    } else if (this.status == 'fail') {
      this.filter_status = 31;
      this.title = 'contract.status.fail';
    } else if (this.status == 'cancel') {
      this.filter_status = 32;
      this.title = 'contract.status.cancel';
    } else if (this.status == 'complete') {
      this.filter_status = 30;
      this.title = 'contract.status.complete';
    } else {
      this.title = '';
    }
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  autoSearch(event: any) {
    this.p = 1;
    this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      if (this.filter_status == 0) {
        this.contracts = this.transform(data.entities.filter((i: any) => i.status == 1), event);
      } else {
        this.contracts = this.transform(data.entities.filter((i: any) => (i.status == 2 || i.status == 3)), event);
      }
      this.pageTotal = this.contracts.length;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }

      this.contracts.forEach((key: any, v: any) => {
        let contractId = key.participant.contract.id;
        let contractName = key.participant.contract.name;
        let contractNumber = key.participant.contract.code;
        let contractSignTime = key.participant.contract.sign_time;
        let contractCreateTime = key.participant.contract.created_time;
        this.contracts[v].contractId = contractId;
        this.contracts[v].contractName = contractName;
        this.contracts[v].contractNumber = contractNumber;
        this.contracts[v].contractSignTime = contractSignTime;
        this.contracts[v].contractCreateTime = contractCreateTime;
        // participant.forEach((key : any, val: any) => {
        //   if (key.type == 1) {
        //     this.contracts[v].sideA = key.name;
        //   }else{
        //     this.contracts[v].sideB = key.name;
        //   }
        //   console.log(this.contracts[v].sideA);
        // })
      });
    });
  }

  transform(contracts: any, event: any): any[] {
    let searchText = event.target.value;
    if (!contracts) {
      return [];
    }
    if (!searchText) {
      return contracts;
    }
    searchText = searchText.toLocaleLowerCase();
    return contracts.filter((it: any) => {
      return it.participant.contract.name.toLocaleLowerCase().includes(searchText);
    });
  }

  searchContract(){
    const data = {
      title: 'TÌM KIẾM HỢP ĐỒNG',
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(FilterListDialogComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  openConsiderContract(item: any) {
    this.router.navigate(['main/contract-signature/consider/' + item.contractId],
      {
        queryParams: {'recipientId': item.id}
      }
    );
  }

  openDetail(id: number) {
    this.router.navigate(['main/form-contract/detail/' + id]);
  }

  openConsiderContractViewProcesse(item: any) {
    if (item.status == 2) {
      this.router.navigate(['main/contract-signature/receive/wait-processing/consider-contract/' + item.contractId],
        {
          queryParams: {'recipientId': item.id}
        }
      );
    }

  }

  openSignatureContract(item: any) {
    this.router.navigate(['main/contract-signature/signatures/' + item.contractId],
      {
        queryParams: {'recipientId': item.id}
      });
  }

  openCoordinatorContract(item: any) {
    this.isContractService.getListDataCoordination(item.contractId).subscribe((res: any) => {
      if (res) {
        if (localStorage.getItem('data_coordinates_contract_id')) {
          localStorage.removeItem('data_coordinates_contract_id');
        }
        // let data_coordination = {...this.datas, ...res};
        localStorage.setItem('data_coordinates_contract_id', JSON.stringify({data_coordinates_id: res.id}));
        this.router.navigate(['main/contract-signature/coordinates/' + item.contractId]);
      }
    }, (res: any) => {
      alert('Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý!')
    })
  }

  openSecretaryContract(item: any) {
    this.router.navigate(['main/contract-signature/secretary/' + item.contractId],
      {
        queryParams: {'recipientId': item.id}
      });
  }

  t(item: any) {
    console.log(item)
  }

}
