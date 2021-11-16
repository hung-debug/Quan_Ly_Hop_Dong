import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  shareForm: any = FormGroup;
  statusContract:string= '';

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractTemplateService: ContractTemplateService,
              private router: Router,
              private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.appService.setTitle('contract-template.list');
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

  confirmChangeStatus(statusContract:string){
    this.statusContract = statusContract;
    if(statusContract == 'Đang phát hành'){
      this.notification = "Bạn có muốn ngừng phát hành mẫu hợp đồng này không?";
    }else{
      this.notification = "Bạn có muốn mở phát hành mẫu hợp đồng này không?";
    }
  }
  sendChangeStatus(statusContract:string){
    this.status = 1;
    if(statusContract == 'Đang phát hành'){
      this.notification = "Ngừng phát hành thành công";
    }else{
      this.notification = "Mở phát hành thành công";
    }
  }

  deleteItem(id:number){
    this.status = 1;
    this.notification = "Xóa mẫu hợp đồng thành công";
  }

  addContractTemplate(){
    this.router.navigate(['/main/form-contract-template/add']);
  }

  organizationList: Array<any> = [];
  emailList: Array<any> = [];
  dropdownOrganizationSettings: any = {};
  dropdownEmailSettings: any = {};
  organizationSelectedItems:any =[];
  //form share
  getDataShare(name:string, code:string){

    this.organizationSelectedItems = [
      {
        item_id: 1,
        item_text: "Công ty cổ phần phần mềm công nghệ",
      }
    ];
    this.shareForm = this.fb.group({
      name : name,
      code: code,
      organization: [this.organizationSelectedItems],
      email: "",
    });
    this.organizationList = [
      {
        item_id: 1,
        item_text: "Công ty cổ phần phần mềm công nghệ cao VHCSOFT 1111111111",
      },
      {
        item_id: 2,
        item_text: "Công ty B",
      }
    ];

    this.emailList = [
      {
        item_id: "doainh@vhc.com.vn",
        item_text: "Đoài NH (doainh@vhc.com.vn)",
      },
      {
        item_id: "doainguyen@vhc.com.vn",
        item_text: "Đoài Nguyễn (doainguyen@vhc.com.vn)",
      }
    ];

    this.dropdownOrganizationSettings = {
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };

    this.dropdownEmailSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }

  get getOrganizationItems() {
    return this.organizationList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }
  get getEmailItems() {
    return this.organizationList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  sendShare(){
    this.status = 1;
    this.notification = "Chia sẻ thành công";
  }
}
