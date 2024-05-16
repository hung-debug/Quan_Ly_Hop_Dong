import { Injectable } from '@angular/core';
import { string32 } from 'pdfjs-dist/types/src/shared/util';

@Injectable({
  providedIn: 'root'
})
export class AdminSidebarService {

  toggled = false;
  _hasBackgroundImage = true;
  menus:any[] = [
    {
      id: 1,
      title: 'Người dùng',
      icon: '/assets/img/db_user.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/user'
    },
    {
      id: 0,
      title: 'Tổ chức',
      icon: '/assets/img/db_user_group.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/unit'
    },
    {
      id: 2,
      title: 'Gói dịch vụ',
      icon: '/assets/img/db_role.svg',
      active: false,
      type: 'simple',
      href: '/admin-main/pack'
    }
  ];

  selectedRoleConvert: any[];
    
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

  getMenuList(): any[] {
    const permissions = JSON.parse(localStorage.getItem('currentAdmin') || '').user.permissions;

    const menuShow = [];

    this.selectedRoleConvert = [];

    permissions.forEach((key: any) => {
      let jsonData = { code: key.code, name: key.name};
      this.selectedRoleConvert.push(jsonData);
    });

    let qlnd = false;
    let qltc = false;
    let qlgdv = false;

    for(let i = 0; i < this.selectedRoleConvert.length; i++) {
      let role = this.selectedRoleConvert[i].code;

      if(role.includes("QLND") && qlnd === false) {
        menuShow.push(this.menus[0]);
        qlnd = true;
      }

      if(role.includes("QLTC") && qltc === false) {
        menuShow.push(this.menus[1]);
        qltc = true;
      }

      if(role.includes("QLGDV") && qlgdv === false) {
        menuShow.push(this.menus[2]);
        qlgdv = true;
      }
    }

    menuShow.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

    
  
    return menuShow;
  }

  getSubMenuList(menuParent:any) {
    this.menus.forEach((element:any) => {
      if (element === menuParent) {
        
        
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
