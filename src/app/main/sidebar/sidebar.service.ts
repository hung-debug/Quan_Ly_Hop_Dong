import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  _hasBackgroundImage = true;
  menus = [
    {
      title: 'Trang chủ',
      icon: 'fa fa-dashboard',
      active: true,
      type: 'simple',
      href: '/main/dashboard'
    },
    {
      title: 'Tạo mới',
      active: false,
      href: '/main/add-contract'
    },
    {
      title: 'Hợp đồng đã tạo',
      icon: 'fa fa-file-pdf-o',
      active: false,
      type: 'dropdown',
      // badge: {
      //   text: '6',
      //   class: 'badge-danger'
      // },
      href: '#',
      submenus: [
        {
          title: 'Bản nháp',
          active: false,
          href: '/main/contract/draft'
        },
        {
          title: 'Đang xử lý',
          active: false,
          href: '/main/contract/processing'
        },
        {
          title: 'Sắp hết hạn',
          active: false,
          href: '/main/contract/expire'
        },
        {
          title: 'Quá hạn',
          active: false,
          href: '/main/contract/overdue'
        },
        {
          title: 'Từ chối',
          active: false,
          href: '/main/contract/fail'
        },
        {
          title: 'Hủy bỏ',
          active: false,
          href: '/main/contract/cancel'
        },
        {
          title: 'Hoàn thành',
          active: false,
          href: '/main/contract/complete'
        }
      ]
    },
    {
      title: 'Hợp đồng đã nhận',
      icon: 'fa fa-file-pdf-o',
      active: false,
      type: 'dropdown',
      // badge: {
      //   text: '160',
      //   class: 'badge-danger'
      // },
      href: '#',
      submenus: [
        {
          title: 'Chờ xử lý',
          active: false,
          href: '/main/contract/processing'
        },
        {
          title: 'Đang xử lý',
          active: false,
          href: '/main/contract/processing'
        },
        {
          title: 'Đã hoàn thành',
          active: false,
          href: '/main/contract/complete'
        }
      ]
    },
    {
      title: 'Mẫu hợp đồng',
      icon: 'fa fa-building-o',
      active: false,
      type: 'simple',
      href: '/main/add-contract'
    },
    {
      title: 'Người dùng',
      icon: 'fa fa-user',
      active: false,
      type: 'simple',
      href: '/main/add-contract'
    },
    {
      title: 'Tổ chức',
      icon: 'fa fa-users',
      active: false,
      type: 'simple',
      href: '/main/add-contract'
    },
    {
      title: 'Vai trò',
      icon: 'fa fa-puzzle-piece',
      active: false,
      type: 'simple',
      href: '/main/add-contract'
    },
    {
      title: 'Loại hợp đồng',
      icon: 'fa fa-cube',
      active: false,
      type: 'simple',
      href: '/main/add-contract'
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
