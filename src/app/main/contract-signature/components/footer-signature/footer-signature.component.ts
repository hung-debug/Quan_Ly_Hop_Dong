import {Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {variable} from "../../../../config/variable";
import {MatDialog} from "@angular/material/dialog";
import {ForwardContractComponent} from "../../shared/model/forward-contract/forward-contract.component";
import {ContractService} from "../../../../service/contract.service";
import {DisplayDigitalSignatureComponent} from "../../display-digital-signature/display-digital-signature.component";
import { ToastService } from 'src/app/service/toast.service';
import {DeviceDetectorService} from "ngx-device-detector";
import { UnitService } from 'src/app/service/unit.service';
import {  Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer-signature',
  templateUrl: './footer-signature.component.html',
  styleUrls: ['./footer-signature.component.scss']
})
export class FooterSignatureComponent implements OnInit {
  @Input() datas: any;
  @Input() view: any;
  @Input() recipientId: any;
  @Output() submitChanges = new EventEmitter<number>();
  @Input() confirmSignature: any;
  @Input() coordinateY: any;
  @Input() idElement: any;
  @Input() thePDF: any;
  @Input() pageNumber: number;
  @Input() page1: boolean;
  @Input() pageLast: boolean;

  @Input() pageNum: number;

  @Input() pageBefore: number;

  @Input() status: any;

  is_show_coordination: boolean = false;
  is_data_coordination: any;
  orgId: any;
  numContractUse: any;
  eKYCContractUse: any;
  smsContractUse: any;
  numContractBuy: any;
  eKYCContractBuy: any;
  smsContractBuy: any;
  contractId: any;

  currentUser: any;
  emailRecipients:any;

  pageRendering:any;
  pageNumPending: any = null;

