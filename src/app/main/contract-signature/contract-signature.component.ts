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
import { UploadService } from 'src/app/service/upload.service';
import { ToastService } from 'src/app/service/toast.service';
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
              private uploadService: UploadService,
              private toastService: ToastService,
  ) {
    this.constantModel = contractModel;
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
      this.status = params['status'];

      //set title
      this.convertStatusStr();
      this.action = 'receive';
      this.type = 'wait-for-me';
      this.appService.setTitle(this.convertActionStr());

      this.getContractList();
    });
  }

  getContractList() {
    //get list contract share
    if(this.filter_status == -1){
      this.contractService.getContractShareList(this.p, this.page).subscribe(data => {
        this.contracts = data.entities;
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.contracts.forEach((key : any, v: any) => {
          let participants = key.participants;
          participants.forEach((key : any, val: any) => {
            if (key.type == 1) {
              this.contracts[v].sideA = key.name;
            }else{
              this.contracts[v].sideB = key.name;
            }
          })
        });
      });
    }else if(this.filter_status == 1 || this.filter_status == 4){
      this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
        console.log(data.entities);
        this.contracts = data.entities
  
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.contracts.forEach((key: any, v: any) => {
          this.contracts[v].contractId = key.participant.contract.id;
          this.contracts[v].contractName = key.participant.contract.name;
          this.contracts[v].contractNumber = key.participant.contract.code;
          this.contracts[v].contractSignTime = key.participant.contract.sign_time;
          this.contracts[v].contractCreateTime = key.participant.contract.created_time;
          this.contracts[v].contractStatus = key.participant.contract.status;
          this.contracts[v].sideA = key.participant.contract.participants[0]?.name;
          this.contracts[v].sideB = key.participant.contract.participants[1]?.name;
        });
      });
    }else {
      console.log(this.filter_status%10);
      this.contractService.getContractMyProcessDashboard(this.filter_status%10, this.p, this.page).subscribe(data => {
        console.log(data.entities);
        this.contracts = data.entities
  
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.contracts.forEach((key : any, v: any) => {
          key.participants.forEach((key : any, val: any) => {
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
  }

  //auto search
  autoSearch(event: any) {
    this.p = 1;
    //get list contract share
    if(this.filter_status == -1){
      this.contractService.getContractShareList(this.p, this.page).subscribe(data => {
        this.contracts = this.transform(data.entities, event);
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
  
        this.contracts.forEach((key : any, v: any) => {
          let participants = key.participants;
          participants.forEach((key : any, val: any) => {
            if (key.type == 1) {
              this.contracts[v].sideA = key.name;
            }else{
              this.contracts[v].sideB = key.name;
            }
          })
        });
      });
    }else if(this.filter_status == 1 || this.filter_status == 4){
      this.contractService.getContractMyProcessList(this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
        this.contracts = this.transform(data.entities, event);
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
  
        this.contracts.forEach((key: any, v: any) => {
          this.contracts[v].contractId = key.participant.contract.id;
          this.contracts[v].contractName = key.participant.contract.name;
          this.contracts[v].contractNumber = key.participant.contract.code;
          this.contracts[v].contractSignTime = key.participant.contract.sign_time;
          this.contracts[v].contractCreateTime = key.participant.contract.created_time;
        });
      });
    }else{
      this.contractService.getContractMyProcessDashboard(this.filter_status%10, this.p, this.page).subscribe(data => {
        console.log(data.entities);
        this.contracts = data.entities
  
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.contracts.forEach((key: any, v: any) => {
          this.contracts[v].contractId = key.participant.contract.id;
          this.contracts[v].contractName = key.participant.contract.name;
          this.contracts[v].contractNumber = key.participant.contract.code;
          this.contracts[v].contractSignTime = key.participant.contract.sign_time;
          this.contracts[v].contractCreateTime = key.participant.contract.created_time;
          this.contracts[v].contractStatus = key.participant.contract.status;
          this.contracts[v].sideA = key.participant.contract.participants[0]?.name;
          this.contracts[v].sideB = key.participant.contract.participants[1]?.name;
        });
      });
    }
  }

  private convertActionStr(): string {
    return 'contract.list.received';
  }

  private convertStatusStr() {
    if (this.status == 'wait-processing') {
      this.filter_status = 1;
    } else if (this.status == 'processed') {
      this.filter_status = 4;
    } else if (this.status == 'share') {
      this.filter_status = -1;
    } else if (this.status == 'dashboard-wait-processing') {
      this.filter_status = 11;
    } else if (this.status == 'dashboard-prepare-expires') {
      this.filter_status = 12;
    } else if (this.status == 'dashboard-waiting') {
      this.filter_status = 13;
    } else if (this.status == 'dashboard-complete') {
      this.filter_status = 14;
    }
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
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

  downloadContract(id:any){
    this.isContractService.getFileContract(id).subscribe((data) => {
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

        this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
      }), (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 3000);
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("no.contract.get.file.error", "", 3000);
    }
     );
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
