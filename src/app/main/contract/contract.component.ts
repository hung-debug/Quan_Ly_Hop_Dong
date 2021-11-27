import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerOptions } from 'ng2-datepicker';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';

import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  action:string;
  status: string;
  type:string;
  private sub: any;
  searchText:string;
  closeResult:string= '';
  public contracts: any[] = [];
  p:number = 0;
  page:number = 5;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;
  statusPopup:number = 1;
  notificationPopup:string = '';

  //filter contract
  filter_type:any = "";
  filter_contract_no:any = "";
  filter_from_date:any = "";
  filter_to_date:any = "";

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
              private contractService: ContractService,
              private route: ActivatedRoute,
              private router: Router,
    ) {}

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
      this.action = params['action'];
      this.status = params['status'];

      //set title
      this.appService.setTitle(this.convertActionStr());
    });

    //get list contract
    this.contractService.getContractList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      if(this.pageTotal > 0){
        this.setPage();
      }
      console.log(this.contracts);
      console.log(this.pageTotal);
    });

  }

  private convertActionStr(): string{
    console.log(this.action);
    if(this.action == 'create'){
      this.type = 'mine';
      return 'contract.list.created';
    }else if(this.action == 'receive'){
      this.type = 'wait-for-me';
      return 'contract.list.received';
    }else{
      return '';
    }
  }

  private convertStatusStr(): string{
    if(this.status == 'draft'){
      return 'contract.status.draft';
    }else if(this.status == 'wait-processing'){
      return 'contract.status.wait-processing';
    }else if(this.status == 'processing'){
      return 'contract.status.processing';
    }else if(this.status == 'processed'){
      return 'contract.status.processed';
    }else if(this.status == 'expire'){
      return 'contract.status.expire';
    }else if(this.status == 'overdue'){
      return 'contract.status.overdue';
    }else if(this.status == 'fail'){
      return 'contract.status.fail';
    }else if(this.status == 'cancel'){
      return 'contract.status.cancel';
    }else if(this.status == 'complete'){
      return 'contract.status.complete';
    }else{
      return '';
    }
  }

  setPage(){
    this.pageStart = (this.p)*this.page+1;
    this.pageEnd = (this.p+1)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  search(){
    this.contractService.getContractList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      if(this.pageTotal > 0){
        this.setPage();
      }
      console.log(this.contracts);
      console.log(this.pageTotal);
    });
  }

  autoSearch(event:any){
    this.contractService.getContractList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date).subscribe(data => {
      this.contracts = this.transform(data.entities, event);
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
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

  openDetail(id:number){
    this.router.navigate(['main/form-contract/copy/' + id]);
  }

  openCopy(id:number){
    this.router.navigate(['main/form-contract/copy/' + id]);
  }

  openEdit(id:number){
    this.router.navigate(['main/form-contract/edit/' + id]);
  }

  deleteItem(id:number){
    this.statusPopup = 1;
    this.notificationPopup = "Xóa hợp đồng thành công";
  }

}
