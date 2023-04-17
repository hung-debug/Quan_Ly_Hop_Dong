import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from 'src/app/config/variable';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { throwError } from 'rxjs';
import interact from 'interactjs';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';
@Component({
  selector: 'app-confirm-contract-batch',
  templateUrl: './confirm-contract-batch.component.html',
  styleUrls: ['./confirm-contract-batch.component.scss'],
})
export class ConfirmContractBatchComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() datasBatch: any;
  data_coordinates: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined;
  @Output() stepChangeConfirmInforContractBatch = new EventEmitter<string>();
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  orgId: any;
  objPdfProperties: any = {
    pages: [],
  };

  currPage = 1; //Pages are 1-based not 0-based
  numPages = 0;
  x0: any = 'abc';
  y0: any = 'bcd';
  listEmail: any = [];
  coordinates_signature: any;
  obj_toa_do = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };
  text = 'Chữ ký';
  mouseoverLeftLayer = {
    layerX: 0,
    layerY: 0,
  };
  isMove = false;

  objSignInfo: any = {
    id: '',
    showObjSign: false,
    nameObj: '',
    emailObj: '',
    traf_x: 0,
    traf_y: 0,
    x1: 0,
    y1: 0,
    offsetHeight: 0,
    offsetWidth: 0,
  };

  list_sign_name: any = [];
  signCurent: any;

  isView: any;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;

  pageNumberCurrent: any = 1;
  pageNumberOld: any = 1;
  pageNumberTotal: any = 1;
  contractList: any[] = [];
  isDataContract: any;
  isDataFileContract: any;
  isDataObjectSignature: any;
  data_contract: any;
  allFileAttachment: any[];
  loaded = false;
  isDisablePrevious = false;
  isDisableNext = false;

  data_organization: any;
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = [];
  data_parnter_organization: any = [];

  // isPartySignature: any = [
  //   {id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam'},
  //   {id: 2, name: 'Công ty newEZ Việt Nam'},
  //   {id: 3, name: 'Tập đoàn Bảo Việt'}
  // ]

  sum: number[] = [];
  top: any[] = [];

  constructor(
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private contractTemplateService: ContractTemplateService,
    private router: Router,
    private userService: UserService,
  ) {
    this.step = variable.stepSampleContractBatch.step2;
  }

  ngOnInit() {
    // console.log(this.datasBatch);
    this.spinner.show();
    this.contractService.getContractBatchList(this.datasBatch.contractFile, this.datasBatch.idContractTemplate, this.datasBatch.ceca_push).subscribe((response: any) => {
      this.contractList = response;

      this.pageNumberTotal = this.contractList.length;
      if (this.pageNumberTotal > 0) {
        this.getDataContractSignature(this.pageNumberCurrent - 1);
      }
    }),
      (error: any) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout(
          'Lấy thông tin hợp đồng thất bại',
          '',
          3000
        );
      };

    this.scale = 1;

    if (!this.signCurent) {
      this.signCurent = {
        offsetWidth: 0,
        offsetHeight: 0,
      };
    }
  }

  data: any;
  getDataContractSignature(page: any) {
    this.spinner.show();

    this.checkDisableIcon();
    this.data = this.contractList[page];

    let i = 0;
    this.datasBatch.is_data_object_signature = [];
    this.data.participants.forEach((res: any) => {
      res.recipients.forEach((element: any) => {
        if (
          element.fields &&
          element.fields.length &&
          element.fields.length > 0
        ) {
          element.fields.forEach((res: any) => {
            res['name'] = element.name;

            res['id'] = i++;
            if (res.type == 1) {
              res['sign_unit'] = 'text';
            }
            if (res.type == 2) {
              res['sign_unit'] = 'chu_ky_anh';
            }
            if (res.type == 3) {
              res['sign_unit'] = 'chu_ky_so';
            }
            if (res.type == 4) {
              res['sign_unit'] = 'so_tai_lieu';
            }
            let obj = res;
            this.datasBatch.is_data_object_signature.push(obj);
          });
        }
      });
    });
    let data_sign_config_cks = this.datasBatch.is_data_object_signature.filter(
      (p: any) => p.sign_unit == 'chu_ky_so'
    );
    let data_sign_config_cka = this.datasBatch.is_data_object_signature.filter(
      (p: any) => p.sign_unit == 'chu_ky_anh'
    );
    let data_sign_config_text = this.datasBatch.is_data_object_signature.filter(
      (p: any) => p.sign_unit == 'text'
    );
    let data_sign_config_so_tai_lieu =
      this.datasBatch.is_data_object_signature.filter(
        (p: any) => p.sign_unit == 'so_tai_lieu'
      );

    this.datasBatch.contract_user_sign =
      this.contractService.getDataFormatContractUserSign();

    this.datasBatch.contract_user_sign.forEach((element: any) => {
      // console.log(element.sign_unit, element.sign_config);
      if (element.sign_unit == 'chu_ky_so') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cks);
      } else if (element.sign_unit == 'chu_ky_anh') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
      } else if (element.sign_unit == 'text') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_text);
      } else if (element.sign_unit == 'so_tai_lieu') {
        Array.prototype.push.apply(
          element.sign_config,
          data_sign_config_so_tai_lieu
        );
      }
    });
    this.scale = 1;

    if (!this.signCurent) {
      this.signCurent = {
        offsetWidth: 0,
        offsetHeight: 0,
      };
    }

    // data Tổ chức của tôi
    this.data_organization = this.data?.participants.filter(
      (p: any) => p.type == 1
    )[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter(
      (p: any) => p.role == 2
    );
    this.is_origanzation_signature = this.data_organization.recipients.filter(
      (p: any) => p.role == 3
    );
    this.is_origanzation_document = this.data_organization.recipients.filter(
      (p: any) => p.role == 4
    );

    this.data_parnter_organization = this.data?.participants.filter(
      (p: any) => p.type == 2 || p.type == 3
    );

    console.log("pp ",this.data_parnter_organization);
    this.contractTemplateService
      .getDetailContractV2(this.datasBatch.idContractTemplate)
      .subscribe((rs) => {
        this.datasBatch.i_data_file_contract = rs[1];
        if (this.datasBatch?.i_data_file_contract) {
          let fileC = null;
          const pdfC2 = this.datasBatch.i_data_file_contract.find(
            (p: any) => p.type == 2
          );
          const pdfC1 = this.datasBatch.i_data_file_contract.find(
            (p: any) => p.type == 1
          );
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }
          if (!fileC) {
            this.toastService.showErrorHTMLWithTimeout(
              'Thiếu dữ liệu file hợp đồng!',
              '',
              3000
            );
          } else {
            this.pdfSrc = fileC;
            // render pdf to canvas
            this.getPage();
          }
        }
        this.loaded = true;
        this.spinner.hide();
      });
  }

  getPartnerCoordinationer(item: any) {
    return item.recipients.filter((p: any) => p.role == 1);
  }

  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 2);
  }
  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3);
  }
  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4);
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
      this.list_sign_name.push(item);
    });
  }

  setWidth(d: any) {
    return {
      'width.px': this.widthDrag / 2,
    };
  }

  // view pdf qua canvas
  async getPage() {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf');
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    pdfjs
      .getDocument(this.pdfSrc)
      .promise.then((pdf: any) => {
        this.thePDF = pdf;
        this.pageNumber = pdf.numPages || pdf.pdfInfo.numPages;
        this.removePage();
        this.arrPage = [];
        for (let page = 1; page <= this.pageNumber; page++) {
          let canvas = document.createElement('canvas');
          this.arrPage.push({ page: page });
          canvas.className = 'dropzone';
          canvas.id = 'canvas-step3-' + page;
          // canvas.style.paddingLeft = '15px';
          // canvas.style.border = '9px solid transparent';
          // canvas.style.borderImage = 'url(assets/img/shadow.png) 9 9 repeat';
          let idPdf = 'pdf-viewer-step-3';
          let viewer = document.getElementById(idPdf);
          if (viewer) {
            viewer.appendChild(canvas);
          }
          this.renderPage(page, canvas);
        }
      })
      .then(() => {
        setTimeout(() => {
          this.setPosition();
          this.eventMouseover();

          for (let i = 0; i <= this.pageNumber; i++) {
            this.top[i] = 0;

            if (i < this.pageNumber)
              this.sum[i] = 0;
          }

          for (let i = 1; i <= this.pageNumber; i++) {
            let canvas: any = document.getElementById('canvas-step3-' + i);
            this.top[i] = canvas.height;
          }


          for (let i = 0; i < this.pageNumber; i++) {
            this.top[i + 1] += this.top[i];
            this.sum[i] = this.top[i + 1];
          }
        }, 100);
      });
  }

  eventMouseover() { }

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      // document.getElementById('input-location-x').focus();
      let width_drag_element = document.getElementById('width-element-info');
      this.widthDrag = width_drag_element
        ? width_drag_element.getBoundingClientRect().right -
        width_drag_element.getBoundingClientRect().left -
        15
        : '';
    }, 100);
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
          if (element['coordinate_x'] && element['coordinate_y']) {
            // @ts-ignore
            a.style['z-index'] = '1';
          }
          // else
          //   a.style.display = 'none';
          a.setAttribute('data-x', element['coordinate_x']);
          a.setAttribute('data-y', element['coordinate_y']);
        }
      });
    }
  }

  removePage() {
    for (let page = 1; page <= this.pageNumber; page++) {
      let idCanvas = 'canvas-step3-' + page;
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
      let viewport = page.getViewport({ scale: this.scale });
      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let _objPage = this.objPdfProperties.pages.filter(
        (p: any) => p.page_number == pageNumber
      )[0];
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
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
      }, 2000);
      if (test) {
        let paddingPdf =
          (test.getBoundingClientRect().width - viewport.width) / 2;
        $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
        $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
      }
      this.activeScroll();
    });
  }

  activeScroll() {
    if (document.getElementsByClassName('viewer-pdf')[0]) {
      document
        .getElementsByClassName('viewer-pdf')[0]
        .addEventListener('scroll', () => {
          const Imgs = [].slice.call(document.querySelectorAll('.dropzone'));
          Imgs.forEach((item: any) => {
            if (
              (item.getBoundingClientRect().top <= window.innerHeight / 2 &&
                item.getBoundingClientRect().bottom >= 0 &&
                item.getBoundingClientRect().top >= 0) ||
              (item.getBoundingClientRect().bottom >= window.innerHeight / 2 &&
                item.getBoundingClientRect().bottom <= window.innerHeight &&
                item.getBoundingClientRect().top <= 0)
            ) {
              let page = item.id.split('-')[2];
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
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: '#EBF8FF',
    };
    style.backgroundColor = d.value ? '' : '#EBF8FF';
    if (d['width']) {
      style.width = parseInt(d['width']) + 'px';
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + 'px';
    }
    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670) {
      return {
        overflow: 'auto',
        height: 'calc(50vh - 113px)',
      };
    } else return {};
  }

  // hàm stype đối tượng boder kéo thả
  changeColorDrag(role: any, valueSign: any) {
    if (!valueSign.value) {
      return 'ck-da-keo';
    } else {
      return 'employer-ck';
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
    } else signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter(
        (p: any) => p.id == this.objSignInfo.id
      )[0];
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
          this.objSignInfo.text_attribute_name = d.text_attribute_name;
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
        });
      } else {
        //@ts-ignore
        document.getElementById('select-dropdown').value = '';
      }
    }
  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    if (this.datasBatch && this.datasBatch.is_data_object_signature && this.datasBatch.is_data_object_signature.length) {
      return this.datasBatch.is_data_object_signature;
    } else {
      return [];
    }
  }

  showThumbnail() {
    this.objSignInfo.showObjSign = false;
  }

  // tạo id cho đối tượng chưa được kéo thả
  getIdSignChuaKeo(id: any) {
    return 'chua-keo-' + id;
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
      let isObjSign = this.convertToSignConfig().filter(
        (p: any) => p.id == this.objSignInfo.id
      )[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute('data-x', isObjSign.coordinate_x);
          } else {
            isObjSign.coordinate_y = parseInt(e);
            signElement.setAttribute('data-y', isObjSign.coordinate_y);
          }
        } else if (property == 'size') {
          if (locationChange == 'width') {
            isObjSign.width = parseInt(e);
            signElement.setAttribute('width', isObjSign.width);
          } else {
            isObjSign.height = parseInt(e);
            signElement.setAttribute('height', isObjSign.height);
          }
        } else if (property == 'text') {
          isObjSign.text_attribute_name = e;
          signElement.setAttribute(
            'text_attribute_name',
            isObjSign.text_attribute_name
          );
        } else {
          let data_name = this.list_sign_name.filter(
            (p: any) => p.id == e.target.value
          )[0];
          if (data_name) {
            isObjSign.name = data_name.name;
            signElement.setAttribute('name', isObjSign.name);

            isObjSign.signature_party = data_name.sign_unit;
            signElement.setAttribute(
              'signature_party',
              isObjSign.signature_party
            );
          }
        }
      }
    }
  }

  getTrafX() {
    if (Math.round(this.objSignInfo.traf_x) <= 0) {
      return Math.round(this.objSignInfo.traf_x);
    } else return Math.round(this.objSignInfo.traf_x) - 1;
  }

  getTrafY() {
    return Math.round(this.objSignInfo.traf_y);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datasBatch.stepLast = step;
    this.stepChangeConfirmInforContractBatch.emit(step);
  }

  getNameContract(data: any) {
    return (' ' + data.file_name + ',').replace(/,\s*$/, '');
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  nextPage() {
    this.pageNumberCurrent++;
    this.pageNumberOld = this.pageNumberCurrent;
    this.getDataContractSignature(this.pageNumberCurrent - 1);
  }

  previousPage() {
    this.pageNumberCurrent--;
    this.pageNumberOld = this.pageNumberCurrent;
    this.getDataContractSignature(this.pageNumberCurrent - 1);
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

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  user: any;
  submit() {

    if (!this.datasBatch.ceca_push)
      this.datasBatch.ceca_push = 0;

    this.next(this.datasBatch.ceca_push);
    // const data = {
    //   title: 'YÊU CẦU XÁC NHẬN',
    // };
    // // @ts-ignore
    // const dialogRef = this.dialog.open(ConfirmCecaFormComponent, {
    //   width: '560px',
    //   backdrop: 'static',
    //   keyboard: false,
    //   data,
    //   autoFocus: false,
    // });
    // dialogRef.afterClosed().subscribe((isCeCA: any) => {
    //   if (isCeCA == 1 || isCeCA == 0) {
    //     this.next(isCeCA);
    //   }
    // });
  }

  async next(isCeCA: any) {
    const isAllow = await this.checkNumber(this.datasBatch.ceca_push, this.convertToSignConfig().length);
    if (isAllow) {
      this.spinner.show();

      this.contractService
        .confirmContractBatchList(
          this.datasBatch.contractFile,
          this.datasBatch.idContractTemplate,
          isCeCA
        )
        .subscribe((response: any) => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/main/contract/create/processing']);
            });
          this.spinner.hide();
          this.toastService.showSuccessHTMLWithTimeout(
            'Tạo hợp đồng theo lô thành công',
            '',
            3000
          );
        }),
        (error: any) =>
          this.toastService.showErrorHTMLWithTimeout(
            'Tạo hợp đồng theo lô thất bại',
            '',
            3000
          );
    }
  }

  async checkNumber(countCeCa: number, countTimestamp: number) {

    this.orgId = this.userService.getInforUser().organization_id;
    let getNumberContractCreateOrg;
    try {
      getNumberContractCreateOrg = await this.contractService.getDataNotifyOriganzation().toPromise();
    } catch (err) {
      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin số lượng hợp đồng' + err, '', 3000);
    }

    if ((countCeCa > 0 && (Number(getNumberContractCreateOrg.numberOfCeca) - this.datasBatch.ceca_push) < 0) &&
      (countTimestamp > 0 && (Number(getNumberContractCreateOrg.numberOfTimestamp) - this.convertToSignConfig().length) < 0)) {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng timestamp và số lần gửi xác nhận BCT đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
      return false;
    }
    else if (countTimestamp > 0 && (Number(getNumberContractCreateOrg.numberOfTimestamp) - this.convertToSignConfig().length) < 0) {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng timestamp đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
      return false;
    }
    else if (countCeCa > 0 && (Number(getNumberContractCreateOrg.numberOfCeca) - this.datasBatch.ceca_push) < 0) {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lần gửi xác nhận BCT. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
      return false;
    }
    return true
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
    let canvas: any = document.getElementById('canvas-step3-' + this.pageNumber);

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

  previousPagePdf() {
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
      let canvas: any = document.getElementById('canvas-step3-' + num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top)
    }
  }

  onEnter(event: any) {
    let canvas: any = document.getElementById('canvas-step3-' + event.target.value);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);
  }

  scroll(event: any) {
    //đổi màu cho nút back page
    let canvas1: any = document.getElementById('canvas-step3-1');

    if (event.srcElement.scrollTop < canvas1.height / 2) {
      this.page1 = false;
    } else {
      this.page1 = true;
    }

    //đổi màu cho nút next page
    let canvasLast: any = document.getElementById('canvas-step3-' + this.pageNumber);
    let step3: any = document.getElementById('pdf-viewer-step-3');
    if (event.srcElement.scrollTop < Number(canvasLast.getBoundingClientRect().top - step3.getBoundingClientRect().top)) {
      this.pageLast = true;
    } else {
      this.pageLast = false;
    }

    this.pageNum = Number(Math.floor(event.srcElement.scrollTop / canvas1.height) + 1);

    let scrollTop = Number(event.srcElement.scrollTop);

    for (let i = 0; i < this.sum.length; i++) {
      if (this.sum[i] < scrollTop && scrollTop < this.sum[i + 1]) {
        this.pageNum = Number(i + 2);
      }
    }
  }
}
