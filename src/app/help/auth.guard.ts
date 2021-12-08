import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return this.authService.isAuthorized;
    localStorage.setItem('url', state.url);
    console.log(localStorage.getItem('url'));
    console.log(localStorage.getItem('currentUser'));
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
