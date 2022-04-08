import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {SidebarService} from './sidebar.service';
import {Router} from '@angular/router';

// import { MenusService } from './menus.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({height: 0})),
      state('down', style({height: '*'})),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Output() evenSelectSidebar = new EventEmitter<string>();
  menus: any = [];
  subMenus: any = [];

  constructor(
    public sidebarservice: SidebarService,
    private router: Router
  ) {
    this.menus = sidebarservice.getMenuList();
  }

  ngOnInit() {
    this.menus.forEach((element: any) => {
      element.active = false;
      if (element.href != '#') {
        if (this.router.url.includes(element.href)) {
          element.active = true;
        }
      } else {
        this.subMenus = element.submenus;
        element.activeDrop = false;
        element.active = false;
        this.subMenus.forEach((elementSub: any) => {
          if (this.router.url.includes(elementSub.href)) {
            element.activeDrop = true;
            element.active = true; 
            elementSub.active = true;
          } else {
            elementSub.active = false;
          }
        });
      }
    });
    console.log(this.menus);
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }


  // set active dropdown
  toggle(currentMenu: any) {
    console.log(currentMenu);
    if (currentMenu.type === 'dropdown') {
      currentMenu.activeDrop = true;
      this.menus.forEach((element: any) => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
          element.activeDrop = false;
        }
      });
    }
  }

  //set active link
  clickLink(currentMenu: any) {
    
    this.menus.forEach((element: any) => {
      if (element === currentMenu) {
        //currentMenu.active = !currentMenu.active;
        element.active = true;
      } else {
        element.active = false;
        element.activeDrop = false;
      }
    });
    // if (sessionStorage.getItem('copy_right_show')) {
    //   sessionStorage.removeItem('copy_right_show');
    // }
    // if (nameFeature && nameFeature == "create-contract-new") {
    //   this.evenSelectSidebar.emit(nameFeature)
    // } else
    //   this.evenSelectSidebar.emit(undefined)
    this.router.navigate(['/' + currentMenu.href]);
    this.getRemoveLocal();
  }

  //set active link child
  clickLinkSub(currentMenu: any, currentSubMenu: any, routerLink: string) {
    //find parent
    this.menus.forEach((element: any) => {
      if (element === currentMenu) {
        this.subMenus = element.submenus;
        //set active child
        this.subMenus.forEach((elementSub: any) => {
          if (elementSub === currentSubMenu) {
            //currentSubMenu.active = !currentSubMenu.active;
            elementSub.active = true;
          } else {
            elementSub.active = false;
          }
        });
      }
    });

    if (routerLink == 'contract-signature') {
      this.evenSelectSidebar.emit(routerLink)
    } else
      this.evenSelectSidebar.emit(undefined)
    //set parent active
    currentMenu.active = true;
    this.getState(currentMenu);
    this.router.navigate(['/' + currentSubMenu.href]);
    this.getRemoveLocal();
  }

  //set state dropdown
  getState(currentMenu: any) {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

  getRemoveLocal() {
    //@ts-ignore
    if (JSON.parse(localStorage.getItem('coordination_complete'))) {
      localStorage.removeItem('coordination_complete')
    }
    //@ts-ignore
    if (JSON.parse(localStorage.getItem('data_coordinates_contract_id'))) {
      localStorage.removeItem('data_coordinates_contract_id');
    }
  }

  openDashboard(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //   this.router.navigate(['/main/dashboard']);
    // });
  }

}
