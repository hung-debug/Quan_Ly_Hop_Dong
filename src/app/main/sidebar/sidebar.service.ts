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
      icon: '	fa fa-home',
      active: false,
      type: 'simple',
      href: '/main/dashboard'
    },
    {
      title: 'Hợp đồng đã tạo',
      icon: 'fa fa-file-pdf-o',
      active: false,
      type: 'dropdown',
      badge: {
        text: '6',
        class: 'badge-danger'
      },
      href: '#',
      submenus: [
        {
          title: 'Danh sách',
          href: '/main/contract'
        },
        {
          title: 'Tạo mới',
          href: '/main/add-contract'
        },
        {
          title: 'Bản nháp',
          href: '/main/add-contract'
        },
        {
          title: 'Đang xử lý',
          href: '/main/add-contract'
        },
        {
          title: 'Quá hạn',
          href: '/main/add-contract'
        },
        {
          title: 'Từ chối',
          href: '/main/add-contract'
        },
        {
          title: 'Hoàn thành',
          href: '/main/add-contract'
        }
      ]
    },
    {
      title: 'Hợp đồng đã nhận',
      icon: 'fa fa-file-pdf-o',
      active: false,
      type: 'dropdown',
      badge: {
        text: '160',
        class: 'badge-danger'
      },
      href: '#',
      submenus: [
        {
          title: 'Danh sách',
          href: '/main/contract'
        },
        {
          title: 'Bản nháp',
          href: '/main/add-contract'
        },
        {
          title: 'Đang xử lý',
          href: '/main/add-contract'
        },
        {
          title: 'Quá hạn',
          href: '/main/add-contract'
        },
        {
          title: 'Từ chối',
          href: '/main/add-contract'
        },
        {
          title: 'Hoàn thành',
          href: '/main/add-contract'
        }
      ]
    },
    {
      title: 'Mẫu hợp đồng',
      icon: 'fa fa-shopping-cart',
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
      icon: '	fa fa-institution',
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
      icon: '	fa fa-clone',
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

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
