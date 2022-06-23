import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private _location: Location
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url = route.url.filter((p: any) => (p.path == 'main'))[0];
    if (url) {
      this._location.replace('/login')
      return true;
    } else {
      if (route.queryParams['redirectUrl']) {
        return true;
      }
    }
    return true;
  }

}
