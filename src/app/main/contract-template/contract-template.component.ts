import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ToastService } from 'src/app/service/toast.service';
import { DeleteContractTemplateDialogComponent } from './dialog/delete-contract-template-dialog/delete-contract-template-dialog.component';
import { ReleaseContractTemplateDialogComponent } from './dialog/release-contract-template-dialog/release-contract-template-dialog.component';
import { StopContractTemplateDialogComponent } from './dialog/stop-contract-template-dialog/stop-contract-template-dialog.component';
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

  name:any="";
  type:any="";

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractTemplateService: ContractTemplateService,
              private router: Router,
              private fb: FormBuilder,
              private toastService : ToastService,
              private dialog: MatDialog,) { }

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
    this.toastService.showSuccessHTMLWithTimeout("Chia sẻ mẫu hợp đồng thành công", "", 3000);
  }


  deleteContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN XÓA MẪU HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractTemplateDialogComponent, {
      width: '520px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  stopContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN DỪNG PHÁT HÀNH MẪU HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(StopContractTemplateDialogComponent, {
      width: '600px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  releaseContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN PHÁT HÀNH MẪU HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ReleaseContractTemplateDialogComponent, {
      width: '560px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }
}
