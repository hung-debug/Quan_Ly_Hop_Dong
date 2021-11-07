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
      icon: '/assets/img/db_home.svg',
      active: true,
      type: 'simple',
      href: '/main/dashboard'
    },
    {
      title: 'Tạo mới',
      active: false,
      href: '/main/form-contract/add'
    },
    {
      title: 'Hợp đồng đã tạo',
      icon: '/assets/img/db_processing.svg',
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
      icon: '/assets/img/db_processing.svg',
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
          href: '/main/contract/wait-processing'
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
      icon: '/assets/img/db_processing.svg',
      active: false,
      type: 'simple',
      href: '/main/contract-template'
    },
    {
      title: 'Người dùng',
      icon: '/assets/img/db_user.svg',
      active: false,
      type: 'simple',
      // href: '/main/add-contract'
      href: '/main/contract-template'
    },
    {
      title: 'Tổ chức',
      icon: '/assets/img/db_user_group.svg',
      active: false,
      type: 'simple',
      // href: '/main/add-contract'
      href: '/main/contract-template'
    },
    {
      title: 'Vai trò',
      icon: '/assets/img/db_role.svg',
      active: false,
      type: 'simple',
      // href: '/main/add-contract'
      href: '/main/contract-template'
    },
    {
      title: 'Loại hợp đồng',
      icon: '/assets/img/db_contract_type.svg',
      active: false,
      type: 'simple',
      // href: '/main/add-contract'
      href: '/main/contract-template'
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
