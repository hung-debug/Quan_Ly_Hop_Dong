import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';

@Injectable()
export class AppService {
  private title = new BehaviorSubject<String>('App title');
  private title$ = this.title.asObservable();
  private subTitle = new BehaviorSubject<String>('');
  private subTitle$ = this.subTitle.asObservable();

  constructor() {}

  setTitle(title: String) {
    this.title.next(title);
  }

  setSubTitle(subTitle: String) {
    this.subTitle.next(subTitle);
  }

  getTitle(): Observable<String> {
    return this.title$;
  }

  getSubTitle(): Observable<String> {
    return this.subTitle$;
  }
}
