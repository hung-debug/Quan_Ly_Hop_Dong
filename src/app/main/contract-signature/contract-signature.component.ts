import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerOptions } from 'ng2-datepicker';
import { AppService } from 'src/app/service/app.service';
import * as contractModel from './model/contract-model';

import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import {ContractSignatureService} from "../../service/contract-signature.service";
import {CONTRACT_RECEIVE_COORDINATOR} from "./model/contract-model";
import {variable} from "../../config/variable";
import {HttpClient} from "@angular/common/http";
import {ContractService} from "../../service/contract.service";
@Component({
  selector: 'app-contract',
  templateUrl: './contract-signature.component.html',
  styleUrls: ['./contract-signature.component.scss']
})
export class ContractSignatureComponent implements OnInit {
  constantModel: any;
  // action:string;
  // status: string;
  // type:string;
  // private sub: any;
  // searchText:string;
  // closeResult:string= '';
  // public contracts: any[] = [];
  // p:number = 1;
  // page:number = 3;
  // pageStart:number = 0;
  // pageEnd:number = 0;
  // pageTotal:number = 0;

  // //filter contract
  // contractType:any;
  // contractNumber:any;
  // startCreateDate:any;
  // endCreateDate:any;

  // // options sample with default values
  // options: DatepickerOptions = {
  //   minYear: getYear(new Date()) - 30, // minimum available and selectable year
  //   maxYear: getYear(new Date()) + 30, // maximum available and selectable year
  //   placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
  //   format: 'dd/MM/yyyy', // date format to display in input
  //   formatTitle: 'MM/yyyy',
  //   formatDays: 'EEEEE',
  //   firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
  //   locale: locale, // date-fns locale
  //   position: 'bottom',
  //   inputClass: '', // custom input CSS class to be applied
  //   calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
  //   scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  //   // keyboardEvents: true // enable keyboard events
  // };
  // //
  datas: any = {
    step: variable.stepSampleContract.step_coordination,
    contract: {},
    action_title: 'Điều phối'
  }

  action:string;
  status: string;
  type:string;
  private sub: any;
  searchText:string;
  closeResult:string= '';
  public contracts: any[] = [];
  p:number = 1;
  page:number = 5;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;
  statusPopup:number = 1;
  notificationPopup:string = '';

  title:any="";

  //filter contract
  filter_type:any = "";
  filter_contract_no:any = "";
  filter_from_date:any = "";
  filter_to_date:any = "";
  filter_status:any="";

  // options sample with default values
  options: DatepickerOptions = {
    minYear: getYear(new Date()) - 30, // minimum available and selectable year
    maxYear: getYear(new Date()) + 30, // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'dd/MM/yyyy', // date format to display in input
    formatTitle: 'MM/yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractService: ContractSignatureService,
              public isContractService: ContractService,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.constantModel = contractModel;
  }

  // open(content:any) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }

  // ngOnInit(): void {
  //   this.sub = this.route.params.subscribe(params => {
  //     this.action = params['action'];
  //     this.status = params['status'];

  //     //set title
  //     this.appService.setTitle('DANH SÁCH HỢP ĐỒNG ' + this.convertActionStr() + ' ' + this.convertStatusStr());
  //   });

  //   //get list contract
  //   this.contractService.getContractList().subscribe(response => {
  //     this.contracts = response.items;
  //     this.pageTotal = this.contracts.length;
  //     this.setPage();
  //     console.log(this.pageTotal);
  //   });

  // }

  // private convertActionStr(): string{
  //   if(this.action == 'create'){
  //     this.type = 'mine';
  //     return 'ĐÃ TẠO';
  //   }else if(this.action == 'receive'){
  //     this.type = 'wait-for-me';
  //     return 'ĐÃ NHẬN';
  //   }else{
  //     return '';
  //   }
  // }

  // iconClass = 'col-md-100-1';
  // private convertStatusStr(): string{
  //   if(this.status == 'draft'){
  //     this.iconClass = 'col-md-100-3';
  //     return 'BẢN NHÁP';
  //   }else if(this.status == 'wait-processing'){
  //     this.iconClass = 'col-md-100-3';
  //     return 'CHỜ XỬ LÝ';
  //   }else if(this.status == 'processing'){
  //     this.iconClass = 'col-md-100-3';
  //     return 'ĐANG XỬ LÝ';
  //   }else if(this.status == 'processed'){
  //     this.iconClass = 'col-md-100-3';
  //     return 'ĐÃ XỬ LÝ';
  //   }else if(this.status == 'expire'){
  //     this.iconClass = 'col-md-100-3';
  //     return 'SẮP HẾT HẠN';
  //   }else if(this.status == 'overdue'){
  //     this.iconClass = 'col-md-100-1';
  //     return 'QUÁ HẠN';
  //   }else if(this.status == 'fail'){
  //     this.iconClass = 'col-md-100-1';
  //     return 'TỪ CHỐI';
  //   }else if(this.status == 'cancel'){
  //     this.iconClass = 'col-md-100-1';
  //     return 'ĐÃ HỦY BỎ';
  //   }else if(this.status == 'complete'){
  //     this.iconClass = 'col-md-100-5';
  //     return 'ĐÃ HOÀN THÀNH';
  //   }else{
  //     return '';
  //   }
  // }

  // setPage(){
  //   this.pageStart = (this.p-1)*this.page+1;
  //   this.pageEnd = (this.p)*this.page;
  //   if(this.pageTotal < this.pageEnd){
  //     this.pageEnd = this.pageTotal;
  //   }
  // }

