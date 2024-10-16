import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteInterceptorService {

  // constructor(private router: Router) {
  //   this.initializeRouteInterceptor();
  // }

  // private initializeRouteInterceptor(): void {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationStart) {
  //       // Check if the target is '/login' route
  //       if (event.url === '/login') {
  //         this.handleLoginRedirect();
  //       }
  //     }
  //   });
  // }

  // private handleLoginRedirect(): void {
  //   // Implement your condition check logic here
  //   const conditionMet = this.checkCondition();

  //   if (conditionMet) {
  //     // Redirect to new login if the condition is met
  //     this.router.navigate(['/new-login']);
  //   } else {
  //     // Redirect to old login (or continue to '/login')
  //     this.router.navigate(['/login']);
  //   }
  // }

  // private checkCondition(): boolean {
  //   // Example condition logic
  //   return false;
  // }
}