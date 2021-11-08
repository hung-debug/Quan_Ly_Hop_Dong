import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  status:number = 1;
  notification:string = '';
  closeResult:string= '';
  error:boolean = false;
  errorDetail:string = '';

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

  //open popup
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //close popup
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  sendStatus(status:string){
    this.status = 1;
    if(status == 'Đang phát hành'){
      this.notification = "Ngừng phát hành thành công";
    }else{
      this.notification = "Mở phát hành thành công";
    }
  }

  deleteItem(id:number){
    this.status = 1;
    this.notification = "Xóa mẫu hợp đồng thành công";
  }

}