  // autoSearch(event:any){
  //   this.contractService.getContractList().subscribe(response => {
  //     this.contracts = this.transform(response.items, event);
  //   });
  // }

  // transform(contracts:any, event:any):any[]  {
  //   let searchText = event.target.value;
  //   if (!contracts) {
  //     return [];
  //   }
  //   if (!searchText) {
  //     return contracts;
  //   }
  //   searchText = searchText.toLocaleLowerCase();
  //   return contracts.filter((it:any) => {
  //     return it.contractName.toLocaleLowerCase().includes(searchText);
  //   });
  // }

  open(content:any) {
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
      return  `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      // this.action = params['action'];
      // this.status = params['status'];

      if (this.router.url.includes('contract-signature/receive/processed')){
        this.status = 'processed';
      }else if (this.router.url.includes('contract-signature/receive/wait-processing')){
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

  private getContractList(){
    this.p = 1;
    //get list contract
    this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      if(this.filter_status==0){
        this.contracts = data.entities.filter((i:any) => (i.status==1 || i.status==0))
      }else{
        this.contracts = data.entities.filter((i:any) => (i.status==2 || i.status==3))
      }



    //   this.contracts.forEach((element,index)=>{
    //     if(element.status==0) delete this.contracts[index];
    //  });

      this.pageTotal = this.contracts.length;
      console.log(this.contracts);
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }
      this.contracts.forEach((key : any, v: any) => {
        let contractId = key.participant.contract.id;
        let contractName = key.participant.contract.name;
        let contractNumber = key.participant.contract.code;
        let contractSignTime = key.participant.contract.sign_time;
        let contractCreateTime = key.participant.contract.created_time;
        console.log(contractName);
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

  private convertActionStr(): string{


    return 'contract.list.received';

  }

  private convertStatusStr(){
    if(this.status == 'draft'){
      this.filter_status = 0;
      this.title = 'contract.status.draft';
    }else if(this.status == 'wait-processing'){
      this.filter_status = 0;
      this.title = 'contract.status.wait-processing';
    }else if(this.status == 'processing'){
      this.filter_status = 20;
      this.title = 'contract.status.processing';
    }else if(this.status == 'processed'){
      this.filter_status = 1;
      this.title = 'contract.status.processed';
    }else if(this.status == 'expire'){
      this.filter_status = -1;
      this.title = 'contract.status.expire';
    }else if(this.status == 'overdue'){
      this.filter_status = -1;
      this.title = 'contract.status.overdue';
    }else if(this.status == 'fail'){
      this.filter_status = 31;
      this.title = 'contract.status.fail';
    }else if(this.status == 'cancel'){
      this.filter_status = 32;
      this.title = 'contract.status.cancel';
    }else if(this.status == 'complete'){
      this.filter_status = 30;
      this.title = 'contract.status.complete';
    }else{
      this.title = '';
    }
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  search(){
    this.getContractList();
  }

  autoSearch(event:any){
    this.p = 1;
    this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      if(this.filter_status==0){
        this.contracts = this.transform(data.entities.filter((i:any) => (i.status==1 || i.status==0)), event);
      }else{
        this.contracts = this.transform(data.entities.filter((i:any) => (i.status==2 || i.status==3)), event);
      }
      this.pageTotal = this.contracts.length;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }

      this.contracts.forEach((key : any, v: any) => {
        let contractId = key.participant.contract.id;
        let contractName = key.participant.contract.name;
        let contractNumber = key.participant.contract.code;
        let contractSignTime = key.participant.contract.sign_time;
        let contractCreateTime = key.participant.contract.created_time;
        console.log(contractName);
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

  transform(contracts:any, event:any):any[]  {
    let searchText = event.target.value;
    if (!contracts) {
      return [];
    }
    if (!searchText) {
      return contracts;
    }
    searchText = searchText.toLocaleLowerCase();
    return contracts.filter((it:any) => {
      return it.participant.contract.name.toLocaleLowerCase().includes(searchText);
    });
  }

  openConsiderContract(item: any) {
    this.router.navigate(['main/contract-signature/receive/wait-processing/consider-contract/' + item.contractId],
      {
        queryParams: { 'recipientId': item.id }
      }
    );
  }

  openSignatureContract(item: any) {
    this.isContractService.getListDataCoordination(44).subscribe((res: any) => {
      console.log(res);
      if (!localStorage.getItem('data_coordinates_contract')) {
        let data_coordination = {...this.datas, ...res};
        localStorage.setItem('data_coordinates_contract', JSON.stringify({data_coordinates: data_coordination}));
      }
      this.router.navigate(['main/contract-signature/receive/wait-processing/personal-signature-contract/' + item.contractId],
      {
        queryParams: { 'recipientId': item.id }
      });
    }, (res: any) => {
      alert('Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý!')
    })
  }

  openCoordinatorContract(id:number) {
    this.isContractService.getListDataCoordination(44).subscribe((res: any) => {
      console.log(res);
      if (!localStorage.getItem('data_coordinates_contract')) {
        let data_coordination = {...this.datas, ...res};
        localStorage.setItem('data_coordinates_contract', JSON.stringify({data_coordinates: data_coordination}));
      }
      this.router.navigate(['main/contract-signature/receive/wait-processing/coordinates-contract/' + id]);
    }, (res: any) => {
      alert('Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý!')
    })
  }

  openSecretaryContract(id:number) {
    this.router.navigate(['main/contract-signature/receive/wait-processing/secretary-contract/' + id]);
  }

  t(item: any) {
    console.log(item)
  }

}
