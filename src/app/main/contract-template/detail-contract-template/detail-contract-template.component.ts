import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { AppService } from 'src/app/service/app.service';
import { ContractSignatureService } from 'src/app/service/contract-signature.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UploadService } from 'src/app/service/upload.service';
import interact from "interactjs";
import * as $ from "jquery";
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ProcessingHandleComponent } from './processing-handle/processing-handle.component';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { UserService } from 'src/app/service/user.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-detail-contract-template',
  templateUrl: './detail-contract-template.component.html',
  styleUrls: ['./detail-contract-template.component.scss']
})
export class DetailContractTemplateComponent implements OnInit, OnDestroy {

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
  canvasHeight = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };
  confirmConsider = null;
  confirmSignature = null;

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
  show_information: boolean = true;
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
  //this.translate.instant('sys.processing')
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
  difX: number = 0;
  arrDifPage: any[] = [];

  sum: number[] = [];
  top: any[]= [];

  roleAccess:boolean=false;
  roleMess:any="";

  pageBefore: number;
  defaultValue: number = 100;
  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;

  pageRendering:any;
  pageNumPending: any = null;
  constructor(
    private contractTemplateService: ContractTemplateService,
    private contractService: ContractService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private dialog: MatDialog,
    private userService: UserService,
    public translate: TranslateService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  ngOnInit(): void {
    this.appService.setTitle('Thông tin chi tiết mẫu hợp đồng');
    this.getDataContractSignature();
  }

  setX(){
    this.datas.isFirstLoadDrag = true;
    let i = 0;
    this.datas.contract_user_sign.forEach((element: any) => {
      if(element.sign_unit == "chu_ky_so") {
        let type = element.type;
        for (let i = 0; i < type.length; i++) {
          type[i].sign_config.forEach((item: any) => {
            const htmlElement: HTMLElement | null = document.getElementById(item.id);
            if(htmlElement) {
              var oldX = Number(htmlElement.getAttribute('data-x'));
              if(oldX) {
                var newX = oldX + this.difX;
                htmlElement.setAttribute('data-x', newX.toString());
              }
            }
            if(this.arrDifPage[Number(item.page)-1] == 'max' ){
              item.coordinate_x += this.difX;
            }
          }) 
        }
      } else {
        element.sign_config.forEach((item: any) => {
          const htmlElement: HTMLElement | null = document.getElementById(item.id);
          if(htmlElement) {
            var oldX = Number(htmlElement.getAttribute('data-x'));
            if(oldX) {
              var newX = oldX + this.difX;
              htmlElement.setAttribute('data-x', newX.toString());
            }
          }
          if(this.arrDifPage[Number(item.page)-1] == 'max' ){
            item.coordinate_x += this.difX;
          }
        })
      }
    })
  }

  endContract() {
    this.actionBack();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.actionBack();
  }

  actionBack() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract-template/'],
      {
        queryParams: {
          'page': this.pageBefore,
        },
        skipLocationChange: true
      });
    });
  }

  getDataContractSignature() {
    this.idContract = this.activeRoute.snapshot.paramMap.get('id');
    this.activeRoute.queryParams
      .subscribe(params => {
          this.recipientId = params.recipientId;
          this.pageBefore = params.page;
        }
      );

    //kiem tra quyen chia se
    //lay thong tin user dang nhap
    let userLogin = this.userService.getAuthCurrentUser();
    this.contractTemplateService.getEmailShareList(this.idContract, userLogin.organizationId).subscribe(listShared => {
      let isShare = listShared.filter((p:any) => p.email === userLogin.email);
      if(isShare.length > 0){
        this.roleAccess = true;
      }
      this.contractTemplateService.getDetailContractV2(this.idContract).subscribe(rs => {

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
        this.datas = this.data_contract;

        this.allFileAttachment = this.datas.i_data_file_contract.filter((f: any) => f.type == 3);
        this.allFileAttachment = this.allFileAttachment.map((item: any) => ({...item, path: item.path.includes('.txt') ? item.path : item.path.replace("/tmp/","/tmp/v2/")}))
        this.checkIsViewContract();

        if(this.datas.is_data_contract?.created_by == userLogin.id){
          this.roleAccess = true;
        }else{
          if(!this.roleAccess){
            this.roleMess = "Mẫu hợp đồng không còn được chia sẻ đến bạn";
          }else if(this.datas?.is_data_contract?.status==32){
            this.roleMess = "Mẫu hợp đồng đã ngừng phát hành";
          }else if(this.datas?.is_data_contract?.releaseState=='CHUA_CO_HIEU_LUC'){
            this.roleMess = "Mẫu hợp đồng chưa có hiệu lực";
          }else if(this.datas?.is_data_contract?.releaseState=='HET_HIEU_LUC'){
            this.roleMess = "Mẫu hợp đồng hết hiệu lực";
          }
        }

        if(!this.datas?.is_data_contract){
          this.roleMess = "Mẫu hợp đồng không còn tồn tại trên hệ thống";
        }

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
        let data_sign_config_so_tai_lieu = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'so_tai_lieu');

        this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();

        this.datas.contract_user_sign.forEach((element: any) => {
          //
          if (element.sign_unit == 'chu_ky_anh') {
            Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
          } else if (element.sign_unit == 'text') {
            Array.prototype.push.apply(element.sign_config, data_sign_config_text);
          } else if (element.sign_unit == 'so_tai_lieu') {
            Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
          } else if (element.sign_unit == 'chu_ky_so') {
            let targetObject1 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_con_dau_va_thong_tin");
            let targetObject2 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_con_dau");
            let targetObject3 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_thong_tin");
            data_sign_config_cks.forEach((data: any) => {
              if (data.type_image_signature === 3) {
                  data.sign_unit = 'chu_ky_so_con_dau_va_thong_tin';
                  targetObject1.sign_config.push(data);
              }
    
              if (data.type_image_signature === 2) {
                data.height = data.height + 10;
                data.width = data.width + 10;
                data.sign_unit = 'chu_ky_so_con_dau'
                targetObject2.sign_config.push(data);
              }
    
              if (data.type_image_signature === 1) {
                data.sign_unit = 'chu_ky_so_thong_tin'
                targetObject3.sign_config.push(data);
              }
            });
          }
        })
        if(this.datas?.is_data_contract?.type_id){
          this.contractService.getContractTypes(this.datas?.is_data_contract?.type_id).subscribe(data => {
            if (this.datas?.is_data_contract) {
              this.datas.is_data_contract.type_name = data;
            }
          })
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
            fileC = pdfC1.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }
          this.pdfSrc = fileC;
        }
        // render pdf to canvas
        this.getPage();
        this.loaded = true;
      }, (res: any) => {
        // @ts-ignore
        this.handleError();
      })

    });
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

        let canvasWidth: any [] = [];
        for(let i = 1; i <= this.pageNumber; i++) {
          let canvas: any = document.getElementById('canvas-step3-'+i);
          this.top[i] = canvas.height;
          canvasWidth.push(canvas.getBoundingClientRect().left)
        }
        this.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);
        for(let i = 0; i < this.pageNumber; i++) {
          if(canvasWidth[i] == Math.min(...canvasWidth))
          this.arrDifPage.push('min');
          else
          this.arrDifPage.push('max');
        }

        this.setX();
        this.scrollToPage(this.pageNum);
      }, 100)
    })
  }

  scrollToPage(pageNum: number) {
    let canvas = document.getElementById('canvas-step3-' + pageNum);
    let canvas1: any = document.getElementById('pdf-viewer-step-3');
    let pdffull: any = document.getElementById('pdf-full');
    if (canvas && pdffull) {
      pdffull.scrollTo(
        0,
        canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top
      );
    }
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

  // updateCanvasSize() {
  //   // @ts-ignore
  //   // const pdfjs = await import('pdfjs-dist/build/pdf');
  //   // @ts-ignore
  //   // const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  //   // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  //   let canvas = document.createElement('canvas');
  //   canvas.className = 'dropzone';
  //   // canvas.id = 'canvas-step3-' + page;
  //   const canvasList = document.querySelectorAll('.dropzone');
  //   canvasList.forEach((canvas: any) => {
  //     canvas.style.width = this.canvasWidth * this.scale + 'px';
  //     console.log("canvas.style.width",canvas.style.width);
  //     canvas.style.height = this.canvasHeight * this.scale + 'px';
  //     console.log("anvas.style.height",canvas.style.height);
  //   });
  // }

  // changeScale(values: any){
  //   switch (values){
  //     case "-":
  //       if(this.scale > 0.25){
  //         this.scale = this.scale - 0.25;
  //         this.defaultValue = this.scale * 100
  //         this.getPage()

  //       }else{
  //         break;
  //       }
  //       break;
  //     case "+":
  //       if(this.scale < 5){
  //         this.scale = this.scale + 0.25;
  //         this.defaultValue = this.scale * 100
  //         this.getPage()

  //       }else{
  //         break;
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // hàm render các page pdf, file content, set kích thước width & height canvas
  renderPage(pageNumber: any, canvas: any) {
    //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({scale: this.scale});
      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      this.canvasHeight = viewport.height;
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
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 2000);

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
    let style: any =
    (d.sign_unit != 'chu_ky_anh' && d.sign_unit != 'chu_ky_so' && d.sign_unit != 'chu_ky_so_con_dau_va_thong_tin' && d.sign_unit != 'chu_ky_so_con_dau' && d.sign_unit != 'chu_ky_so_thong_tin') ?
    {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    } :
    {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#FFFFFF',
      "border": "1px dashed #6B6B6B",
      "border-radius": "6px",
      "min-width": "66px",
      "min-height": "66px"
    }
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
    }
    if (this.datas.contract_no && d.sign_unit == 'so_tai_lieu') {
      style.padding = '6px';
    }
    return style
  }

  changePositionSignature(d?: any, e?: any, sizeChange?: any) {
      // new-signature-box-style-v2
      let style: any = {
        "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
        "position": "absolute",
        "backgroundColor": '#FFFFFF',
        "border": "1px dashed #6B6B6B",
        "border-radius": "6px",
        "min-width": "180px",
        "min-height": "66px"
      }
      if (d['width']) {
        style.width = parseInt(d['width']) + "px";
      }
      if (d['height']) {
        style.height = parseInt(d['height']) + "px";
      }
      if (this.datas.contract_no && d.sign_unit == 'so_tai_lieu') {
        style.padding = '6px';
      }
      return style
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
        //

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
    //   let arrSignConfig: any = [];
    //   arrSignConfig = this.datas.is_data_object_signature;
      // return this.datas.is_data_object_signature.filter(
      //   (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived
      // );
      return this.datas.is_data_object_signature;
    } else {
      return [];
    }
  }

  processHandleContract() {
    // alert('Luồng xử lý hợp đồng!');
    const data = this.datas;
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleComponent, {
      width: '800px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {

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
    //
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
        //
        //
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

  getNameCoordination() {
    let nameFile = [];
    for (let i = 0; i < this.datas.contract_information.file_related_contract; i++) {

    }
  }

  t() {

  }

  checkIsViewContract() {
    if (this.datas?.is_data_contract?.participants?.length) {
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
    let canvas1: any = document.getElementById('canvas-step3-' + + this.pageNum);

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

  showInformation() {
    this.removePage();
    this.show_information = !this.show_information;
    this.getPage();
  }
}
