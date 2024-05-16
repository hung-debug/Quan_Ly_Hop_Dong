import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-multi-sign-list',
  templateUrl: './multi-sign-list.component.html',
  styleUrls: ['./multi-sign-list.component.scss']
})
export class MultiSignListComponent implements OnInit {

  idContract: any [] = [];
  idRecipient: any [] = [];

  datas: any;
  allFileAttachment: any[];
  recipient: any;
  canvasWidth = 0;
  loadingText: string = 'Đang xử lý...';
  isDataObjectSignature: any;
  currentUser: any;

  isDataFileContract: any;
  isDataContract: any;

  data_contract: any;
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  arrPage: any = [];

  objPdfProperties: any = {
    pages: [],
  };

  numberContract: number = 1;
  totalContact: number = 1;
  isDisablePrevious: boolean = false;
  isDisableNext: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    //lấy id contract đã tick
    this.route.queryParams.subscribe((params: any) => {
      this.idContract = params.idContract;
      this.totalContact = this.idContract.length;
      this.idRecipient = params.idRecipient;
    })

    this.getDataContractSignature(this.idContract[0]);
    this.checkDisableIcon();
  }

  checkDisableIcon() {
    if(this.idContract.length == 1) {
      this.isDisablePrevious = false;
      this.isDisableNext = false;
    } else if(this.idContract.length >= 2) {
      this.isDisableNext = true;
    }
  }

  previousContract() {
    this.numberContract--;
    if(this.numberContract == 1) {
      this.isDisablePrevious = false;
      this.isDisableNext = true;
    }

    this.getDataContractSignature(this.idContract[this.numberContract - 1]);
  }

  nextContract() {
    this.numberContract++;
    if(this.numberContract == this.totalContact) {
      this.isDisableNext = false;
      this.isDisablePrevious = true;
    }

    this.getDataContractSignature(this.idContract[this.numberContract - 1]);
  }

  numberOnly(event: any) {

  }
  
  typingPage(event: any) {

  }
  

  async getPage() {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf');
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    pdfjs.getDocument(this.pdfSrc).promise.then((pdf: any) => {
        this.thePDF = pdf;
        this.pageNumber = pdf.numPages || pdf.pdfInfo.numPages;
        this.removePage();
        this.arrPage = [];
        for (let page = 1; page <= this.pageNumber; page++) {
          let canvas = document.createElement('canvas');
          this.arrPage.push({ page: page });
          canvas.className = 'dropzone';
          canvas.id = 'canvas-step3-' + page;

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
          // this.setPosition();
        }, 100);
      });
  }

  renderPage(pageNumber: any, canvas: any) {
    setTimeout(() => {
      //@ts-ignore
      this.thePDF.getPage(pageNumber).then((page) => {
        let viewport = page.getViewport({ scale: 1.0 });
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
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
        }, 2000);

        if (test) {
          let paddingPdf =
            (test.getBoundingClientRect().width - viewport.width) / 2;
          $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
          $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
        }
        this.activeScroll();
      });
    }, 100);
  }

  activeScroll() {
    document.getElementsByClassName('viewer-pdf')[0].addEventListener('scroll', () => {
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

  getDataContractSignature(idContact: any) {
    this.contractService.getDetailContract(idContact).subscribe(
      async (rs) => {

        
        this.isDataContract = rs[0];
        this.isDataFileContract = rs[1];
        this.isDataObjectSignature = rs[2];

        this.data_contract = {
          is_data_contract: rs[0],
          i_data_file_contract: rs[1],
          is_data_object_signature: rs[2],
        };

        this.datas = this.data_contract;

        

        if (this.datas?.i_data_file_contract) {
          let fileC = null;
          const pdfC2 = this.datas.i_data_file_contract.find(
            (p: any) => p.type == 2
          );
          const pdfC1 = this.datas.i_data_file_contract.find(
            (p: any) => p.type == 1
          );
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }
          this.pdfSrc = fileC;
        }
    
        this.getPage();

      },
      (res: any) => {
        // @ts-ignore
        this.handleError();
      }
    );
  }

  processHandleContract() {

  }

  scroll(event: any) {

  }

  convertToSignConfig() {
    if (this.datas && this.isDataObjectSignature && this.isDataObjectSignature.length) {
      return this.datas.is_data_object_signature.filter(
        (item: any) =>
          item.recipient ? (item?.recipient?.email === this.currentUser.email &&
          item?.recipient?.role === this.datas?.roleContractReceived): []
      );
    } else {
      return [];
    }
  }

  setPosition() {
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          if (element['coordinate_x'] && element['coordinate_y']) {
            // @ts-ignore
            a.style['z-index'] = '1';
          }
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

  getSignSelect(d: any) {

  }

  changeColorDrag(role: any, valueSign: any, isDaKeo?: any) {
    if (isDaKeo && !valueSign.valueSign) {
      return 'ck-da-keo';
    } else if (!valueSign.valueSign) {
      return 'employer-ck';
    } else {
      return '';
    }
  }

  changePosition(d?: any, e?: any, sizeChange?: any, backgroundColor?: string) {
    let style: any = {
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: backgroundColor,
    };
    style.backgroundColor = d.valueSign ? '' : backgroundColor;
   
    if (d['width']) {
      style.width = parseInt(d['width']) + 'px';
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + 'px';
    }

    return style;
  }

}
