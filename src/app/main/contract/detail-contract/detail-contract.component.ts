import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UploadService } from 'src/app/service/upload.service';
import interact from "interactjs";
import {variable} from "../../../config/variable";
import Swal from 'sweetalert2';
import * as $ from "jquery";
import {ProcessingHandleEcontractComponent} from "../../contract-signature/shared/model/processing-handle-econtract/processing-handle-econtract.component"
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';

import { of } from 'rxjs';

import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import domtoimage from 'dom-to-image';
import { DialogSignManyComponentComponent } from '../../contract-signature/dialog/dialog-sign-many-component/dialog-sign-many-component.component';
import { HsmDialogSignComponent } from '../../contract-signature/components/consider-contract/hsm-dialog-sign/hsm-dialog-sign.component';

import { encode } from 'base64-arraybuffer';


@Component({
  selector: 'app-detail-contract',
  templateUrl: './detail-contract.component.html',
  styleUrls: ['./detail-contract.component.scss']
})
export class DetailContractComponent implements OnInit, OnDestroy {

  datas: any;
  data_contract: any;
  data_coordinates: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined
  @Output() stepChangeSampleContract = new EventEmitter<string>();
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };
  confirmConsider = null;
  confirmSignature = null;
  pageMobile = 1;

  currPage = 1; //Pages are 1-based not 0-based
  numPages = 0;
  x0: any = "abc";
  y0: any = "bcd";
  listEmail: any = [];
  coordinates_signature: any;
  obj_toa_do = {
    x1: 0, y1: 0, x2: 0, y2: 0
  }
  text = 'Chữ ký';
  mouseoverLeftLayer = {
    layerX: 0,
    layerY: 0,
  }
  isMove = false;

  objSignInfo: any = {
    id: "",
    showObjSign: false,
    nameObj: "",
    emailObj: "",
    traf_x: 0,
    traf_y: 0,
    x1: 0,
    y1: 0,
    offsetHeight: 0,
    offsetWidth: 0
  }

  list_sign_name: any = [];
  signCurent: any;
  currentUser: any;

  isView: any;
  view = true;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;
  loaded: boolean = false;

  isPartySignature: any = [
    {id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam'},
    {id: 2, name: 'Công ty newEZ Việt Nam'},
    {id: 3, name: 'Tập đoàn Bảo Việt'}
  ];

  optionsSign: any = [
    {item_id: 1, item_text: this.translate.instant('sign_by_eKYC')},
    {item_id: 2, item_text: this.translate.instant('sign_by_token')},
    {item_id: 3, item_text: this.translate.instant('sign_by_pki')},
    {item_id: 4, item_text: this.translate.instant('sign_by_hsm')}
  ];
  typeSign: any = 0;
  isOtp: boolean = false;
  recipientId: any;
  recipient: any;
  idContract: any;
  isDataFileContract: any;
  isDataContract: any;
  isDataObjectSignature: any;
  valid: boolean = false;
  allFileAttachment: any[];
  role:any;
  status:any;
  pdfSrcMobile: string;
  trustedUrl: any;

  consider: boolean = false;

  sum: number[] = [];
  top: any[]= [];

  pageBefore: number;

  filter_name: any;
  filter_type: any;
  filter_contract_no: any;
  filter_from_date: any;
  filter_to_date: any;
  isOrg: any;
  organization_id: any;

  statusLink: any;
  signBefore: boolean = false;
  isMultiSign: boolean = false;
  contractsSignManyChecked: any;
  idInListMultiSign: any = [];
  pageNumberCurrent: any = 1;
  pageNumberOld: any = 1;
  pageNumberTotal: any = 1;
  isDisablePrevious = false;
  isDisableNext = false;

  dataHsm: any;
  public contractsSignMany: any[] = [];
  nameCompany: any;
  signCertDigital: any;

  constructor(
    private contractService: ContractService,
    private checkViewContractService: CheckViewContractService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastService : ToastService,
    private uploadService : UploadService,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private _location: Location,
    private spinner: NgxSpinnerService

  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }


  async ngOnInit(): Promise<void> {
    this.getDeviceApp();

    this.route.queryParams.subscribe(params => {
        this.pageBefore = params.page;

        if(params.action == 'sign') {
          this.signBefore = true;
        }

        if (typeof params.filter_name != 'undefined' && params.filter_name) {
          this.filter_name = params.filter_name;
        } else {
          this.filter_name = "";
        }
        if (typeof params.filter_type != 'undefined' && params.filter_type) {
          this.filter_type = params.filter_type;
        } else {
          this.filter_type = "";
        }
        if (typeof params.filter_contract_no != 'undefined' && params.filter_contract_no) {
          this.filter_contract_no = params.filter_contract_no;
        } else {
          this.filter_contract_no = "";
        }
        if (typeof params.filter_from_date != 'undefined' && params.filter_from_date) {
          this.filter_from_date = params.filter_from_date;
        } else {
          this.filter_from_date = "";
        }
        if (typeof params.filter_to_date != 'undefined' && params.filter_to_date) {
          this.filter_to_date = params.filter_to_date;
        } else {
          this.filter_to_date = "";
        }
        if (typeof params.isOrg != 'undefined' && params.isOrg) {
          this.isOrg = params.isOrg;
        } else {
          this.isOrg = "";
        }
        if (typeof params.organization_id != 'undefined' && params.organization_id) {
          this.organization_id = params.organization_id;
        } else {
          this.organization_id = "";
        }

        if (typeof params.status != 'undefined' && params.status) {
          this.statusLink = params.status;
        } else {
          this.statusLink = "";
        }
    });

    this.appService.setTitle(this.translate.instant('contract.detail'));

    //Lấy thông tin id hợp đồng
    this.idContract = this.activeRoute.snapshot.paramMap.get('id');


      this.isMultiSign = sessionStorage.getItem('isMultiSign') == 'true' ? true : false;

      if(this.isMultiSign){
        this.appService.setTitle(this.translate.instant('contract.list.detail'));
        this.contractsSignManyChecked = JSON.parse(sessionStorage.getItem('contractsSignManyChecked')!);
        console.log(this.contractsSignManyChecked);
        for(let i=0; i<this.contractsSignManyChecked.length; i++){
          this.idInListMultiSign.push(this.contractsSignManyChecked[i].contractId);
        }
        this.pageNumberTotal = this.idInListMultiSign.length;
        if (this.pageNumberTotal > 0) {
          this.getDataContractSignature(this.pageNumberCurrent - 1);
        }
      }else{
        this.appService.setTitle(this.translate.instant('contract.detail'));
        this.getDataContractSignature();
      }

    
  }

  
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.actionBack();
  }
  
  firstPageMobile() {
    this.pageMobile = 1;
    this.page1 = false;
    this.pageLast = true;
  }

  previousPageMobile() {
    if(this.pageMobile > 1) {
      this.pageMobile--;
    }
  }

  onNextPageMobile() {
    if(this.pageMobile < this.pageNumber) {
      this.pageMobile++;
      this.page1 = true;
    }
  }

  lastPageMobile() {
    this.pageMobile = this.pageNumber;
    this.page1 = true;
    this.pageLast = false;
  }

  pagechanging(event: any) {
    if(event.pageNumber > 1 && event.pageNumber < this.pageNumber) {
      this.page1 = true;
      this.pageLast = true;
    } else if(event.pageNumber == 1) {
      this.page1 = false;
      this.pageLast = true;
    } else if(event.pageNumber = this.pageNumber) {
      this.page1 = true;
      this.pageLast = false;
    }
  }

  afterLoadComplete(event: any) {
    this.pageNumber = event._pdfInfo.numPages;
  }

  checkDisableIcon() {
    if (this.pageNumberCurrent == 1) {
      this.isDisablePrevious = true;
    } else {
      this.isDisablePrevious = false;
    }
    if (this.pageNumberCurrent == this.pageNumberTotal) {
      this.isDisableNext = true;
    } else {
      this.isDisableNext = false;
    }
  }


  getDataContractSignature(pageId?: any) {
     //Lấy thông tin id hợp đồng
     if(this.isMultiSign){
      this.spinner.show();
    }
     console.log(pageId);
     if(pageId==undefined){
      this.idContract = this.activeRoute.snapshot.paramMap.get('id');
      console.log(this.idContract);
     } else {
      this.idContract = this.idInListMultiSign[pageId];
    }

    this.checkDisableIcon();

     //Lấy thông tin recipient id
     this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.recipientId = params.recipientId;
      this.consider = params.consider,
      console.log("recipient id ", this.recipientId);
    });

    this.contractService.getDetailContract(this.idContract).subscribe(rs => {
      console.log("rs ",rs);
      this.isDataContract = rs[0];
      this.isDataFileContract = rs[1];
      this.isDataObjectSignature = rs[2];
      if (rs[0] && rs[1] && rs[1].length && rs[2] && rs[2].length) {
        this.valid = true;
      }
      this.data_contract = {
        is_data_contract: rs[0],
        i_data_file_contract: rs[1],
        is_data_object_signature: rs[2]
      };
      /*let data_coordination = localStorage.getItem('data_coordinates_contract');
      if (data_coordination) {
        this.datas = JSON.parse(data_coordination).data_coordinates;
        this.datas = Object.assign(this.datas, this.data_contract);
      }*/
      this.datas = this.data_contract;
      this.allFileAttachment = this.datas.i_data_file_contract.filter((f: any) => f.type == 3);
      this.checkIsViewContract();
      this.datas.is_data_object_signature.forEach((element: any) => {
        // 1: van ban, 2: ky anh, 3: ky so
        // tam thoi de 1: ky anh, 2: ky so
        if (element.type == 1) {
          element['sign_unit'] = 'text'
        }
        if (element.type == 2) {
          element['sign_unit'] = 'chu_ky_anh'
        }
        if (element.type == 3) {
          element['sign_unit'] = 'chu_ky_so'
        }
        if (element.type == 4) {
          element['sign_unit'] = 'so_tai_lieu'
        }
      })

      let data_sign_config_cks = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_so');
      let data_sign_config_cka = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_anh');
      let data_sign_config_text = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'text');
      // let data_sign_config_so_tai_lieu = this.datas.determine_contract.filter((p: any) => p.sign_unit == 'so_tai_lieu');

      this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();

      this.datas.contract_user_sign.forEach((element: any) => {
        // console.log(element.sign_unit, element.sign_config);
        if (element.sign_unit == 'chu_ky_so') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_cks);
        } else if (element.sign_unit == 'chu_ky_anh') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
        } else if (element.sign_unit == 'text') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_text);
        } else if (element.sign_unit == 'so_tai_lieu') {
          // Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
        }
      })
      if(this.datas?.is_data_contract?.type_id){
        this.contractService.getContractTypes(this.datas?.is_data_contract?.type_id).subscribe(data => {
          if (this.datas?.is_data_contract) {
            this.datas.is_data_contract.type_name = data;
          }
        })
      }

      // }

      // this.datas = this.datas.concat(this.data_contract.contract_information);


      this.datas.action_title = 'Xác nhận';
      //neu nguoi truy cap khong o trong luong ky
      if(!this.recipient?.role){
        this.role = '';
        this.status = this.datas.is_data_contract.status;

      //neu nguoi truy cap o trong luong ky
      }else{
        this.role = this.recipient.role;
        this.status = this.recipient.status;
        this.datas.roleContractReceived = this.recipient.role;
      }

      this.scale = 1;

      if (!this.signCurent) {
        this.signCurent = {
          offsetWidth: 0,
          offsetHeight: 0
        }
      }

      // convert base64 file pdf to url
      if (this.datas?.i_data_file_contract) {
        let fileC = null;
        const pdfC2 = this.datas.i_data_file_contract.find((p: any) => p.type == 2);
        const pdfC1 = this.datas.i_data_file_contract.find((p: any) => p.type == 1);
        if (pdfC2) {
          fileC = pdfC2.path;
        } else if (pdfC1) {
          fileC = pdfC1.path;
        } else {
          return;
        }
        if (!fileC) {
          this.toastService.showErrorHTMLWithTimeout("Thiếu dữ liệu file hợp đồng!", "", 3000);
        } else {
          this.pdfSrc = fileC;
          this.pdfSrcMobile = "https://docs.google.com/viewerng/viewer?url="+this.pdfSrc+"&embedded=true";
          this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrcMobile);
        }
      
      }
      // render pdf to canvas

      if(!this.mobile) {
        this.getPage();
      }

      this.loaded = true;
      if(this.isMultiSign) {
        this.spinner.hide();
      }
    }, (res: any) => {
      // @ts-ignore
      this.handleError();
    })
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  typingPage(event: any) {
    let value = event.target.value;
    if (!value) {
      this.pageNumberCurrent = this.pageNumberOld;
      //this.toastService.showErrorHTMLWithTimeout("Số hợp đồng không được để trống", "", 3000);
    } else if (value > this.pageNumberTotal) {
      this.pageNumberCurrent = this.pageNumberOld;
      //this.toastService.showErrorHTMLWithTimeout("Không nhập số hợp đồng vượt quá " + this.pageNumberTotal, "", 3000);
    } else if (value < 1) {
      this.pageNumberCurrent = this.pageNumberOld;
      //this.toastService.showErrorHTMLWithTimeout("Không nhập số hợp đồng nhỏ hơn 1", "", 3000);
    } else {
      this.pageNumberCurrent = value;
      this.pageNumberOld = this.pageNumberCurrent;
      console.log(this.pageNumberCurrent);
      this.getDataContractSignature(this.pageNumberCurrent - 1);
    }
  }

  nextPage() {
    this.pageNumberCurrent++;
    this.pageNumberOld = this.pageNumberCurrent;
    this.getDataContractSignature(this.pageNumberCurrent - 1);
  }

  signManyContract() {
    //Nếu chọn hợp đồng khác loại ký thì ko cho ký
    let contractsSignManyChecked = this.contractsSignMany.filter((opt) => opt.checked);

    for (let i = 0; i < contractsSignManyChecked.length; i++) {
      for (let j = i + 1; j < contractsSignManyChecked.length; j++) {
        if (contractsSignManyChecked[i].sign_type[0].id != contractsSignManyChecked[j].sign_type[0].id) {
          this.toastService.showErrorHTMLWithTimeout('Vui lòng chọn những hợp đồng cùng loại ký','',3000);
          return;
        }
      }
    }

    //Lay hop dong ky nhieu bang hsm hay usb token
    let signId = contractsSignManyChecked[0].sign_type[0].id;

    let recipientId: any = [];
    let taxCode: any = [];
    let idSignMany: any = [];

    //Lấy id đã tick
    //2: usb token
    //4: hsm
    //id truyen len cua hsm la recipient id: idSignMany = recipientId
    //id truyen len cua usb token la field id
    if (signId == 4) {
      idSignMany = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.id);

      recipientId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.id);

      //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
      for (let i = 0; i < recipientId.length; i++) {
        this.contractService.getDetermineCoordination(recipientId[i]).subscribe((response) => {
            // console.log("response ", response);
            response.recipients.forEach((item: any) => {
              if (item.id == recipientId[i]) {
                taxCode.push(item.fields[0].recipient.cardId);
              }
            });
          });
      }
    } else if (signId == 2) {
      recipientId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.id);

      for (let i = 0; i < recipientId.length; i++) {
        this.contractService.getDetermineCoordination(recipientId[i]).subscribe((response) => {
            response.recipients.forEach((item: any) => {
              if (item.id == recipientId[i]) {
                taxCode.push(item.fields[0].recipient.cardId);
              }
            });
          });
      }
    }

    this.openDialogSignManyComponent(recipientId, taxCode, idSignMany, signId);
  }

  async openDialogSignManyComponent(recipientId: any, taxCode: any, idSignMany: any, signId: any) {
    const dialogRef = this.dialog.open(DialogSignManyComponentComponent, {
      width: '580px',
    });
    
    dialogRef.afterClosed().subscribe(async (result: any) => {
      //result = 1 tương ứng với nhấn nút đồng ý và ký
      if (result == 1) {
        //Mã số thuế tại các hợp đồng cần giống nhau
        for (let i = 0; i < taxCode.length; i++) {
          for (let j = i + 1; j < taxCode.length; j++) {
            if (taxCode[i] != taxCode[j]) {
              this.toastService.showErrorHTMLWithTimeout('Mã số thuế tại các hợp đồng khác nhau','',3000);
              return;
            }
          }
        }

        if (signId == 2) {
          this.spinner.show();

          let contractsSignManyChecked = this.contractsSignMany.filter((opt) => opt.checked);

          let idSignMany: any = [];
          let idContract: any = [];
          let fileC: any = [];
          let documentId: any = [];

          //lấy field id được tích vào
          idSignMany = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.fields[0].id);

          //lấy recipientId
          recipientId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.id);

          //Lấy id hợp đồng được tích vào
          idContract = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.participant.contract.id);

          //Lấy id file được tích vào
          documentId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.fields[0].documentId);

          //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
          for (let i = 0; i < recipientId.length; i++) {
            try {
              const determineCoordination = await this.contractService.getDetermineCoordination(recipientId[i]).toPromise();
              determineCoordination.recipients.forEach((item: any) => {
                if(item.id == recipientId[i]) {
                  taxCode.push(item.fields[0].recipient.cardId)
                }
              })
            } catch(err) {
              this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin người tham gia hợp đồng','',3000);
              return false;
            }
        

          }

          for (let i = 0; i < idContract.length; i++) {
            try {
              const fileContract = await this.contractService.getFileContract(idContract[i]).toPromise();
              fileC.push(fileContract[0].path)
            } catch(err) {
              this.toastService.showErrorHTMLWithTimeout('Lỗi lấy file cần ký','',3000);
              return false;
            }
    
          }

          this.signUsbTokenMany(fileC,idContract,recipientId,documentId,taxCode,idSignMany);

        } else if (signId == 4) {
          //Ký nhiều hsm
          //Mở popup ký hsm
          const data = {
            id: 1,
            title: 'CHỮ KÝ HSM',
            is_content: 'forward_contract',
          };

          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '497px';
          dialogConfig.hasBackdrop = true;
          dialogConfig.data = data;

          const dialogRef = this.dialog.open(HsmDialogSignComponent,dialogConfig);

          dialogRef.afterClosed().subscribe(async (resultHsm: any) => {
            if (resultHsm) {
              this.nameCompany = resultHsm.ma_dvcs;

              await of(null).pipe(delay(100)).toPromise();
              const imageRender = <HTMLElement>(
                document.getElementById('export-html-hsm')
              );
              let signI = '';

              if (imageRender) {
                const textSignB = await domtoimage.toPng(imageRender);
                signI = textSignB.split(',')[1];
              }

              this.dataHsm = {
                ma_dvcs: resultHsm.ma_dvcs,
                username: resultHsm.username,
                password: resultHsm.password,
                password2: resultHsm.password2,
                image_base64: signI,
              };

              this.spinner.show();

              //Call api ký nhiều hsm
              const checkSign = await this.contractService.signHsmMulti(this.dataHsm,idSignMany);

              let countSuccess = 0;

              for (let i = 0; i < checkSign.length; i++) {
                if (checkSign[i].result.success == false) {
                  this.spinner.hide();

                  if (checkSign[i].result.message == 'Tax code do not match!') {
                    this.toastService.showErrorHTMLWithTimeout('taxcode.not.match','',3000);
                  } else if (checkSign[i].result.message == 'Mat khau cap 2 khong dung!') {
                    this.toastService.showErrorHTMLWithTimeout('Mật khẩu cấp 2 không đúng','',3000);
                  } else if (checkSign[i].result.message == 'License ky so HSM het han!') {
                    this.toastService.showErrorHTMLWithTimeout('License ký số HSM hết hạn!','', 3000);
                  } else {
                    this.toastService.showErrorHTMLWithTimeout(checkSign[i].result.message,'',3000);
                  }
                  return;
                } else {
                  countSuccess++;
                }
              }

              if (countSuccess == checkSign.length) {
                this.spinner.hide();
                this.toastService.showSuccessHTMLWithTimeout('sign.success','',3000);

                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['main/c/receive/processed']);
                });
              }
            }
          });
        }
      }
    });
  }

  //Ký usb token v1
  async signTokenVersion1(fileC: any,idContract: any,recipientId: any,documentId: any,taxCode: any,idSignMany: any) {
    //ky bang usb token
    let base64String: any = [];

    //Toa do x
    let x: any = [];

    //Toa do y
    let y: any = [];

    //Chieu cao chu ky
    let h: any = [];

    //Chieu rong chu ky
    let w: any = [];

    //Page can ky
    let page: any = [];

    //Chieu dai cau page can ky
    let heightPage: any = [];

    let currentHeight: any = [];

    //tao mang currentHeight toan so 0;
    for (let i = 0; i < fileC.length; i++) {
      currentHeight[i] = 0;
    }

    for (let i = 0; i < fileC.length; i++) {
      const base64StringPdf = await this.contractService.getDataFileUrlPromise(fileC[i]);

      base64String.push(encode(base64StringPdf));

        //Lấy toạ độ ô ký của từng hợp đồng
        const dataObjectSignature = await this.contractService.getDataObjectSignatureLoadChange(idContract[i]).toPromise();

        for(let j = 0; j < dataObjectSignature.length; j++) {
           if(dataObjectSignature[j].recipient) {
            if(recipientId[i] == dataObjectSignature[j].recipient.id) {
                  x.push(dataObjectSignature[j].coordinate_x);
                  y.push(dataObjectSignature[j].coordinate_y);
                  h.push(dataObjectSignature[j].height);
                  w.push(dataObjectSignature[j].width);
  
                  //Lấy ra trang ký của từng file hợp đồng
                  page.push(dataObjectSignature[j].page);
            }
           }
        }
  
        //Lấy thông tin page của hợp đồng
        const infoPage = await this.contractService.getInfoPage(documentId[i]).toPromise();
  
        for (let j = 0; j < infoPage.length; j++) {
          if (infoPage[j].page < page[i]) {
              currentHeight[i] += infoPage[j].height;
          } else if (infoPage[j].page == page[i]) {
              currentHeight[i] += 0;
              heightPage[i] = infoPage[j].height;
              break;
          }
        }
    }

    //Lay thong tin cua usb token
    this.contractService.getAllAccountsDigital().then(async (data) => {
        if (data.data.Serial) {
          //Check trung mst
          this.contractService.checkTaxCodeExist(taxCode[0], data.data.Base64).subscribe(async (response) => {
              if (response.success == true) {
                this.signCertDigital = data.data;
                this.nameCompany = data.data.CN;

                let signI = '';

                await of(null).pipe(delay(100)).toPromise();
                const imageRender = <HTMLElement>(
                  document.getElementById('export-html')
                );
                if (imageRender) {
                  const textSignB = await domtoimage.toPng(imageRender);
                  signI = textSignB.split(',')[1];
                }

                //Lấy chiều dài của các trang trong các hợp đồng ký
                //Gọi api ký usb token nhiều lần
                for (let i = 0; i < fileC.length; i++) {
                  w[i] = x[i] + w[i];

                  // //Tính lại h, y theo chiều dài của các trang trong hợp đồng ký
                  y[i] = heightPage[i] - (y[i] - currentHeight[i]) - h[i];

                  h[i] = y[i] + h[i];

              
                  let dataSignMobi: any = null;
                  try {
                    dataSignMobi = await this.contractService.postSignDigitalMobiMulti(this.signCertDigital.Serial,base64String[i],signI,page[i],h[i],w[i],x[i],y[i]);
                    console.log("dataSignMobi.data.FileDataSigned ", dataSignMobi.data.FileDataSigned);
                  } catch(err) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi call api ký USB Token ','',3000);
                    return false;
                  }

                  if (!dataSignMobi.data.FileDataSigned || !dataSignMobi) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token ' + dataSignMobi.data.ErrorDetail,'',3000);
                    return false;
                  }

                  let sign: any = null;
                  try {
                    sign = await this.contractService.updateDigitalSignatured(idSignMany[i],dataSignMobi.data.FileDataSigned);
                    console.log("sign ", sign);
                  } catch(err) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi  đẩy file sau khi ký USB Token ','',3000);
                    return false;
                  }

                  if (!sign.recipient_id || !sign) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi đẩy file sau khi ký USB Token ','',3000);
                    return false;
                  }

                  let updateInfo: any = null;
                  try {
                    updateInfo = await this.contractService.updateInfoContractConsiderPromise([],recipientId[i]);
                  } catch(err) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật trạng thái hợp đồng ','',3000);
                    return false;
                  }

                  if (!updateInfo.id || !updateInfo) {
                    this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật trạng thái hợp đồng ','',3000);
                    return false;
                  }

                  if (i == fileC.length - 1) {
                    this.spinner.hide();
                    this.toastService.showSuccessHTMLWithTimeout('sign.success','',3000);

                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['main/c/receive/processed']);
                      });
                  }
                }
              } else {
                this.spinner.hide();
                Swal.fire({
                  title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng khớp`,
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b0bec5',
                  confirmButtonText: 'Xác nhận',
                });
              }
            });
        } else {
          this.spinner.hide();
          Swal.fire({
            title: `Vui lòng cắm USB Token hoặc chọn chữ ký số!`,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b0bec5',
            confirmButtonText: 'Xác nhận',
          });
        }
      },
      (err) => {
        this.spinner.hide();
        Swal.fire({
          html:
            'Vui lòng bật tool ký số hoặc tải ' +
            `<a href='/assets/upload/mobi_pki_sign_setup.zip' target='_blank'>Tại đây</a>  và cài đặt`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b0bec5',
          confirmButtonText: 'Xác nhận',
        });
      }
    );
  }

  async signTokenVersion2(fileC: any,idContract: any,recipientId: any,documentId: any,taxCode: any,idSignMany: any) {
    //ky bang usb token
    let base64String: any = [];

    //Toa do x
    let x: any = [];

    //Toa do y
    let y: any = [];

    //Chieu cao chu ky
    let h: any = [];

    //Chieu rong chu ky
    let w: any = [];

    //Page can ky
    let page: any = [];

    //Chieu dai cau page can ky
    let heightPage: any = [];

    let ceca_push: any = [];

    let currentHeight: any = [];

    //tao mang currentHeight toan so 0;
    for (let i = 0; i < fileC.length; i++) {
      currentHeight[i] = 0;
    }

    for (let i = 0; i < fileC.length; i++) {
      const base64StringPdf = await this.contractService.getDataFileUrlPromise(fileC[i]);

      base64String.push(encode(base64StringPdf));

      //Lấy toạ độ ô ký của từng hợp đồng
      const dataObjectSignature = await this.contractService.getDataObjectSignatureLoadChange(idContract[i]).toPromise();

      for(let j = 0; j < dataObjectSignature.length; j++) {
         if(dataObjectSignature[j].recipient) {
          if(recipientId[i] == dataObjectSignature[j].recipient.id) {
                x.push(dataObjectSignature[j].coordinate_x);
                y.push(dataObjectSignature[j].coordinate_y);
                h.push(dataObjectSignature[j].height);
                w.push(dataObjectSignature[j].width);

                //Lấy ra trang ký của từng file hợp đồng
                page.push(dataObjectSignature[j].page);
          }
         }
      }

      //Lấy thông tin page của hợp đồng
      const infoPage = await this.contractService.getInfoPage(documentId[i]).toPromise();

      for (let j = 0; j < infoPage.length; j++) {
        if (infoPage[j].page < page[i]) {
            currentHeight[i] += infoPage[j].height;
        } else if (infoPage[j].page == page[i]) {
            currentHeight[i] += 0;
            heightPage[i] = infoPage[j].height;
            break;
        }
      }

      //Lấy trạng thái ceca của từng hợp đồng
      const cecaContract = await this.contractService.getListDataCoordination(idContract[i]).toPromise();

      if(cecaContract[i].ceca_push == 1) {
        ceca_push.push(true)
      } else {
        ceca_push.push(false);
      }
    }

    //Lay thong tin cua usb token
    var LibList_MACOS = ['nca_v6.dylib'];
    var LibList_WIN = [
      'ShuttleCsp11_3003.dll',
      'eps2003csp11.dll',
      'nca_v6.dll',
    ];

    var OSName = 'Unknown';
    if (window.navigator.userAgent.indexOf('Windows NT 6.2') != -1)
      OSName = 'Windows 8';
    if (window.navigator.userAgent.indexOf('Windows NT 6.1') != -1)
      OSName = 'Windows 7';
    if (window.navigator.userAgent.indexOf('Windows NT 6.0') != -1)
      OSName = 'Windows Vista';
    if (window.navigator.userAgent.indexOf('Windows NT 5.1') != -1)
      OSName = 'Windows XP';
    if (window.navigator.userAgent.indexOf('Windows NT 5.0') != -1)
      OSName = 'Windows 2000';
    if (window.navigator.userAgent.indexOf('Mac') != -1) OSName = 'Mac/iOS';
    if (window.navigator.userAgent.indexOf('X11') != -1) OSName = 'UNIX';
    if (window.navigator.userAgent.indexOf('Linux') != -1) OSName = 'Linux';
    //=================>>Check OS<<=================

    var OperationId = 1;
    var pkcs11Lib = [];
    if (OSName == 'Mac/iOS') {
      pkcs11Lib = LibList_MACOS;
    } else if (OSName == 'UNIX' || OSName == 'Linux') {
      alert('Not Support');
      return;
    } else {
      pkcs11Lib = LibList_WIN;
      OperationId = OperationId;
    }

    var json_req = JSON.stringify({
      pkcs11Lib: pkcs11Lib,
      OperationId: OperationId,
    });

    json_req = window.btoa(json_req);

    //Lay sessionId cua usb token
    const apiSessionId = await this.contractService.signUsbToken('request=' + json_req);
    const sessionId = JSON.parse(window.atob(apiSessionId.data)).SessionId;

    if (!sessionId) {
      Swal.fire({
        html:
          'Vui lòng bật tool ký số hoặc tải ' +
          `<a href='https://drive.google.com/file/d/1MPnntDPSoTX8AitnSEruZB_ovB9M8gOU/view' target='_blank'>Tại đây</a>  và cài đặt`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
      return;
    }

    //Lay thong tin chung thu so cua usb token
    var json_req_cert = JSON.stringify({
      OperationId: 2,
      SessionId: sessionId,
      checkOCSP: 0,
    });
    json_req_cert = window.btoa(json_req_cert);

    const apiCert = await this.contractService.signUsbToken('request=' + json_req_cert);
    const cert = JSON.parse(window.atob(apiCert.data));

    let certInfoBase64 = '';
    if (cert.certInfo) {
      certInfoBase64 = cert.certInfo.Base64Encode;
      this.nameCompany = cert.certInfo.CommonName;
    } else {
      this.toastService.showErrorHTMLWithTimeout(
        'Lỗi không lấy được thông tin usb token',
        '',
        3000
      );
      return;
    }

    //check trùng mã số thuế
    const checkTaxCode = await this.contractService.checkTaxCodeExist(taxCode[0], certInfoBase64).toPromise();

    if (checkTaxCode.success) {
      let signUpdate = {
        id: Number
      };
      let signDigital = {
        signDigitalX: Number,
        signDigitalY: Number,
        signDigitalWidth: Number,
        signDigitalHeight: Number,
        page: Number
      };

      let signI = '';

      await of(null).pipe(delay(100)).toPromise();
      const imageRender = <HTMLElement>document.getElementById('export-html');
      if (imageRender) {
        const textSignB = await domtoimage.toPng(imageRender);
        signI = textSignB.split(',')[1];
      }

      for (let i = 0; i < fileC.length; i++) {
        signUpdate.id = idSignMany[i];
        signDigital.signDigitalX = x[i];
        signDigital.signDigitalY = y[i];
        signDigital.signDigitalWidth = w[i];
        signDigital.signDigitalHeight = h[i];
        signDigital.page = page[i];
        const emptySignature = await this.contractService.createEmptySignature(recipientId[i],signUpdate,signDigital,signI,certInfoBase64).toPromise();
        const base64TempData = emptySignature.base64TempData;
        const fieldName = emptySignature.fieldName;
        const hexDigestTempFile = emptySignature.hexDigestTempFile;

        var json_req = JSON.stringify({
          OperationId: 5,
          SessionId: sessionId,
          DataToBeSign: base64TempData,
          checkOCSP: 0,
          reqDigest: 0,
          algDigest: "SHA_256"
        });

        json_req = window.btoa(json_req);

        try {
          const callServiceDCSigner = await this.contractService.signUsbToken(
            'request=' + json_req
          );

          const dataSignatureToken = JSON.parse(
            window.atob(callServiceDCSigner.data)
          );

          const signatureToken = dataSignatureToken.Signature;

          const mergeTimeStamp = await this.contractService.meregeTimeStamp(recipientId[i],idContract[i],signatureToken,fieldName,certInfoBase64,hexDigestTempFile, ceca_push[i]).toPromise();
          const filePdfSigned = mergeTimeStamp.base64Data;

          const sign = await this.contractService.updateDigitalSignatured(
            idSignMany[i],
            filePdfSigned
          );

          if (!sign.recipient_id) {
            this.toastService.showErrorHTMLWithTimeout('Lỗi ký usb token không cập nhật được recipient id','',3000);
            return false;
          }

          const updateInfo = await this.contractService.updateInfoContractConsiderPromise([],recipientId[i]);

          if (!updateInfo.id) {
            this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật trạng thái hợp đồng ','',3000);
          }

          if (i == fileC.length - 1) {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout('sign.success','',3000);

            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['main/c/receive/processed']);
              });
          }
        } catch (err) {
          this.toastService.showErrorHTMLWithTimeout('Lỗi ký usb token ' + err,'',3000);
          return;
        }
      }
    } else {
      this.spinner.hide();
      Swal.fire({
        title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng mã số thuế/CMT/CCCD của tổ chức`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
    }
  }

  async signUsbTokenMany(fileC: any,idContract: any,recipientId: any,documentId: any, taxCode: any, idSignMany: any) {
    const dataOrg = await this.contractService.getDataNotifyOriganzation().toPromise();

    if (dataOrg.usb_token_version == 1) {
      this.signTokenVersion1(fileC,idContract,recipientId,documentId,taxCode,idSignMany);
    } else if (dataOrg.usb_token_version == 2) {
      this.signTokenVersion2(fileC, idContract, recipientId, documentId,taxCode,idSignMany);
    }
  }

  async getBase64String(fileC: any) {
    return await this.contractService.getDataFileUrlPromise(fileC);
  }


  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getListSignName(listSignForm: any = [], type_unit: string) {
    listSignForm.forEach((item: any) => {
      item['selected'] = false;
      item['sign_unit'] = type_unit;
      item['signType'] = item.signType;
      item['is_disable'] = false;
      this.list_sign_name.push(item)
    })
  }

  setWidth(d: any) {
    return {
      'width.px': (this.widthDrag / 2)
    }
  }

  // view pdf qua canvas
  async getPage() {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf');
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    pdfjs.getDocument(this.pdfSrc).promise.then((pdf: any) => {
      this.thePDF = pdf;

      this.pageNumber = (pdf.numPages || pdf.pdfInfo.numPages)
      this.removePage();
      this.arrPage = [];
      for (let page = 1; page <= this.pageNumber; page++) {
        let canvas = document.createElement("canvas");
        this.arrPage.push({page: page});
        canvas.className = 'dropzone';
        canvas.id = "canvas-step3-" + page;
        // canvas.style.paddingLeft = '15px';
        // canvas.style.border = '9px solid transparent';
        // canvas.style.borderImage = 'url(assets/img/shadow.png) 9 9 repeat';
        let idPdf = 'pdf-viewer-step-3'
        let viewer = document.getElementById(idPdf);
        if (viewer) {
          viewer.appendChild(canvas);
        }
        this.renderPage(page, canvas);
      }
    }).then(() => {
      setTimeout(() => {
        this.setPosition();
        this.eventMouseover();

        for(let i = 0; i <= this.pageNumber;i++) {
          this.top[i] = 0;

          if(i < this.pageNumber)
            this.sum[i] = 0;
        }

        for(let i = 1; i <= this.pageNumber; i++) {
          let canvas: any = document.getElementById('canvas-step3-'+i);
          this.top[i] = canvas.height;
        }
        

        for(let i = 0; i < this.pageNumber; i++) {
          this.top[i+1] += this.top[i];
          this.sum[i] = this.top[i+1];
        }
      }, 100)
    })
  }

  eventMouseover() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      // document.getElementById('input-location-x').focus();
      let width_drag_element = document.getElementById('width-element-info');
      this.widthDrag = width_drag_element ? ((width_drag_element.getBoundingClientRect().right - width_drag_element.getBoundingClientRect().left) - 15) : '';
    }, 100)
    this.setPosition();
    this.eventMouseover();
  }

  // set lại vị trí đối tượng kéo thả đã lưu trước đó
  setPosition() {
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          // if (element['position']) { // @ts-ignore
          if (element['coordinate_x'] && element['coordinate_y']) { // @ts-ignore
            a.style["z-index"] = '1';
          }
          // else
          //   a.style.display = 'none';
          a.setAttribute("data-x", element['coordinate_x']);
          a.setAttribute("data-y", element['coordinate_y']);
        }
      });
    }
  }

  removePage() {
    for (let page = 1; page <= this.pageNumber; page++) {
      let idCanvas = "canvas-step3-" + page;
      let viewCanvas = document.getElementById(idCanvas);
      if (viewCanvas) {
        viewCanvas.remove();
      }
    }
  }

  // hàm render các page pdf, file content, set kích thước width & height canvas
  renderPage(pageNumber: any, canvas: any) {
    //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({scale: this.scale});
      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let _objPage = this.objPdfProperties.pages.filter((p: any) => p.page_number == pageNumber)[0];
      if (!_objPage) {
        this.objPdfProperties.pages.push({
          page_number: pageNumber,
          width: parseInt(viewport.width),
          height: viewport.height,
        });
      }

      var renderContext: any = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };

      var interval = setInterval(() => {
        page.render(renderContext);
      },1000)

      setTimeout(() => {
        clearInterval(interval)
      },2000);

      if (test) {
        let paddingPdf = ((test.getBoundingClientRect().width) - viewport.width) / 2;
        $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
        $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
      }
      this.activeScroll();
    });
  }

  activeScroll() {
    if(document.getElementsByClassName('viewer-pdf')[0]){
    document.getElementsByClassName('viewer-pdf')[0].addEventListener('scroll', () => {
      const Imgs = [].slice.call(document.querySelectorAll('.dropzone'));
      Imgs.forEach((item: any) => {
        if (item.getBoundingClientRect().top <= (window.innerHeight / 2) &&
          (item.getBoundingClientRect().bottom >= 0) &&
          (item.getBoundingClientRect().top >= 0) ||
          (item.getBoundingClientRect().bottom >= (window.innerHeight / 2)) &&
          (item.getBoundingClientRect().bottom <= window.innerHeight) &&
          (item.getBoundingClientRect().top <= 0)) {
          let page = item.id.split("-")[2];
          $('.page-canvas').css('border', 'none');
          let selector = '.page-canvas.page' + page;
          $(selector).css('border', '2px solid #ADCFF7');
        }
      });
    });
  }
  }


  // hàm set kích thước cho đối tượng khi được kéo thả vào trong hợp đồng
  changePosition(d?: any, e?: any, sizeChange?: any, backgroundColor?: string) {
    let style: any = {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    }
    style.backgroundColor = d.value ? '' : '#EBF8FF';
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
    }

    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670) {
      return {
        "overflow": "auto",
        "height": "calc(50vh - 113px)"
      }
    } else return {}
  }

