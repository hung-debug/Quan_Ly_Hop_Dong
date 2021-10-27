import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  status: string;
  private sub: any;
  closeResult:string= '';
  public contracts: any[] = [];
  p:number = 1;
  page:number = 3;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractService: ContractService,
              private route: ActivatedRoute,
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
      this.status = params['status'];

      //set title
      this.appService.setTitle('DANH SÁCH HỢP ĐỒNG ' + this.convertStatusStr());
    });

    //get list contract
    this.contractService.getContractList().subscribe(response => {
      this.contracts = response.items;
      this.pageTotal = this.contracts.length;
      this.setPage();
      console.log(this.pageTotal);
    });

  }


  iconClass = 'col-md-100-1';
  private convertStatusStr(): string{
    if(this.status == 'draft'){
      this.iconClass = 'col-md-100-3';
      return 'BẢN NHÁP';
    }else if(this.status == 'processing'){
      this.iconClass = 'col-md-100-3';
      return 'ĐANG XỬ LÝ';
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

}
