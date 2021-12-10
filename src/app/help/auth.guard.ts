import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return this.authService.isAuthorized;
    localStorage.setItem('url', state.url);
    let is_local = localStorage.getItem('url');
    if (is_local?.includes('loginType')) {
      let dataLoginType = is_local.split("loginType")[is_local.split("loginType").length - 1];
      if (dataLoginType == "=1") {
        localStorage.setItem('urlLoginType', JSON.stringify({loginType: true}));
      }
    }
    console.log(localStorage.getItem('url'));
    console.log(localStorage.getItem('currentUser'));

    let url = next.url.filter((p: any) => (p.path == 'main'))[0];
    if (url && !localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
      return false;
    } else {
      if (localStorage.getItem('currentUser') != null) {
        console.log(localStorage.getItem('currentUser'));
        return true;
      } else {
        console.log("No Log in")
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}
