import { Injectable } from '@angular/core';
import { Helper } from '../core/Helper';

@Injectable({
  providedIn: 'root'
})
export class DetectCoordinateService {

  constructor() { }

  getPage(event: any) {
    const pages = event.relatedTarget.id.split('-');
    const page = Helper._attemptConvertFloat(pages[pages.length - 1]) as any;

    return page;
  }

  getMinCanvasX(pageNumber: number) {
    let arr: any[] = [];
    for(let i = 1; i <= pageNumber; i++) {
      const canvas = document.getElementById("canvas-step3-"+i);
      const canvasInfo = canvas?.getBoundingClientRect();
      arr.push(canvasInfo?.left);
    }

    const minCanvas = Math.min(...arr);
    return minCanvas;
  }

  detectX(event: any, rect_location: any, canvasInfo: any,canvasWidth: any, pageNumber: number) {
    const minCanvas = this.getMinCanvasX(pageNumber);

    const page = this.getPage(event);

    let layerX;
    // @ts-ignore
    if ("left" in canvasInfo) {
      const canvas = document.getElementById('canvas-step3-'+page);

      let width = 0;
      if(canvas) {
        width = canvas.offsetWidth;
      }

      layerX = rect_location.left - minCanvas;
    }

    return layerX;
  }
  

  detectY(event: any, rect_location: any, canvasInfo: any, pageNumber?: any) {
    const page = this.getPage(event);

    let layerY = 0;
     //@ts-ignore
    if ("top" in canvasInfo) {
      layerY = canvasInfo.top <= 0 ? rect_location.top + Math.abs(canvasInfo.top) : rect_location.top - Math.abs(canvasInfo.top);
    }
    if (page > 1) {
        let countPage = 0;
        for (let i = 1; i < page; i++) {
          let canvasElement = document.getElementById("canvas-step3-" + i) as HTMLElement;
          let canvasInfo = canvasElement.getBoundingClientRect();
          console.log("i ",canvasInfo.height)
          countPage += canvasInfo.height;
        }

        let sum = 0;
        for (let i = 1; i <= pageNumber; i++) {
          let canvasElement = document.getElementById("canvas-step3-" + i) as HTMLElement;
          let canvasInfo = canvasElement.getBoundingClientRect();
          console.log("i ",canvasInfo.height)
          sum += canvasInfo.height;
        }

        let divPdf = document.getElementById("pdf-viewer-step-3") as HTMLElement;
        let divPdfInfo = divPdf.getBoundingClientRect();
        let height = divPdfInfo.height;

        console.log("sum ", sum);
        let canvasElement = document.getElementById("canvas-step3-" + page) as HTMLElement;
        let canvasInfo = canvasElement.getBoundingClientRect();

        console.log("height ", height) 

        let deltaPage = (height - sum)/pageNumber;
        console.log("delta page ", deltaPage);
        // @ts-ignore
        layerY = (countPage + canvasInfo.height) - (canvasInfo.height - layerY) + deltaPage*(page - 1);
    }

    console.log("layerY ", layerY);
    
    return layerY;
  }
}