// hàm stype đối tượng boder kéo thả
  changeColorDrag(role: any, valueSign: any, isDaKeo?: any) {
    if (isDaKeo && !valueSign.value) {
      return 'ck-da-keo';
    } else if (!valueSign.value) {
      return 'employer-ck';
    } else {
      return '';
    }
  }

  // get select người ký
  getSignSelect(d: any) {
    // lấy lại id của đối tượng ký khi click
    let set_id = this.convertToSignConfig().filter((p: any) => p.id == d.id)[0];
    let signElement;
    if (set_id) {
      // set lại id cho đối tượng ký đã click
      this.objSignInfo.id = set_id.id;
      // this.objSignInfo.offsetWidth = set_id.offsetWidth;
      // this.objSignInfo.offsetHeight = set_id.offsetWidth;
      signElement = document.getElementById(this.objSignInfo.id);
    } else
      signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      // let is_name_signature = this.list_sign_name.filter((item: any) => item.name == this.objSignInfo.name)[0];
      if (isObjSign) {
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;
        // this.signCurent.name = d.name;

        this.objSignInfo.offsetWidth = parseInt(d.offsetWidth);
        this.objSignInfo.offsetHeight = parseInt(d.offsetHeight);
        // this.signCurent.offsetWidth = d.offsetWidth;
        // this.signCurent.offsetHeight = d.offsetHeight;
        // console.log(this.signCurent)

        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
        }
      }
      if (d.name) {
        this.list_sign_name.forEach((item: any) => {
          // if (item.id == d.id) {
          if (d.sign_unit == 'chu_ky_anh') {
            if (!item.signType.filter((p: any) => p.item_id == 1)[0]) {
              item.is_disable = true;
            } else item.is_disable = false;
          } else if (d.sign_unit == 'chu_ky_so') {
            if (!item.signType.filter((p: any) => p.item_id == 2)[0]) {
              item.is_disable = true;
            } else item.is_disable = false;
          } else item.is_disable = false;

          if (item.name == d.name) {
            item.selected = true;
          } else item.selected = false;
        })
      } else {
        //@ts-ignore
        document.getElementById('select-dropdown').value = "";
      }
    }
  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    if (this.datas && this.isDataObjectSignature && this.isDataObjectSignature.length) {
      return this.datas.is_data_object_signature;
    } else {
      return [];
    }
  }

  processHandleContract() {
    // alert('Luồng xử lý hợp đồng!');
    const data = this.datas;
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '1000px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })

  }

  showThumbnail() {
    this.objSignInfo.showObjSign = false;
  }

  // tạo id cho đối tượng chưa được kéo thả
  getIdSignChuaKeo(id: any) {
    return "chua-keo-" + id;
  }

  ngOnDestroy() {
    interact('.pdf-viewer-step-3').unset();
    interact('.drop-zone').unset();
    interact('.resize-drag').unset();
    interact('.not-out-drop').unset();
    interact.removeDocument(document);
  }

  // edit location doi tuong ky
  changePositionSign(e: any, locationChange: any, property: any) {
    // console.log(e, this.objSignInfo, this.signCurent);
    let signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute("data-x", isObjSign.coordinate_x);
          } else {
            isObjSign.coordinate_y = parseInt(e);
            signElement.setAttribute("data-y", isObjSign.coordinate_y);
          }
        } else if (property == 'size') {
          if (locationChange == 'width') {
            isObjSign.width = parseInt(e);
            signElement.setAttribute("width", isObjSign.width);
          } else {
            isObjSign.height = parseInt(e);
            signElement.setAttribute("height", isObjSign.height);
          }
        } else if (property == 'text') {
          isObjSign.text_attribute_name = e;
          signElement.setAttribute("text_attribute_name", isObjSign.text_attribute_name);
        } else {
          let data_name = this.list_sign_name.filter((p: any) => p.id == e.target.value)[0];
          if (data_name) {
            isObjSign.name = data_name.name;
            signElement.setAttribute("name", isObjSign.name);

            isObjSign.signature_party = data_name.sign_unit;
            signElement.setAttribute("signature_party", isObjSign.signature_party);
          }
        }
        // console.log(this.signCurent)
        // console.log(this.objSignInfo)
      }
    }
  }

  getTrafX() {
    if (Math.round(this.objSignInfo.traf_x) <= 0) {
      return Math.round(this.objSignInfo.traf_x)
    } else
      return Math.round(this.objSignInfo.traf_x) - 1;
  }

  getTrafY() {
    return Math.round(this.objSignInfo.traf_y)
  }

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextOrPreviousStep(step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  dieuphoi() {
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

  getNameContract(data: any) {
    return (' ' + data.file_name + ',').replace(/,\s*$/, "");
  }

  submitEvents(e: any) {
    if (e && e == 1 && !this.validateSignature() && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2))) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc', '', 3000);
      return;
    }
    if (e && e == 1 && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2))) {
      Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          if ([2, 3].includes(this.datas.roleContractReceived)) {
            this.signContractSubmit();
          }
        }
      });
    } else if (e && e == 1 && ((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      ([3,4].includes(this.datas.roleContractReceived) && this.confirmSignature == 2))) {
      this.rejectContract();
    }
    if (e && e == 2) {
      this.downloadContract(this.idContract);
    }
  }

  endContract() {
    this.actionBack();
  }

  actionBack() {
    if(this.pageBefore && this.isOrg) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/contract/create/' + this.statusLink],
        {
          queryParams: {
            'page': this.pageBefore,
            'filter_type': this.filter_type, 
            'filter_contract_no': this.filter_contract_no,
            'filter_from_date': this.filter_from_date,
            'filter_to_date': this.filter_to_date,
            'isOrg': this.isOrg,
            'organization_id': this.organization_id,
            'status': this.statusLink
          },
          skipLocationChange: true
        });
      });
    } else if(this.pageBefore) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/main/c/receive/' + this.statusLink],
        {
          queryParams: {
            'page': this.pageBefore,
            'filter_type': this.filter_type, 
            'filter_contract_no': this.filter_contract_no,
            'filter_from_date': this.filter_from_date,
            'filter_to_date': this.filter_to_date,
            'isOrg': this.isOrg,
            'organization_id': this.organization_id,
            'status': this.statusLink
          },
          skipLocationChange: true
        });
      });
    } else if(this.router.url.includes("forward") || this.signBefore) {
      this.router.navigate(['/main/c/receive/wait-processing']);
    } else {
      if(this.router.url.includes("reject")) {
        this.router.navigate(['/main/c/receive/wait-processing']);
      } else {
        this._location.back();
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

  confirmOtpSignContract() {
    const data = {
      title: 'Xác nhận otp',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
  }

  openPopupSignContract(typeSign: any) {
    if (typeSign == 1) {
      this.imageDialogSignOpen();
    } else if (typeSign == 3) {
      this.pkiDialogSignOpen();
    } else if (typeSign == 4) {
      this.hsmDialogSignOpen();
    }
  }

  imageDialogSignOpen() {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    //   let is_data = result
    // })
  }

  pkiDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ PKI',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    //   let is_data = result
    // })
  }

  hsmDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
  }

  getTextAlertConfirm() {
    if (this.datas.roleContractReceived == 2) {
      if (this.confirmConsider == 1) {
        return 'Bạn có chắc chắn xác nhận hợp đồng này?';
      } else if (this.confirmConsider == 2) {
        return 'Bạn có chắc chắn từ chối hợp đồng này?';
      }
    } else if (this.datas.roleContractReceived == 3) {
      if (this.confirmSignature == 1) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận ký?';
      } else if (this.confirmSignature == 2) {
        return 'Bạn không đồng ý với nội dung của hợp đồng và không xác nhận ký?';
      }
    }
  }

  getNameCoordination() {
    let nameFile = [];
    for (let i = 0; i < this.datas.contract_information.file_related_contract; i++) {

    }
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  signContractSubmit() {

    for(const signUpdate of this.isDataObjectSignature) {
      if (signUpdate && signUpdate.type == 2 && this.datas.roleContractReceived == 3
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {

        const formData = {
          "name": "image.jpg",
          "content": signUpdate.value
        }
        this.contractService.uploadFileImageBase64Signature(formData).subscribe(data => {
          this.datas.filePath = data?.fileObject?.filePath;

          if (this.datas.filePath) {
            signUpdate.value = this.datas.filePath;
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
        });
      }
    }
    setTimeout(() => {
      this.signContract();
    },2000);

  }

  signContract() {
    const signUpdate = this.isDataObjectSignature.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
      .map((item: any) =>  {
      return {
        id: item.id,
        name: item.name,
        value: item.value,
        font: item.font,
        font_size: item.font_size
      }});
    this.contractService.updateInfoContractConsider(signUpdate, this.recipientId).subscribe(
      (result) => {
        this.toastService.showSuccessHTMLWithTimeout(
          this.datas?.roleContractReceived == 3 ? 'Ký hợp đồng thành công' : 'Xem xét hợp đồng thành công'
          , '', 1000);
        this.router.navigate(['/main/contract-signature/receive/processed']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
      }
    )
  }

  async rejectContract() {
    let inputValue = '';
    const { value: textRefuse } = await Swal.fire({
      title: 'Bạn có chắc chắn hủy hợp đồng này không? Vui lòng nhập lý do hủy:',
      input: 'text',
      inputValue: inputValue,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#b0bec5',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập lý do hủy hợp đồng!'
        } else {
          return null;
        }
      }
    })

    if (textRefuse) {
      this.contractService.considerRejectContract(this.recipientId, textRefuse).subscribe(
        (result) => {
          this.toastService.showSuccessHTMLWithTimeout('Hủy hợp đồng thành công', '', 3000);
          this.router.navigate(['/main/contract-signature/receive/processed']);
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
        }
      )
    } else {
      // this.toastService.showWarningHTMLWithTimeout('Bạn cần nhập lý do hủy hợp đồng', '', 3000)
    }

  }

  validateSignature() {
    const validSign = this.isDataObjectSignature.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived && item.required && !item.value && item.type != 3
    )
    return validSign.length == 0;
  }

  t() {
    console.log(this);
  }

  downloadContract(id:any){
    if (this.isDataContract.status == 30) {
      this.contractService.getFileZipContract(id).subscribe((data) => {
          console.log(data)
          this.uploadService.downloadFile(data.path).subscribe((response: any) => {
            //console.log(response);

            let url = window.URL.createObjectURL(response);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = data.filename;
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

  }

  checkIsViewContract() {
    if(this.consider) {
      if (this.datas?.is_data_contract?.participants?.length) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.recipientId == recipient.id) {
              this.recipient = recipient;
              return;
            }
          }
        }
      }
    } else {
      let recipients: any[] = [];
      if (this.datas?.is_data_contract?.participants?.length) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.currentUser.email == recipient.email) {
              recipients.push(recipient);
            }
          }
        }
      }

      if(recipients.length == 2) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.currentUser.email == recipient.email && recipient.role != 1) {
              this.recipient = recipient;
              return;
            }
          }
        }
      } else if(recipients.length == 1) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.currentUser.email == recipient.email) {
              this.recipient = recipient;
              return;
            }
          }
        }
      }
    }
 
  }

  checkStatusUser(status: any, role: any) {
    if (this.isDataContract.status == 30) {
      return this.translate.instant('download');
    }else if (this.isDataContract.status == 32) {
      return this.translate.instant('canceled');
    }else if (this.isDataContract.status == 31) {
      return this.translate.instant('refused');
    }else if (this.isDataContract.release_state == 'HET_HIEU_LUC') {
      return this.translate.instant('overdued');
    }

    if (status == 3) {
      return 'Đã từ chối';
    } else if(status == 4) {
      return 'Đã uỷ quyền/chuyển tiếp';
    }

    let res = '';
    if (status == 0) {
      res += 'Chưa ';
    } else if (status == 1) {
      res += 'Đang ';
    } else if (status == 2 || status == 3) {
      res += 'Đã ';
    }
    if (role == 1) {
      res +=  'điều phối';
    } else if (role == 2) {
      res +=  'xem xét';
    } else if (role == 3) {
      res +=  'ký';
    } else if (role == 4) {
      res =  res + ' đóng dấu';
    }
    return res;
  }

  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;
  
  pageRendering:any;
  pageNumPending: any = null;
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

  scroll(event: any) {
    //đổi màu cho nút back page
    let canvas1: any = document.getElementById('canvas-step3-1');

    if(event.srcElement.scrollTop < canvas1.height/2) {
      this.page1 = false;
    } else {
      this.page1 = true;
    }

    //đổi màu cho nút next page
    let canvasLast: any = document.getElementById('canvas-step3-'+this.pageNumber);
    let step3: any = document.getElementById('pdf-viewer-step-3');
    if(event.srcElement.scrollTop < Number(canvasLast.getBoundingClientRect().top - step3.getBoundingClientRect().top)) {
      this.pageLast = true;
    } else {
      this.pageLast = false;
    }

    this.pageNum = Number(Math.floor(event.srcElement.scrollTop/canvas1.height) + 1);

    let scrollTop = Number(event.srcElement.scrollTop);

    for(let i = 0; i < this.sum.length;i++) {
      if(this.sum[i] < scrollTop && scrollTop < this.sum[i+1]) {
        this.pageNum = Number(i+2);
      }
    }
  }

}