  email: string="email";
  phone: string="phone";

  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private toastService: ToastService,
    private deviceService: DeviceDetectorService,
    private unitService: UnitService,
    private router: Router,
    private _location: Location
  ) {
  }

  lang: string;
  ngOnInit(): void {
    this.getDeviceApp();

    if(sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    } else if(sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    }
  
    let data_coordination = this.datas.is_data_contract.participants;
    let emailCurrent = this.contractService.getAuthCurrentUser().email;
    let isBreak = false;
    for (let i = 0; i < data_coordination.length; i++) {
      for (let j = 0; j < data_coordination[i].recipients.length; j++) {
        if (data_coordination[i].recipients[j].email == emailCurrent) {
          this.is_data_coordination = data_coordination[i];
          isBreak = true;
          break;
        }
      }
      if (isBreak) break
    }

    if (this.is_data_coordination) {
      
      // @ts-ignore
      for (let i = 0; i < this.is_data_coordination.recipients.length; i++) {
        //@ts-ignore
        let element = this.is_data_coordination.recipients[i];
        if(!this.recipientId) {
          if (element.role == 1 && element.email == emailCurrent) {
            if (element.status != 1) {
              this.is_show_coordination = true;
              this.view = true;
              break;
            } else {
              this.is_show_coordination = false;
              break;
            }
          }
        } else {
          if (element.role == 1 && element.email == emailCurrent && element.id == this.recipientId) {
            if (element.status != 1) {
              this.is_show_coordination = true;
              this.view = true;
              break;
            } else {
              this.is_show_coordination = false;
              break;
            }
          }
        }
       
      }
    }
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  getStyleButton() {
    if(window.innerWidth >= 396) {
      return {
        "position": 'absolute',
        "right": 0
      };
    } else {
      return {

      }
    }
    
  }

  switchesValueChange($event: any) {
    console.log("abc")
    console.log("event ", $event);
  }

  indexY: number = 0;
  autoScroll() {
    
    this.coordinateY = this.coordinateY.sort(function(a: number, b: number) {
      return a - b;
    });

    this.idElement =  this.idElement.sort(function(a: number, b: number) {
      return a - b;
    });

    let pdffull: any = document.getElementById('pdf-full');

    if (this.confirmSignature == 1 || this.confirmSignature == 3) {
      pdffull.scrollTo(0, this.coordinateY[this.indexY]);

      let id: any = document.getElementById(this.idElement[this.indexY]);

      if(id) {
        id.style.backgroundColor = 'yellow';
      } 
      for(let i = 0; i < this.idElement.length; i++) {
        if(this.idElement[i] != this.idElement[this.indexY]) {
          let elemet: any =  document.getElementById(this.idElement[i]);
          elemet.style.backgroundColor = '#EBF8FF';
        }
      }
    }

    if (this.indexY <= this.coordinateY.length - 1) {
      this.indexY++;
    } else {
      this.indexY = 0;
      pdffull.scrollTo(0, 0);
    }
  }

  firstPage() {
    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, 0);

    this.pageNum = 1;
  }

  lastPage() {
    let canvas: any = document.getElementById('canvas-step3-'+this.pageNumber);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);

    this.pageNum = this.pageNumber;
  }

  onNextPage() {
    if (this.pageNum >= this.thePDF?.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  previousPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  queueRenderPage(num: any) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      let canvas: any = document.getElementById('canvas-step3-'+num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top)
    }
  }

  onEnter(event: any) {
    let canvas: any = document.getElementById('canvas-step3-'+event.target.value);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);
  }

  action() {
    if (this.datas.action_title == 'dieu_phoi') {
      console.log("datas",this.datas);
      
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
      this.emailRecipients =  this.datas.is_data_contract.participants[1].recipients[0].email;
  
          // response[0].participants[0].recipients[0].email
          if (this.emailRecipients !== this.currentUser.email) {
            
            this.toastService.showErrorHTMLWithTimeout(
              'Bạn không có quyền xử lý hợp đồng này!',
              '',
              3000
            );
            this.router.navigate(['/main/dashboard']);
            return
          };
       
      if (this.is_data_coordination) { // chỉ lấy dữ liệu của người điều phối
        if (this.is_data_coordination['recipients']) {
          let dataCoordination = this.is_data_coordination['recipients'].filter((p: any) => p.role == 1)[0]; // get dữ liệu người điều phối
          if (dataCoordination) {
            this.datas.recipient_id_coordition = dataCoordination.id;
            if (dataCoordination.status == 5) {
              this.toastService.showWarningHTMLWithTimeout("Hợp đồng đang trong quá trình xử lý!", "", 3000);
              return;
            }
          }
        }
        
        // this.datas.determine_contract = this.is_data_coordination; // data determine contract
        this.datas.determine_contract = this.datas.is_data_contract.participants; // data determine contract
        this.datas.step = variable.stepSampleContract.step_confirm_coordination; // set step 2
      }
    } else if ([2, 3, 4].includes(this.datas.roleContractReceived)) {

      this.contractService.getDetermineCoordination(this.recipientId).subscribe((response) => {
        if(response.recipients[0].sign_type.length > 0 && response.recipients[0].sign_type[0].id == 5) {

          this.contractId = response.contract_id;

          console.log("contract id ", this.contractId);

          this.contractService.getDataCoordination(this.contractId).subscribe((response => {
            this.orgId = response.organization_id;
            this.unitService.getUnitById(this.orgId).toPromise().then(
              data => {
                
                //chi lay so luong hop dong khi chon to chuc cha to nhat
                  //lay so luong hop dong da dung
                  this.unitService.getNumberContractUseOriganzation(this.orgId).toPromise().then(
                    data => {
      
                      this.numContractUse = data.contract;
                      this.eKYCContractUse = data.ekyc;
                      this.smsContractUse = data.sms;
      
                              //lay so luong hop dong da mua
                  this.unitService.getNumberContractBuyOriganzation(this.orgId).toPromise().then(
                    data => {
                      this.numContractBuy = data.contract;
                      this.eKYCContractBuy = data.ekyc;
                      this.smsContractBuy = data.sms;
      
                        if(Number(this.eKYCContractUse) + Number(1) > Number(this.eKYCContractBuy)) {
                          this.toastService.showErrorHTMLWithTimeout('Số lượng ekyc sử dụng vượt quá số lượng ekyc đã mua', "", 3000);
                        } else {
                          this.submitChanges.emit(1);
                        }
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã mua', "", 3000);
                    }
                  )          
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã dùng', "", 3000);
                    }
                  )
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin tổ chức', "", 3000);
              }
            )
          }))

         
        } else {
          this.submitChanges.emit(1);
        }
      })

    }
  }

  showSignature() {
    const data = {
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DisplayDigitalSignatureComponent, {
      width: '550px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  refuseContract() {
    if (this.datas.action_title == 'dieu_phoi') {
      this.submitChanges.emit(1);
    }
  }

  downloadFilePDF() {
    this.submitChanges.emit(2);
  }


  getCoordination() {
    if (this.datas.action_title == 'dieu_phoi') {
      let recipient_data = {};
      let data_coordination = this.datas.is_data_contract.participants;
      let emailCurrent = this.contractService.getAuthCurrentUser().email;
      for (let i = 0; i < data_coordination.length; i++) {
        for (let j = 0; j < data_coordination[i].recipients.length; j++) {
          if (data_coordination[i].recipients[j].email == emailCurrent) {
            recipient_data = data_coordination[i];
            break;
          }
        }
      }
      // @ts-ignore
      if (recipient_data && recipient_data['recipients']) {
        // @ts-ignore
        let dataCoordination = recipient_data['recipients'].filter((p: any) => p.role == 1)[0];
        if (dataCoordination) {
          this.recipientId = dataCoordination.id;
        }
      }
    }
  }


  processingAuthorization() {
    this.getCoordination();
    const data = {
      title: 'ỦY QUYỀN XỬ LÝ',
      is_content: 'processing_author',
      dataContract: this.datas,
      recipientId: this.recipientId
    };
    if (this.datas.action_title == 'dieu_phoi') {
      // @ts-ignore
      data['role_coordination'] = 1;
    }
    // @ts-ignore
    const dialogRef = this.dialog.open(ForwardContractComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  forWardContract() {
    this.getCoordination();
    const data = {
      title: 'CHUYỂN TIẾP',
      is_content: 'forward_contract',
      dataContract: this.datas,
      recipientId: this.recipientId
    };
    if (this.datas.action_title == 'dieu_phoi') {
      // @ts-ignore
      data['role_coordination'] = 1;
    }
    // @ts-ignore
    const dialogRef = this.dialog.open(ForwardContractComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

}