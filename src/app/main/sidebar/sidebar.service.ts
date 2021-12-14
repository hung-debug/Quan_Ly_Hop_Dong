import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  _hasBackgroundImage = true;
  menus = [
    {
      title: 'menu.dashboard',
      icon: '/assets/img/db_home.svg',
      active: false,
      type: 'simple',
      href: '/main/dashboard'
    },
    {
      title: 'menu.contract.add',
      active: false,
      type: 'button',
      href: '/main/form-contract/add'
    },
    {
      title: 'menu.contract.create.list',
      icon: '/assets/img/db_processing.svg',
      active: false,
      type: 'dropdown',
      href: '#',
      submenus: [
        {
          title: 'contract.status.draft',
          active: false,
          href: '/main/contract/create/draft'
        },
        {
          title: 'contract.status.processing',
          active: false,
          href: '/main/contract/create/processing'
        },
        {
          title: 'contract.status.expire',
          active: false,
          href: '/main/contract/create/expire'
        },
        {
          title: 'contract.status.overdue',
          active: false,
          href: '/main/contract/create/overdue'
        },
        {
          title: 'contract.status.fail',
          active: false,
          href: '/main/contract/create/fail'
        },
        {
          title: 'contract.status.cancel',
          active: false,
          href: '/main/contract/create/cancel'
        },
        {
          title: 'contract.status.complete',
          active: false,
          href: '/main/contract/create/complete'
        }
      ]
    },
    {
      title: 'menu.contract.receive.list',
      icon: '/assets/img/db_processing.svg',
      active: false,
      type: 'dropdown',
      href: '#',
      submenus: [
        {
          title: 'contract.status.wait-processing',
          active: false,
          href: '/main/contract-signature/receive/wait-processing'
          // href: '/main/contract/receive/wait-processing'
        },
        {
          title: 'contract.status.processed',
          active: false,
          href: '/main/contract-signature/receive/processed'
          // href: '/main/contract/receive/processed'
        }
      ]
    },
    {
      title: 'menu.contract.template.list',
      icon: '/assets/img/db_processing.svg',
      active: false,
      type: 'simple',
      href: '/main/contract-template'
    },
    {
      title: 'menu.user.list',
      icon: '/assets/img/db_user.svg',
      active: false,
      type: 'simple',
      href: '/main/user'
    },
    {
      title: 'menu.organization.list',
      icon: '/assets/img/db_user_group.svg',
      active: false,
      type: 'simple',
      href: '/main/organization'
    },
    {
      title: 'menu.role.list',
      icon: '/assets/img/db_role.svg',
      active: false,
      type: 'simple',
      href: '/main/role'
    },
    {
      title: 'menu.contract.type.list',
      icon: '/assets/img/db_contract_type.svg',
      active: false,
      type: 'simple',
      href: '/main/contract-type'
    }
  ];
  constructor() { }

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
