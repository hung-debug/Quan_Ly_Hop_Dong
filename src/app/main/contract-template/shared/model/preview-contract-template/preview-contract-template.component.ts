import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Helper } from 'src/app/core/Helper';
import * as $ from 'jquery';


@Component({
  selector: 'app-preview-contract-template',
  templateUrl: './preview-contract-template.component.html',
  styleUrls: ['./preview-contract-template.component.scss']
})
export class PreviewContractTemplateComponent implements OnInit {

  pdfSrc: any;
  thePDF: any;
  pageNumber: number = 1;
  arrPage: any = [];
  datas: any;
  canvasWidth: any;
  objPdfProperties: any = {
    pages: [],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PreviewContractTemplateComponent>,
  ) { }

  ngOnInit(): void {
    this.datas = this.data;

    if (this.datas.is_action_contract_created) {
      if (this.datas.uploadFileContractAgain) {
        this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
      } else {
        let fileContract_1 = this.datas.i_data_file_contract.filter((p: any) => p.type == 1)[0];
        let fileContract_2 = this.datas.i_data_file_contract.filter((p: any) => p.type == 2)[0];
        if (fileContract_2) {
          this.pdfSrc = fileContract_2.path;
        } else {
          this.pdfSrc = fileContract_1.path;
        }
      }
    } else {
      this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
    }

    this.getPage();
  }

  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.contract_user_sign];
    cloneUserSign.forEach(element => {
      if (this.datas.is_action_contract_created) {
        if ((element.recipient && ![2, 3].includes(element.recipient.status)) || (!element.recipient && ![2, 3].includes(element.status))) {
          arrSignConfig = arrSignConfig.concat(element.sign_config);
        }
      } else {
        arrSignConfig = arrSignConfig.concat(element.sign_config);
      } 
    })

    return arrSignConfig;
  }

  getSignSelect(d: any) {

  }

  changeColorDrag(role: any, valueSign: any) {
    if (!valueSign.text_attribute_name && valueSign.sign_unit != 'text' && valueSign.sign_unit != 'so_tai_lieu') {
      return 'ck-da-keo';
    } else {
      return 'employer-ck';
    }
  }

  preventPdf(event: any) {

  }

  changePosition(d?: any, e?: any, sizeChange?: any) {

    

    let style: any = {

    };

    if(d.sign_unit != 'text' && d.sign_unit != 'so_tai_lieu') {
      // 
      style = {
        "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
        "position": "absolute",
        "backgroundColor": '#EBF8FF'
      }
    } else {
      const font_size = d.font_size ? d.font_size : 13;
      
      if(d.sign_unit == 'text' || d.sign_unit == 'so_tai_lieu') {
        style = {
          "transform": 'translate(' + d['coordinate_x'] + 'px, ' + Number(d['coordinate_y']+Number(d['height'])-Number(font_size)*1.3 - 1) + 'px)',
          "position": "absolute",
          // "left":"0px",
          // "bottom":"0px"
        }
      } 
      
      // else if(d.sign_unit == 'so_tai_lieu') {
      //   style = {
      //     "transform": 'translate(' + d['coordinate_x'] + 'px, ' + Number(Number(d['coordinate_y']) + 5) + 'px)',
      //     "position": "absolute",
      //   }
      // }
       
    }
  
    if (d['width'] && (d.sign_unit != 'text' && d.sign_unit != 'so_tai_lieu')) {
      style.width = parseInt(d['width']) + "px";
    }
    if (d['height'] && (d.sign_unit != 'text' && d.sign_unit != 'so_tai_lieu')) {
      style.height = parseInt(d['height']) + "px";
    }
    if (this.datas.contract_no && d.sign_unit == 'so_tai_lieu') {
      // style.padding = '6px';
    }
    return style;
  }

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
          this.arrPage.push({ page: page });
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
      
      })
  }

  removePage() {

  }

  renderPage(pageNumber: any, canvas: any) {
     //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({ scale: 1.0 });
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
          // @ts-ignore
          // document.getElementById('thumbnail-canvas').scrollTop = $(selector).offset().top - 95;
        }
      });
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
