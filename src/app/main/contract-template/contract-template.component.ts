import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';
import { DeleteContractTemplateDialogComponent } from './dialog/delete-contract-template-dialog/delete-contract-template-dialog.component';
import { ReleaseContractTemplateDialogComponent } from './dialog/release-contract-template-dialog/release-contract-template-dialog.component';
import { ShareContractTemplateDialogComponent } from './dialog/share-contract-template-dialog/share-contract-template-dialog.component';
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

  isShare: string = 'off';
  stateOptions: any[];
  contractTypeList: any[] = [];

  name:any="";
  type:any="";

  constructor(private modalService: NgbModal,
              private appService: AppService,
              private contractTemplateService: ContractTemplateService,
              private router: Router,
              private fb: FormBuilder,
              private toastService : ToastService,
              private dialog: MatDialog,
              private contractTypeService: ContractTypeService) { 

    this.stateOptions = [
      { label: 'Mẫu hợp đồng tạo', value: 'off' },
      { label: 'Mẫu hợp đồng được chia sẻ', value: 'on' },
    ];
  }

  ngOnInit(): void {
    this.appService.setTitle('contract-template.list');
    this.getContractTemplateList();

    this.contractTypeService.getContractTypeList("", "").subscribe(response => {
      console.log(response);
      this.contractTypeList = response;
    });
  }

  getContractTemplateList(){
    //get list contract template
    this.contractTemplateService.getContractTemplateList(this.isShare, this.name, this.type, this.p, this.page).subscribe(response => {
      this.contractsTemplate = response.items;
      //this.pageTotal = response.total_elements;
      this.pageTotal = this.contractsTemplate.length;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }
    });
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  add(){
    this.router.navigate(['/main/contract-template/form/add']);
  }

  openDetail(id:number){
    this.router.navigate(['main/contract-template/form/detail/' + id]);
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

  shareContractTemplate(id:any){
    const data = {
      title: 'CHIA SẺ MẪU HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ShareContractTemplateDialogComponent , {
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
}
