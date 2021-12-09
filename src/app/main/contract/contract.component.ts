import { UploadService } from 'src/app/service/upload.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerOptions } from 'ng2-datepicker';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';

import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { ToastService } from 'src/app/service/toast.service';
import { HttpClient } from '@angular/common/http';
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

  title:any="";
  id:any="";
  notification:any="";

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
              private contractService: ContractService,
              private route: ActivatedRoute,
              private router: Router,
              private toastService : ToastService,
              private http: HttpClient,
              private uploadService: UploadService,
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
      this.convertStatusStr();

      this.appService.setTitle(this.convertActionStr());

      this.getContractList();
    });



  }

  private getContractList(){
    this.p = 1;
    //get list contract
    this.contractService.getContractList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      this.contracts = data.entities;
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
        let participants = key.participants;
        //console.log(participants);
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          }else{
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
      });
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

  private convertStatusStr(){
    if(this.status == 'draft'){
      this.filter_status = 0;
      this.title = 'contract.status.draft';
    }else if(this.status == 'wait-processing'){
      this.title = 'contract.status.wait-processing';
    }else if(this.status == 'processing'){
      this.filter_status = 20;
      this.title = 'contract.status.processing';
    }else if(this.status == 'processed'){
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
    this.contractService.getContractList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status).subscribe(data => {
      this.contracts = this.transform(data.entities, event);
      this.pageTotal = this.contracts.length;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }

      this.contracts.forEach((key : any, v: any) => {
        let participants = key.participants;
        console.log(participants);
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          }else{
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
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
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

  openDetail(id:number){
    this.router.navigate(['main/form-contract/detail/' + id]);
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

  getDataContractCancel(id:any){
    this.id=id;
    this.notification="Bạn có chắc chắn muốn hủy hợp đồng không?";
  }

  changeStatus(id:any, status:any){
    this.contractService.changeStatusContract(id, status).subscribe((data) => {

      console.log(JSON.stringify(data));
      this.router.navigate(['/main/contract/create/cancel']);
      this.toastService.showSuccessHTMLWithTimeout("Hủy hợp đồng thành công!", "", 10000);
    },
    error => {
      this.toastService.showSuccessHTMLWithTimeout("Hủy hợp đồng thất bại!", "", 10000);
      return false;
    }
    );
  }

  downloadContract(id:any){
    this.contractService.getFileContract(id).subscribe((data) => {
      //console.log(data);
      this.uploadService.downloadFile(data[0].path).subscribe((response: any) => {
        //console.log(response);

        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = data[0].name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 10000);
      }), (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 10000);
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("no.contract.get.file.error", "", 10000);
    }
     );
  }

}
