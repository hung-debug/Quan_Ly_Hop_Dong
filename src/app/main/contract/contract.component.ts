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
  p:number = 1;
  page:number = 5;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;
  statusPopup:number = 1;
  notificationPopup:string = '';

  //filter contract
  contractType:any;
  contractNumber:any;
  startCreateDate:any;
  endCreateDate:any;

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
      this.appService.setTitle('DANH SÁCH HỢP ĐỒNG ' + this.convertActionStr() + ' ' + this.convertStatusStr());
    });

    //get list contract
    this.contractService.getContractList().subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      this.setPage();
      console.log(this.pageTotal);
    });

  }

  private convertActionStr(): string{
    if(this.action == 'create'){
      this.type = 'mine';
      return 'ĐÃ TẠO';
    }else if(this.action == 'receive'){
      this.type = 'wait-for-me';
      return 'ĐÃ NHẬN';
    }else{
      return '';
    }
  }

  iconClass = 'col-md-100-1';
  private convertStatusStr(): string{
    if(this.status == 'draft'){
      this.iconClass = 'col-md-100-3';
      return 'BẢN NHÁP';
    }else if(this.status == 'wait-processing'){
      this.iconClass = 'col-md-100-3';
      return 'CHỜ XỬ LÝ';
    }else if(this.status == 'processing'){
      this.iconClass = 'col-md-100-3';
      return 'ĐANG XỬ LÝ';
    }else if(this.status == 'processed'){
      this.iconClass = 'col-md-100-3';
      return 'ĐÃ XỬ LÝ';
    }else if(this.status == 'expire'){
      this.iconClass = 'col-md-100-3';
      return 'SẮP HẾT HẠN';
    }else if(this.status == 'overdue'){
      this.iconClass = 'col-md-100-1';
      return 'QUÁ HẠN';
    }else if(this.status == 'fail'){
      this.iconClass = 'col-md-100-1';
      return 'TỪ CHỐI';
    }else if(this.status == 'cancel'){
      this.iconClass = 'col-md-100-1';
      return 'ĐÃ HỦY BỎ';
    }else if(this.status == 'complete'){
      this.iconClass = 'col-md-100-5';
      return 'ĐÃ HOÀN THÀNH';
    }else{
      return '';
    }
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  autoSearch(event:any){
    this.contractService.getContractList().subscribe(response => {
      this.contracts = this.transform(response.items, event);
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
      return it.contractName.toLocaleLowerCase().includes(searchText);
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
