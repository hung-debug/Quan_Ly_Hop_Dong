import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminSidebarService {

  toggled = false;
  _hasBackgroundImage = true;
  menus:any[] = [
    {
      title: 'menu.dashboard',
      icon: '/assets/img/db_home.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/dashboard'
    },
   
    {
      title: 'menu.user.list',
      icon: '/assets/img/db_user.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/user'
    },
    {
      title: 'menu.organization.list',
      icon: '/assets/img/db_user_group.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/unit'
    },
    {
      title: 'Gói dịch vụ',
      icon: '/assets/img/db_role.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/pack'
    }
  ];
  
  
  constructor() {
  }

  toggle() {
    this.toggled = ! this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }

  getSubMenuList(menuParent:any) {
    this.menus.forEach((element:any) => {
      if (element === menuParent) {
        console.log(element);
        console.log(element.submenus);
        return element.submenus;
      }
    });
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
