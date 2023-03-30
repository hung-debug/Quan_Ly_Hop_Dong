import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ConvertStatusService {
  constructor(
    private translate: TranslateService
  ) {}

  convert(code: string) {
    if (code == 'processed') {
      return this.translate.instant('contract.status.complete');
    } else if (code == 'processing') {
      return this.translate.instant('contract.status.processing');
    } else if (code == 'canceled' || code == 'cancel') {
      return this.translate.instant('contract.status.cancel');
    } else if (code == 'rejected') {
      return this.translate.instant('contract.status.fail');
    } else if (code == 'expired') {
      return this.translate.instant('contract.status.overdue');
    } else if (code == 'prepare_expires') {
      return this.translate.instant('prepare_expires');
    } else if(code == 'signed') {
      return this.translate.instant('contract.signed');
    } else if(code == 'total') {
      return this.translate.instant('total');
    }
    return code;
  }
}
