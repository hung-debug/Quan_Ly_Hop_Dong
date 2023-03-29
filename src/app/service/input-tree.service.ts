import { Injectable } from '@angular/core';
import { UnitService } from './unit.service';

@Injectable({
  providedIn: 'root',
})
export class InputTreeService {
  lang: any;
  listOrgCombobox: any[];

  constructor(private unitService: UnitService) {}

  async getListOrg() {
    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    let orgListTmp: any[] = [];
    let orgList: any[] = [];

    const unitList = await this.unitService.getUnitList('', '').toPromise();

    // if (this.lang == 'vi') orgListTmp.push({ name: 'Tất cả', id: '' });
    // else if (this.lang == 'en') orgListTmp.push({ name: 'All', id: '' });

    let dataUnit = unitList.entities.sort((a: any, b: any) =>
      a.path.toString().localeCompare(b.path.toString())
    );
    for (var i = 0; i < dataUnit.length; i++) {
      orgListTmp.push(dataUnit[i]);
    }

    orgList = orgListTmp;

    let array_empty: any[] = [];
    orgList.forEach((element: any, index: number) => {
      let dataChildren = this.findChildren(element, orgList);
      let data: any = '';
      data = {
        label: element.name,
        data: element.id,
        expanded: true,
        children: dataChildren,
      };

      array_empty.push(data);
    });
    this.listOrgCombobox = array_empty;
  }

  async getData() {
    await this.getListOrg();
    return this.listOrgCombobox;
  }

  findChildren(element: any, orgList: any) {
    let dataChildren: any[] = [];
    let arrCon = orgList.filter((p: any) => p.parent_id == element.id);

    arrCon.forEach((elementCon: any, indexCOn: number) => {
      let is_edit = false;

      dataChildren.push({
        label: elementCon.name,
        data: elementCon.id,
        expanded: true,
        children: this.findChildren(elementCon, orgList),
      });
      this.removeElementFromStringArray(elementCon.id, orgList);
    });
    return dataChildren;
  }

  removeElementFromStringArray(element: string, orgList: any) {
    orgList.forEach((value: { id: string }, index: any) => {
      if (value.id == element) {
        orgList.splice(index, 1);
      }
    });
  }
}
