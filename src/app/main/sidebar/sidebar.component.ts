import { ContractService } from 'src/app/service/contract.service';
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
  prevItem: any;
  isHovered = false;
  // prevItem: any = [];

  constructor(
    public sidebarservice: SidebarService,
    private router: Router,
    private contractService: ContractService
  ) {
    this.menus = sidebarservice.getMenuList();
    this.prevItem = undefined;
  }

  ngOnInit() {
    this.sidebarservice.reloadSidebar$.subscribe(() => {
      this.changeSubMenu();
    });
    //this.menus = this.sidebarservice.getMenuList();
    
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  onMouseEnter(currentMenu: any) {
    this.isHovered = true;
    if (!currentMenu.active) {
      currentMenu.icon = currentMenu.iconFill;
    }
  }

  onMouseLeave(currentMenu: any) {
    this.isHovered = false;
    if (!currentMenu.active) {
      currentMenu.icon = currentMenu.iconDefault;
    }
  }

  // switchToFillIcon(icon: string) {
  //   return icon.replaceAll('.svg', '_v2.svg');
  // }

  // switchToDefaultIcon(icon: string) {
  //   return icon.replaceAll('_v2', '');
  // }

  // set active dropdown
  toggle(currentMenu: any) {
    if (currentMenu.type === 'dropdown') {
      currentMenu.activeDrop = true;
      this.menus.forEach((element: any) => {
        if (element === currentMenu) {
          element.icon = currentMenu.iconFill;
          currentMenu.active = !currentMenu.active;
        } else {
          element.icon = currentMenu.iconDefault;
          element.active = false;
          element.activeDrop = false;
        }
      });
    }
  }

  //set active link
  clickLink(currentMenu: any) {
    // currentMenu.icon = currentMenu.iconFill;
    this.menus.forEach((element: any) => {
      if (element === currentMenu) {
        //currentMenu.active = !currentMenu.active;
        element.icon = currentMenu.iconFill;
        element.active = true;
      } else {
        element.icon = element.iconDefault;
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
      this.evenSelectSidebar.emit(routerLink);
      this.contractService.sidebarContractEvent.emit(routerLink);
    } else {
      this.evenSelectSidebar.emit(undefined)
      this.contractService.sidebarContractEvent.emit(undefined);
    }
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
    // if (JSON.parse(localStorage.getItem('coordination_complete'))) {
    //   localStorage.removeItem('coordination_complete')
    // }
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

  changeSubMenu(){
    let currentMenu = this.menus.find((menu: any) => menu.active);
    if(currentMenu.submenus){
      currentMenu.submenus.forEach((submenu: any) => {
        if(submenu.href == this.router.url){
          submenu.active = true;
        } else {
          submenu.active = false;
        }
      });
    }

  }
}
