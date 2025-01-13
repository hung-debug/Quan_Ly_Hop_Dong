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
    } else if (code == 'expired' || code == 'exprire') {
      return this.translate.instant('contract.status.overdue');
    } else if (code == 'prepare_expires') {
      return this.translate.instant('prepare_expires');
    } else if(code == 'signed') {
      return this.translate.instant('contract.status.complete');
    } else if(code == 'total') {
      return this.translate.instant('total');
    } else if(code == 'draff') {
      return this.translate.instant('contract.status.draft');
    } else if(code == 'created') {
      return this.translate.instant('dashboard.contract.created');
    } else if(code == 'liquidated') {
      return this.translate.instant('liquidated');
    }
    return code;
  }
}
