import {Injectable} from "@angular/core";
declare var $: any;

@Injectable()
export class Helper {
  static _getUrlPdf(pdf_file: any, application?: any) {
    const b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
    const blob = b64toBlob(pdf_file, !application ? "application/pdf" : application);
    const blobUrl = URL.createObjectURL(blob);
    var objectUrl = window.URL.createObjectURL(blob);
    return objectUrl;
  }
  static _attemptConvertFloat(str: any) {
    // let tem = str.replace(",", "");
    if (str) {// && str.trim()) {
      const tem = str.replace(new RegExp(',', 'g'), '');
      return parseFloat(tem);
    } else {
      return null;
    }
  }
}

