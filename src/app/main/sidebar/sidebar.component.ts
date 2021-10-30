import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';
// import { MenusService } from './menus.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Output() evenSelectSidebar = new EventEmitter<string>();
  menus:any = [];
  subMenus:any = [];
  constructor(
    public sidebarservice: SidebarService,
    private router: Router
    ) {
    this.menus = sidebarservice.getMenuList();
   }

  ngOnInit() {
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  // set active dropdown
  toggle(currentMenu:any) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach((element:any) => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  //set active link
  clickLink(currentMenu:any, nameFeature?: string){
    this.menus.forEach((element:any) => {
      if (element === currentMenu) {
        currentMenu.active = !currentMenu.active;
      } else {
        element.active = false;
      }
    });
    if (nameFeature && nameFeature == "create-contract-new") {
      this.evenSelectSidebar.emit(nameFeature)
    } else this.evenSelectSidebar.emit(undefined)
    this.router.navigate(['/' + currentMenu.href]);
  }

  //set active link child
  clickLinkSub(currentMenu:any, currentSubMenu:any){
    //find parent
    this.menus.forEach((element:any) => {
      if (element === currentMenu) {
        this.subMenus = element.submenus;
        //set active child
        this.subMenus.forEach((elementSub:any) => {
          if (elementSub === currentSubMenu) {
            currentSubMenu.active = !currentSubMenu.active;
          } else {
            elementSub.active = false;
          }
        });
      }
    });

    //set parent active
    currentMenu.active = true;
    this.getState(currentMenu);
    this.router.navigate(['/' + currentSubMenu.href]);
  }

  //set state dropdown
  getState(currentMenu:any) {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

}
